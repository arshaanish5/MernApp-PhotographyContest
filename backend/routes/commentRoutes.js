const express = require("express");
const Comment = require("../models/commentModel");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

//  Add a Comment to a Photo
router.post("/comment/:id", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    const newComment = new Comment({
      user: req.user.id,
      photo: req.params.photoId,
      text,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Get All Comments for a Photo
router.get("/:photoId", async (req, res) => {
  try {
    const comments = await Comment.find().populate("user", "username email");
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: error.message });
  }
});

//  Delete a Comment (Only Owner/Admin)
router.delete("remove/:id", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
