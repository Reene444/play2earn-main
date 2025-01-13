const express = require('express');
const router = express.Router();
const Task = require('../models/Task');  // Ensure Task model is correct

// API to get top 5 tasks based on completions or rewards
router.get('/top-tasks', async (req, res) => {
  const { type } = req.query;  // Expect query param 'type' as either 'completed' or 'reward'

  try {
    // Create the aggregation query based on the type
    let sortField = type === 'reward' ? 'reward' : 'completed'; // Default to 'completed' if not reward
    let result = await Task.aggregate([
      {
        $sort: {
          [sortField]: -1,  // Sort by completed or reward in descending order
        }
      },
      {
        $limit: 5  // Limit to top 5 tasks
      },
      {
        $project: {
          _id: 0,  // Exclude _id from the result
          name: 1,  // Include the task name
          completed: 1,  // Include completed count
          reward: 1,  // Include reward value
          category: 1  // Include the category
        }
      }
    ]);

    res.json(result);
  } catch (error) {
    console.error('Error fetching top tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
