const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const isAdmin=require("../middleware/isAdmin");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id,username: user.username, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });


    res.json({ message: "Login successful", token, role: user.role }); // Send role in response
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


// Logout User
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// Get all registered users (Admin only)
router.get('/allusers',verifyToken, isAdmin, async (req, res) => {
  console.log('Headers:', req.headers);
    console.log('User:', req.user);
  try {
      const users = await User.find().select('-password'); // Exclude password field
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Block a user (Admin only)
router.put('/block/:id',verifyToken, isAdmin, async (req, res) => {
  try {
      const user = await User.findById(req.params.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update user status to blocked
      user.isBlocked = true;
      await user.save();

      res.status(200).json({ message: 'User blocked successfully', user });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unblock a user (Admin Only)
router.put("/unblock/:userId", verifyToken, isAdmin, async (req, res) => {
  try {
      const { userId } = req.params;

      // Find the user and update the `isBlocked` field
      const user = await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User unblocked successfully", user });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get logged-in user details
router.get("/current", verifyToken, async (req, res) => {
  console.log("User from token:", req.user); // Check if token is properly decoded
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



module.exports = router;
