const express = require('express');
const paiementController = require('../controllers/paiement.controller');
const router = express.Router();

router.post('/', paiementController.createPaiement);
router.get('/', paiementController.getPaiements);
router.get('/:id', paiementController.getPaiementById);
router.put('/:id', paiementController.updatePaiement);
router.delete('/:id', paiementController.deletePaiement);

module.exports = router;