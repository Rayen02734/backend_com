const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  mail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  adresse: {
    type: String,
    required: true,
    trim: true
  },
  telephone: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('Admin', adminSchema);