const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const mongoose = require('mongoose');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'follow-task-screenshots',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif']
  },
});

const upload = multer({ storage: storage });

  const FollowSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
    tasks: {
        twitter: [{ 
            accountLink: String,
            completed: { type: Boolean, default: false },
            completedAt: Date,
            screenshotUrl: String,
            points: { type: Number, default: 0 },
            shared: { type: Boolean, default: false },
            sharePoints: { type: Number, default: 0 }
        }],
        linkedin: [{ 
            accountLink: String,
            completed: { type: Boolean, default: false },
            completedAt: Date,
            screenshotUrl: String,
            points: { type: Number, default: 0 },
            shared: { type: Boolean, default: false },
            sharePoints: { type: Number, default: 0 }
        }],
        telegram: [{ 
            accountLink: String,
            completed: { type: Boolean, default: false },
            completedAt: Date,
            screenshotUrl: String,
            points: { type: Number, default: 0 },
            shared: { type: Boolean, default: false },
            sharePoints: { type: Number, default: 0 }
        }],
        youtube: [{ 
            accountLink: String,
            completed: { type: Boolean, default: false },
            completedAt: Date,
            screenshotUrl: String,
            points: { type: Number, default: 0 },
            shared: { type: Boolean, default: false },
            sharePoints: { type: Number, default: 0 }
        }],
        instagram: [{ 
            accountLink: String,
            completed: { type: Boolean, default: false },
            completedAt: Date,
            screenshotUrl: String,
            points: { type: Number, default: 0 },
            shared: { type: Boolean, default: false },
            sharePoints: { type: Number, default: 0 }
        }],
        tiktok: [{ 
            accountLink: String,
            completed: { type: Boolean, default: false },
            completedAt: Date,
            screenshotUrl: String,
            points: { type: Number, default: 0 },
            shared: { type: Boolean, default: false },
            sharePoints: { type: Number, default: 0 }
        }]
    }, 
    totalPoints: { type: Number, default: 0 }
});

const User = mongoose.model('Follow', FollowSchema);

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  platform: String,
  accountLink: String,
  reward: Number
});

const FollowTask = mongoose.model('FollowTask', TaskSchema, 'followtasks');

router.get('/api/follow-tasks', async (req, res) => {
  try {
    const tasks = await FollowTask.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({ 
        userId,
        tasks: {
          twitter: [],
          linkedin: [],
          telegram: [],
          youtube: [],
          instagram: [],
          tiktok: []
        },
        totalPoints: 0
      });
      await user.save();
    }
    res.json({
      tasks: user.tasks,
      totalPoints: user.totalPoints
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

router.post('/upload-screenshot', upload.single('screenshot'), async (req, res) => {
  const { platform, userId, accountLink } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  try {
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({ 
        userId,
        tasks: {
          twitter: [],
          linkedin: [],
          telegram: [],
          youtube: [],
          instagram: [],
          tiktok: []
        },
        totalPoints: 0
      });
    }

    const screenshotUrl = req.file.path;
    const points = 10;

    const platformLower = platform.toLowerCase();
    const taskIndex = user.tasks[platformLower].findIndex(task => task.accountLink === accountLink);

    if (taskIndex === -1) {
      user.tasks[platformLower].push({
        accountLink,
        completed: true,
        completedAt: new Date(),
        screenshotUrl: screenshotUrl,
        points: points,
        shared: false,
        sharePoints: 0
      });
      user.totalPoints += points;
    } else if (!user.tasks[platformLower][taskIndex].completed) {
      user.tasks[platformLower][taskIndex] = {
        ...user.tasks[platformLower][taskIndex],
        completed: true,
        completedAt: new Date(),
        screenshotUrl: screenshotUrl,
        points: points
      };
      user.totalPoints += points;
    } else {
      return res.json({ 
        success: false, 
        message: `Task for ${platform} (${accountLink}) already completed`,
        screenshotUrl: user.tasks[platformLower][taskIndex].screenshotUrl,
        points: user.tasks[platformLower][taskIndex].points,
        totalPoints: user.totalPoints,
        taskStatus: user.tasks
      });
    }
    
    await user.save();

    res.json({ 
      success: true, 
      message: `Screenshot uploaded successfully for ${platform} (${accountLink})`,
      screenshotUrl: screenshotUrl,
      points: points,
      totalPoints: user.totalPoints,
      taskStatus: user.tasks
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ success: false, error: 'Error updating task status' });
  }
});

router.post('/share-achievement', async (req, res) => {
  const { userId, platform, accountLink, socialPlatform } = req.body;

  try {
    let user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const platformLower = platform.toLowerCase();
    const taskIndex = user.tasks[platformLower].findIndex(task => task.accountLink === accountLink);

    if (taskIndex !== -1 && user.tasks[platformLower][taskIndex].completed && !user.tasks[platformLower][taskIndex].shared) {
      // Simulate a 10-second delay
      await new Promise(resolve => setTimeout(resolve, 10000));

      user.tasks[platformLower][taskIndex].shared = true;
      user.tasks[platformLower][taskIndex].sharePoints = 5;
      user.totalPoints += 5;
      
      await user.save();

      res.json({ 
        success: true, 
        message: `Share achievement recorded for ${platform} (${accountLink}) on ${socialPlatform}`,
        sharePoints: 5,
        totalPoints: user.totalPoints,
        taskStatus: user.tasks
      });
    } else {
      res.json({ 
        success: false, 
        message: `Share achievement already recorded or task not completed for ${platform} (${accountLink})`,
        totalPoints: user.totalPoints,
        taskStatus: user.tasks
      });
    }
  } catch (error) {
    console.error('Error recording share achievement:', error);
    res.status(500).json({ success: false, error: 'Error recording share achievement' });
  }
});

module.exports = router;
