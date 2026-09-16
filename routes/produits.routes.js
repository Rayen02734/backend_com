const express = require('express');
const produitController = require('../controllers/produit.controller');
const router = express.Router();

router.post('/', produitController.createProduit);
router.get('/', produitController.getProduits);
router.get('/:id', produitController.getProduitById);
router.put('/:id', produitController.updateProduit);
router.delete('/:id', produitController.deleteProduit);
router.get('/:id/verifier-stock', produitController.verifierStock);
router.get('/:id/diminuer-stock', produitController.diminuerStock);
router.get('/:id/augmenter-stock', produitController.augmenterStock);

module.exports = router;