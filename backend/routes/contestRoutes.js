const express = require("express");
const router = express.Router();
const contestModel = require("../models/contestModel");
const { verifyToken } = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

// Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Fetch all contests (Anyone with a valid token can access)
router.get("/all", verifyToken, async (req, res) => {
  try {
    const data = await contestModel.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).send("Failed to fetch contests");
  }
});

// Fetch contest by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const contest = await contestModel.findById(req.params.id);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }
    res.status(200).json(contest);
  } catch (error) {
    console.error("Error fetching contest by ID:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch contests by category
router.get("/category/:category",verifyToken, async (req, res) => {
  try {
    const { category } = req.params;
    const contests = await contestModel.find({ category });

    if (contests.length === 0) {
      return res.status(404).json({ message: "No contests found in this category" });
    }

    res.status(200).json(contests);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// API to fetch contests categorized (Past, Ongoing, Upcoming)
router.get("/date", verifyToken, async (req, res) => {
  try {
    const now = new Date();

    const pastContests = await contestModel.find({ endDate: { $lt: now } });
    const ongoingContests = await contestModel.find({ startDate: { $lte: now }, endDate: { $gte: now } });
    const upcomingContests = await contestModel.find({ startDate: { $gt: now } });

    res.json({ pastContests, ongoingContests, upcomingContests });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new contest (Admins only)
router.post("/createcontest", verifyToken, isAdmin, async (req, res) => {
  try {
    const data = new contestModel(req.body);
    await data.save();
    res.status(201).send("Contest added successfully");
  } catch (error) {
    console.error("Error creating contest:", error);
    res.status(500).send("Failed to add contest");
  }
});

// Update contest by ID (Admins only)
router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const updateContest = await contestModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updateContest) {
      return res.status(404).send("Contest not found");
    }
    res.status(200).send("Contest updated successfully");
  } catch (error) {
    console.error("Error updating contest:", error);
    res.status(500).send("Failed to update contest");
  }
});

// Delete contest by ID (Admins only)
router.delete("/delete/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleteContest = await contestModel.findByIdAndDelete(req.params.id);
    if (!deleteContest) {
      return res.status(404).send("Contest not found");
    }
    res.status(200).send("Contest deleted successfully");
  } catch (error) {
    console.error("Error deleting contest:", error);
    res.status(500).send("Failed to delete contest");
  }
});

// Join a contest
router.post("/join/:id", verifyToken, async (req, res) => {
  try {
    const contestId = req.params.id;
    const userId = req.user._id; // Extract user from token

    // Find the contest
    const contest = await contestModel.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    // Check if user already joined
    if (contest.participants.includes(userId)) {
      return res.status(400).json({ message: "Already joined this contest" });
    }

    // Add user to participants
    contest.participants.push(userId);
    await contest.save();

    res.status(200).json({ message: "Successfully joined the contest" });
  } catch (error) {
    console.error("Error joining contest:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
