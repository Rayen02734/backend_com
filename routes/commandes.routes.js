const express = require('express');
const commandeController = require('../controllers/commande.controller');
const router = express.Router();

router.post('/', commandeController.createCommande);
router.get('/', commandeController.getCommandes);
router.get('/:id', commandeController.getCommandeById);
router.put('/:id', commandeController.updateCommande);
router.delete('/:id', commandeController.deleteCommande);
router.put('/:id/calculer-total', commandeController.calculerTotal);
router.put('/:id/confirmer', commandeController.confirmerCommande);
router.put('/:id/annuler', commandeController.annulerCommande);
router.put('/:id/modifier-statut', commandeController.modifierStatutCommande);

module.exports = router;