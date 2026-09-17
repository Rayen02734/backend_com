const express = require('express');
const ligneCommandeController = require('../controllers/ligneCommande.controller');
const { requireAdminAuth } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(requireAdminAuth);
router.post('/', ligneCommandeController.createLigneCommande);
router.get('/', ligneCommandeController.getLignesCommande);
router.get('/:id', ligneCommandeController.getLigneCommandeById);
router.put('/:id', ligneCommandeController.updateLigneCommande);
router.delete('/:id', ligneCommandeController.deleteLigneCommande);
router.put('/:id/calculer-sous-total', ligneCommandeController.calculerSousTotal);

module.exports = router;