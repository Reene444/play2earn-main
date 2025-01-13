const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    username: { type: String},
    tasks_completed: { type: Number},
    total_rewards: { type: Number},
    createdAt: { type: Date, default: Date.now },
  });

// console.log(dataSchema)
module.exports = mongoose.model("users", dataSchema);


