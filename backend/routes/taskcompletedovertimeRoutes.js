const express = require('express');
const router = express.Router();
const Task = require('../models/dataModel');  // Replace with your actual Task model

// Route to get tasks completed over time based on time range
router.get('/tasks-completed-overtime', async (req, res) => {
  try {
    const { timeRange } = req.query;  // Get time range from query params (week, month, year)
    
    if (!['week', 'month', 'year'].includes(timeRange)) {
      return res.status(400).json({ message: 'Invalid time range. Use week, month, or year.' });
    }

    let startDate = new Date();
    switch (timeRange) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);  // Last 7 days
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);  // Last month
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);  // Last year
        break;
    }

    // Aggregate tasks completed over the selected time range
    const result = await Task.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalCompleted: { $sum: "$tasks_completed" }
        }
      },
      {
        $project: {
          _id: 0,  // Exclude the default _id field
          createDate: "$_id",  // Rename _id to createDate
          totalCompleted: 1   // Keep totalCompleted as is
        }
      },
      {
        $sort: { createDate: 1 }  // Sort by date
      }
    ]);

    res.json(result);
  } catch (error) {
    console.error('Error fetching tasks completed over time:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
