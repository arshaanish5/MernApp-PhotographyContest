const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  startDate: Date,
  endDate: Date,
  photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }] // Reference to photos
});

module.exports = mongoose.model('Contest', contestSchema);
