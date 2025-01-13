const express = require('express');
const router = express.Router();
const User = require('../models/dataModel');

// Route to get the total tasks completed by all users
router.get('/tasks-completed', async (req, res) => {
    try {
        const result = await User.aggregate([
            {
                $group: {
                    _id: null,
                    totalTasksCompleted: { $sum: "$tasks_completed" }
                }
            }
        ]);

        const totalTasksCompleted = result.length > 0 ? result[0].totalTasksCompleted : 0;
        res.json({ totalTasksCompleted });
    } catch (error) {
        console.error('Error fetching tasks completed:', error);
        res.status(500).json({ message: 'Error fetching tasks completed', error });
    }
});

module.exports = router;
