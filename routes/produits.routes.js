const express = require('express');
const produitController = require('../controllers/produit.controller');
const router = express.Router();

router.post('/', produitController.createProduit);
router.get('/', produitController.getProduits);
router.get('/:id', produitController.getProduitById);
router.put('/:id', produitController.updateProduit);
router.delete('/:id', produitController.deleteProduit);

module.exports = router;