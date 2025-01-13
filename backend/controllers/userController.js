const UserModel = require('../models/User');
// mit prajapati (auth)
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const { request } = require("http");
require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken")

// Get a user's profile
exports.getUserProfile = async (req, res) => {
    // console.log("reached")
    try {
        const token = req.cookies.token;

        // Check if the token exists
        if (!token) {
            return res.status(401).send({ message: 'Authentication token not found.' });
        }

        // Verify and decode the token using the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded)

        // Extract the user ID from the token's payload
        const id = decoded._id;  // Ensure the token has a user ID in its payload
        // console.log(id)
        
        // Find the user by their ID in the database
        const user = await UserModel.findById(id);

        // If no user is found, return a 404
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        // Send the user data back in the response
        // console.log(user)
        res.json(user)

    } catch (error) {
        console.error('Error fetching user profile:', error);

        // If there’s a token verification error, handle it properly
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ message: 'Invalid token.' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(403).send({ message: 'Token expired. Please log in again.' });
        }

        // For any other errors, return a 500 status
        res.status(500).send({ message: 'Internal server error.', error });
    }
};

// Update a user's profile
exports.updateUserProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password', 'profile_pic_url', 'tasks_completed', 'total_rewards'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            user[update] = req.body[update];
        });
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

// List all users
exports.getAllUsers = async (req, res) => {
    // console.log("reaced to users")
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


