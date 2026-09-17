const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
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
  prix: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  auteur: {
    type: String,
    trim: true
  },
  langue: {
    type: String,
    trim: true
  },
  genre: {
    type: String,
    trim: true
  },
  note: {
    type: Number,
    min: 0,
    max: 5
  },
  badge: {
    type: String,
    trim: true
  },
  isbn: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
});

module.exports = mongoose.model('Produit', produitSchema);