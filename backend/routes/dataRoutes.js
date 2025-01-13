const express = require('express');
const router = express.Router();
const User = require('../models/dataModel'); // Correct the import

// Route to get user count
router.get('/user-count', async (req, res) => {
    try {
        const count = await User.countDocuments(); // Get user count using Mongoose
        res.json({ count });
    } catch (error) {
        console.error('Error fetching user count:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error fetching user count', error });
    }
});

module.exports = router;
