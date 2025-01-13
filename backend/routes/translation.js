// routes/translation.js
const express = require('express');
const router = express.Router();
const { DateTime } = require('luxon');
const texts = require('../models/texts'); // Adjusted import path

// Track user progress and hearts
const userProgress = {};
const userHearts = {};
const userShuffledTexts = {};

router.get('/generate_paragraph', (req, res) => {
  const level = parseInt(req.query.level, 10) || 1;
  const userId = req.query.user_id || 'default';

  if (isNaN(level) || level < 1 || level > 10) {
    return res.status(400).json({ error: 'Invalid level. Choose a number between 1 and 10.' });
  }

  if (!userProgress[userId]) {
    userProgress[userId] = Array(10).fill(0);
    userHearts[userId] = {
      hearts: 5,
      lastLost: null
    };
  }

  if (!userShuffledTexts[userId] || !userShuffledTexts[userId][level]) {
    userShuffledTexts[userId] = userShuffledTexts[userId] || {};
    userShuffledTexts[userId][level] = texts[level].sort(() => Math.random() - 0.5);
  }

  const userProgressForLevel = userProgress[userId][level - 1];
  const userHeartsData = userHearts[userId];

  // Check for heart recharge
  if (userHeartsData.hearts < 5 && userHeartsData.lastLost) {
    const timeSinceLoss = DateTime.now().minus({ hours: 24 });
    if (DateTime.fromISO(userHeartsData.lastLost) <= timeSinceLoss) {
      userHearts[userId].hearts = 5;
    }
  }

  if (userProgressForLevel >= texts[level].length) {
    return res.json({ level_completed: true, message: `Level ${level} completed!` });
  }

  const selectedText = userShuffledTexts[userId][level][userProgressForLevel];
  res.json({
    french: selectedText.french,
    english: selectedText.english,
    next_index: userProgressForLevel + 1,
    hearts: userHeartsData.hearts
  });
});

router.post('/verify', (req, res) => {
  const { user_translation, correct_translation, user_id = 'default', level = 1 } = req.body;

  if (!user_translation || !correct_translation) {
    return res.status(400).json({ error: 'User translation or correct translation is missing.' });
  }

  const isCorrect = user_translation.trim().toLowerCase() === correct_translation.trim().toLowerCase();
  const rewardHearts = 1; // Number of hearts to reward for correct translation

  if (!userProgress[user_id]) {
    userProgress[user_id] = Array(10).fill(0);
    userHearts[user_id] = {
      hearts: 5,
      lastLost: null
    };
  }

  if (!userProgress[user_id][level - 1]) {
    userProgress[user_id][level - 1] = 0;
  }

  if (isCorrect) {
    userProgress[user_id][level - 1] += 1;
    if (userHearts[user_id].hearts < 5) {
      userHearts[user_id].hearts = Math.min(5, userHearts[user_id].hearts + rewardHearts);
    }
  } else {
    userHearts[user_id].hearts = Math.max(0, userHearts[user_id].hearts - rewardHearts);
    userHearts[user_id].lastLost = DateTime.now().toISO();
  }

  res.json({ correct: isCorrect, hearts: userHearts[user_id].hearts });
});

module.exports = router;
