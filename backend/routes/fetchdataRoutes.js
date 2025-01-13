const express = require('express');
const router = express.Router();
const UserModel = require("../models/User");
const mongoose = require('mongoose');

// Fetch referral info for a specific user
router.get("/user/:email/referral-info", async (req, res) => {
  // const username = req.params.username;
  // console.log("reached")
  const email = req.params.email;


// Validate if userId is a valid MongoDB ObjectId
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json({ error: "Invalid user ID format" });
//   }

  try {
    // Find the user by the given userId
    const user = await UserModel.findOne({email: email});
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract the refnum from the user
    const refNum = user.userRefNum;
    
    if (!refNum) {
      return res.status(404).json({ error: "User reference number not found" });
    }

    // Count how many users have this refnum in their refby field
    const referredUsersCount = await UserModel.countDocuments({ refBy: refNum });

    // Return the user's refnum and the number of referred users
    return res.status(200).json({
      refnum: refNum,
      referredUsersCount: referredUsersCount
    });
  } catch (err) {
    console.error("Error fetching user referral info:", err);
    return res.status(500).json({ error: "Server error fetching user referral info" });
  }
});

module.exports = router;
