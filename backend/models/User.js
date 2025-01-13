const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// task progress (mit prajapati)
const TaskProgressSchema = new mongoose.Schema({
  task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true
  },
  status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started'
  },
  score: {
      type: Number,
      default: 0
  },
  lastUpdated: {
      type: Date,
      default: Date.now
  }
});

const UserSchema = new mongoose.Schema(
  {
    // mit prajapati (auth)
    firstName: {
      type: String,
      required: true,
    },

    // mit prajapati (auth)
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // profile_pic_url: {
    //     type: String,
    //     default: null,
    // },
    tasks_completed: {
      type: Number,
      default: 0,
    },
    total_rewards: {
      type: Number,
      default: 0,
    },

    // mit prajapati (auth)
    otp: {
      type: Number,
      unique: true,
    },

    // mit prajapati (auth)
    otpExpires: {
      type: Date,
      unique: true,
    },

    userRefNum: {
      type: String,
      unique: true,
    },

    refBy: {
      type: String,
      unique: true,
    },

    int_userId: {
      type: String,
      unique: true,
    },
    // mit prajapati (user progress)
    taskProgress: [TaskProgressSchema] // Array of task progress sub-documents
  },
  { timestamps: true }
);

// module.exports = mongoose.model("User", UserSchema);
// user progress (mit prajapati)
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
