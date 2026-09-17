const express = require('express');
const produitController = require('../controllers/produit.controller');
const { requireAdminAuth } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/', produitController.getProduits);
router.get('/:id', produitController.getProduitById);
router.get('/:id/verifier-stock', produitController.verifierStock);
router.use(requireAdminAuth);
router.post('/', produitController.createProduit);
router.put('/:id', produitController.updateProduit);
router.delete('/:id', produitController.deleteProduit);
router.put('/:id/diminuer-stock', produitController.diminuerStock);
router.put('/:id/augmenter-stock', produitController.augmenterStock);

module.exports = router;