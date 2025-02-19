const mongoose = require("mongoose")
const voteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  photo: { type: mongoose.Schema.Types.ObjectId, ref: "Photo", required: true },
}, { timestamps: true });

// Ensure a user can vote on multiple photos but only once per photo
voteSchema.index({ user: 1, photo: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
