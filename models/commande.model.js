const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  statut: {
    type: String,
    required: true,
    trim: true
  },
  adresseLivraison: {
    type: String,
    required: true,
    trim: true
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest'
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});

module.exports = mongoose.model('Commande', commandeSchema);