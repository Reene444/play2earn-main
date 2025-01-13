const mongoose = require("mongoose");

// schema
const leaderboardSchema = new mongoose.Schema({
  username: { type: String, required: true },
  total_rewards: { type: Number, required: true },
});

// 
const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema, "users");

module.exports = Leaderboard;