const express = require('express');
const router = express.Router();
const User = require('../models/dataModel'); // Adjust path if necessary

// Route to get total rewards
router.get('/total-rewards', async (req, res) => {
    try {
        const result = await User.aggregate([
            {
                $group: {
                    _id: null,
                    totalRewards: { $sum: "$total_rewards" }
                }
            }
        ]);

        const totalRewards = result.length > 0 ? result[0].totalRewards : 0;
        res.json({ totalRewards });
    } catch (error) {
        console.error('Error fetching total rewards:', error);
        res.status(500).json({ message: 'Error fetching total rewards', error });
    }
});

module.exports = router;
