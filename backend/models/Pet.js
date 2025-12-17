const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  description: { type: String },
  photo: { type: String }, // URL for photo
  status: { type: String, enum: ['available', 'adopted'], default: 'available' },
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
