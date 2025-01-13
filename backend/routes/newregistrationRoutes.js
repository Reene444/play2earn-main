const express = require('express');
const router = express.Router();
const User = require('../models/dataModel'); 

router.get('/new-user-registrations', async (req, res) => {
  try {
    const { timeRange } = req.query; 
    console.log('Received timeRange:', timeRange);
    
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

    // Aggregate new user registrations over the selected time range
    const result = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRegistrations: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,  // Exclude the default _id field
          registrationDate: "$_id",  // Rename _id to registrationDate
          totalRegistrations: 1   // Keep totalRegistrations as is
        }
      },
      {
        $sort: { registrationDate: 1 }
      }
    ]);

    res.json(result);
  } catch (error) {
    console.error('Error fetching new user registrations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
