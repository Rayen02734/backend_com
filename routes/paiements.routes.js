const express = require('express');
const paiementController = require('../controllers/paiement.controller');
const { requireAdminAuth } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(requireAdminAuth);
router.post('/', paiementController.createPaiement);
router.get('/', paiementController.getPaiements);
router.get('/:id', paiementController.getPaiementById);
router.put('/:id', paiementController.updatePaiement);
router.delete('/:id', paiementController.deletePaiement);
router.put('/:id/effectuer', paiementController.effectuerPaiement);
router.get('/:id/verifier', paiementController.verifierPaiement);
router.put('/:id/rembourser', paiementController.rembourser);

module.exports = router;