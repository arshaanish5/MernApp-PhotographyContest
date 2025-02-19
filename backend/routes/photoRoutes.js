const express = require("express");
const Photo = require("../models/photoModel");
const User = require("../models/userModel");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // Multer with Cloudinary
const cloudinary = require("../config/cloudinary"); // Cloudinary Config
const Vote =require("../models/voteModel")

const router = express.Router();

// Upload Photo (Cloudinary Middleware)
router.post("/upload", upload.single("image"), async (req, res) => {
  console.log("Received request:", req.body);

  if (!req.body.user) {
      return res.status(400).json({ error: "User ID is required." });
  }

  try {
      const newPhoto = new Photo({
          title: req.body.title,
          description: req.body.description,
          contestId: req.body.contestId,
          user: req.body.user,  // Ensure this is properly passed
          imageUrl: req.file ? req.file.path : null,
      });

      await newPhoto.save();
      res.status(201).json({ message: "Photo uploaded successfully", photo: newPhoto });
  } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Image upload failed.", error: error.message });
  }
});


// Get All Photos (Public Gallery)
router.get("/allphotos", async (req, res) => {
  try {
    const photos = await Photo.find().populate("user", "username");
    res.status(200).json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get photos for a specific contest
router.get('/contests/:id/photos', async (req, res) => {
  try {
    const contestId = req.params.id;

    // Fetch photos by contestId
    const photos = await Photo.find({ contestId });

    if (photos.length === 0) {
      return res.status(404).json({ message: 'No photos found for this contest' });
    }

    // Attach usernames to photos
    const photosWithUsernames = await Promise.all(
      photos.map(async (photo) => {
        const user = await User.findById(photo.user, "username");
        return { ...photo.toObject(), user: { username: user ? user.username : "Anonymous" } };
      })
    );

    res.status(200).json(photosWithUsernames);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete("/remove/:photoId", verifyToken, async (req, res) => {
  try {
    const { photoId } = req.params;
    console.log("Delete request received for photo:", photoId);  // Debugging

    const photo = await Photo.findById(photoId);
    if (!photo) {
      console.log("Photo not found in DB");
      return res.status(404).json({ message: "Photo not found" });
    }

    console.log("Photo owner ID:", photo.user);
    console.log("Request user ID:", req.user._id, "Role:", req.user.role);

    // Ensure only the owner or admin can delete
    if (req.user.role !== "admin" && photo.user.toString() !== req.user._id) {
      console.log("Unauthorized delete attempt");
      return res.status(403).json({ message: "Unauthorized to delete this photo" });
    }

    await Photo.findByIdAndDelete(photoId);
    console.log("Photo deleted successfully");
    res.json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Error in delete photo route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get top contestants for a specific contest
router.get("/leaderboard/:contestId", async (req, res) => {
  try {
    const { contestId } = req.params;

    // Find the top 3 photos with the most votes in the contest
    const leaderboard = await Photo.find({ contestId })
      .sort({ votes: -1 }) // Sort by votes in descending order
      .limit(3) // Get top 3
      .populate("user", "username"); // Populate user details

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error while fetching leaderboard." });
  }
});



module.exports = router;
