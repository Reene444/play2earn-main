const express = require("express");
const Admin = require("../models/admin");

const router = express.Router();

// Admin login
router.post("/log_in", async (req, response) => {
  const { email, password } = req.body;
  console.log("jj")

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("Admin not found");
      return response.status(404).json({ message: "Admin does not exist" });
    }

    if (password !== admin.password) {
      console.log("Invalid password");
      return response.status(401).json({ message: "Incorrect password" });
    }

    // console.log("Login successful");
    response.json({ message: 'success' });

  } catch (error) {
    console.error("Error during login:", error);
    return response.status(500).json({ message: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const newAdmin = new Admin({ email, password });
    await newAdmin.save();
    return res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
