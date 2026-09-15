const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  montant: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  statut: {
    type: String,
    required: true,
    trim: true
  },
  moyen: {
    type: String,
    required: true,
    trim: true
  },
  commande: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commande',
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Paiement', paiementSchema);