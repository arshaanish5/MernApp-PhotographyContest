const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cloudinary = require('./config/cloudinary'); // Cloudinary Configuration

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
      origin: "http://localhost:5173", // Your frontend URL
      credentials: true, // Allow cookies and auth headers
    })
  );
app.use("/uploads", express.static("uploads"));

require('./db/connection'); // Database connection

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);
const contestRoutes = require('./routes/contestRoutes');
app.use('/contest', contestRoutes);

const photoRoutes = require('./routes/photoRoutes');
app.use('/photo', photoRoutes);

const voteRoutes = require('./routes/voteRoutes');
app.use('/votes',voteRoutes);

const commentRoutes = require('./routes/commentRoutes');
app.use('/comments',commentRoutes);

console.log("Available Routes:");
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server started at Port " + PORT);
});
