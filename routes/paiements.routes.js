const express = require('express');
const paiementController = require('../controllers/paiement.controller');
const router = express.Router();

router.post('/', paiementController.createPaiement);
router.get('/', paiementController.getPaiements);
router.get('/:id', paiementController.getPaiementById);
router.put('/:id', paiementController.updatePaiement);
router.delete('/:id', paiementController.deletePaiement);
router.get('/:id/effectuer', paiementController.effectuerPaiement);
router.get('/:id/verifier', paiementController.verifierPaiement);
router.put('/:id/rembourser', paiementController.rembourser);

module.exports = router;