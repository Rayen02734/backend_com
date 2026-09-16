const express = require('express');
const ligneCommandeController = require('../controllers/ligneCommande.controller');
const router = express.Router();

router.post('/', ligneCommandeController.createLigneCommande);
router.get('/', ligneCommandeController.getLignesCommande);
router.get('/:id', ligneCommandeController.getLigneCommandeById);
router.put('/:id', ligneCommandeController.updateLigneCommande);
router.delete('/:id', ligneCommandeController.deleteLigneCommande);
router.get('/:id/calculer-sous-total', ligneCommandeController.calculerSousTotal);

module.exports = router;