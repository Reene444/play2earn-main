const express = require("express");
const UserModel = require("../models/User");
// mit prajapati (auth)
const nodemailer = require("nodemailer");
const { request } = require("http");
require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
  sign_up,
  log_in,
  requestUserPasswordReset,
  passwordSet,
} = require("../controllers/userController");
const cookieParser = require("cookie-parser");
const User = require("../models/User");

const router = express.Router();
// router.use(express.json());

router.post("/user_data", getUserProfile);
router.patch("/:id", updateUserProfile);
router.delete("/:id", deleteUser);
router.get("/", getAllUsers);

// mit prajapati (authentication system)

// code for generating the reference code...
function generateReferralCode(firstName, lastName) {
  const data = `${firstName}-${crypto.randomInt(100000, 999999)}-${lastName}`;
  const hash = crypto.createHash("sha256").update(data).digest("hex");

  // Truncate the hash to the first 8 characters (you can choose a different length)
  const referralCode = hash.substring(0, 10);
  return referralCode;
}

router.post("/sign_up", (request, response) => {
  const { firstName, lastName, username, email, password, refBy } = request.body;

  // const username = firstName + crypto.randomInt(100000, 999999);
  const int_userId = crypto.randomInt(10000000000, 999999999999);
  // Check if a user with the given email already exists
  UserModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        // If the user is found, send a response indicating the email is already in use
        return response.status(400).json({ error: "Email already exists" });
      } else {
        // Generate the referral code and create the new user
        const userRefNum = generateReferralCode(firstName, lastName);

        UserModel.create({
          firstName,
          lastName,
          username,
          email,
          password,
          userRefNum,
          refBy,
          int_userId
        })
          .then((newUser) => response.status(201).json(newUser))
          .catch((err) => {
            console.error("Error creating user:", err);
            response.status(500).json({ error: "Error creating user" });
          });
      }
    })
    .catch((err) => {
      console.error("Error finding user:", err);
      response.status(500).json({ error: "Error finding user" });
    });
});

// jwt token generator for log in

const tokenGenerator = (payload) => {
  const exp = {
    expiresIn: "24h",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, exp);
  return token;
};

// router.use(cookieParser());

router.post("/log_in", (request, response) => {
  const { email, password } = request.body;
  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        const payload = { _id: user._id};
        const uniqueToken = tokenGenerator(payload);

        user.token = uniqueToken
        user.save()
        response.cookie("token", uniqueToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        })
        response.json({ message: 'success' });

      } else {
        response.json("The credentials are incorrect");
      }
    } else {
      response.json("User doesn't exist");
    }
  });
});

router.post("/requestUserPasswordReset", (request, response) => {
  const { email } = request.body;
  UserModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        const otp = crypto.randomInt(100000, 999999);
        user.otp = otp;
        user.otpExpires = Date.now() + 3600000; // 1 hour
        user.save();

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "playearnai.noreply@gmail.com",
            pass: "htcspcsiaiykuklx",
          },
        });

        const mailOptions = {
          to: user.email,
          from: process.env.EMAIL,
          subject: "Password Reset",
          text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                    Here is the code which you need to enter:${otp}\n\n
                    This code will be expire in one hour, and please make sure that you do not share with anyone else for security reason.
                    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            console.error("There was an error: ", err);
            return response.status(500).json({ error: "Failed to send email" });
          } else {
            return response
              .status(200)
              .json({ message: "Password reset email sent" });
          }
        });
      } else {
        return response.status(404).json({ error: "User is not found" });
      }
    })
    .catch((err) => response.status(500).json({ error: err.message }));
});

router.post("/passwordSet", (request, response) => {
  const { otp, newPassword } = request.body;
  UserModel.findOne({ otp: otp })
    .then((user) => {
      if (otp) {
        user.password = newPassword;
        user.save();
        response.json("correct");
      } else {
        response.json("OTP is incorrect. Try again!");
      }
    })
    .catch((err) => {
      response.status(500).json({ message: "Error finding user.", error: err });
    });
});

// logout

router.post("/logout", (req, res) => {
  try {
    // Clear the token cookie by setting it to an empty value with an expired date
    res.clearCookie("token", {
      httpOnly: true, // Make sure it's the same settings as when the cookie was set
      secure: true, // Secure flag (if using HTTPS)
      sameSite: "strict", // sameSite (must match the settings used when setting the cookie)
    });

    // Send a success response after clearing the cookie
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res
      .status(500)
      .json({ message: "Error during logout", error: error.message });
  }
});

// for each referesh the token will gonna be checked

router.get("/check", (req, res) => {
  // console.log('Request received at /check');
  // console.log('Cookies:', req.cookies);

  const token = req.cookies.token;
  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authentication failed" });
    }

    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    return res
      .status(200)
      .json({ message: "Authenticated", user: verifiedUser });
  } catch (err) {
    console.error("Server error:", err);
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
