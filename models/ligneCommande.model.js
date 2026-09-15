const mongoose = require('mongoose');

const ligneCommandeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  quantite: {
    type: Number,
    required: true,
    min: 1
  },
  prixUnitaire: {
    type: Number,
    required: true,
    min: 0
  },
  sousTotal: {
    type: Number,
    required: true,
    min: 0
  },
  commande: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commande',
    required: true
  },
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit',
    required: true
  }
});

module.exports = mongoose.model('LigneCommande', ligneCommandeSchema);