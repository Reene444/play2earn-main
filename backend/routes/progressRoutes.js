const express = require('express');
const { updateUserProgress, getUserProgress } = require('../controllers/progressController');

const router = express.Router();

// Route to update user progress
router.post('/update', updateUserProgress);

// Route to get user progress (you can add more routes as needed)
router.get('/', getUserProgress);

module.exports = router;
