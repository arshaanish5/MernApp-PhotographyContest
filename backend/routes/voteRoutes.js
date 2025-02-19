const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/userModel');
const Photo = require('../models/photoModel');
const Vote = require('../models/voteModel'); // Model to track votes

// Vote on a photo
router.post('/vote/:photoId', async (req, res) => {
    try {
        const { photoId } = req.params;
        const { userId } = req.body;

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(photoId)) {
            return res.status(400).json({ message: 'Invalid User ID or Photo ID' });
        }

        // Check if user and photo exist
        const user = await User.findById(userId);
        const photo = await Photo.findById(photoId);

        if (!user || !photo) {
            return res.status(400).json({ message: 'User or Photo not found' });
        }

        // Check if the user has already voted for this photo
        const existingVote = await Vote.findOne({ userId, photoId });

        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted for this photo' });
        }

        // Save new vote
        const newVote = new Vote({ userId, photoId });
        await newVote.save();

        // Update vote count in the Photo model
        photo.votes += 1;
        await photo.save();

        res.status(201).json({ message: 'Vote added successfully', votes: photo.votes });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get total votes for a photo
router.get('/votes/:photoId', async (req, res) => {
    try {
        const { photoId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(photoId)) {
            return res.status(400).json({ message: 'Invalid Photo ID' });
        }

        // Count votes for the given photo
        const voteCount = await Vote.countDocuments({ photoId });

        res.json({ photoId, votes: voteCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
