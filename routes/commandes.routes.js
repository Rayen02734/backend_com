const express = require('express');
const commandeController = require('../controllers/commande.controller');
const router = express.Router();

router.post('/', commandeController.createCommande);
router.get('/', commandeController.getCommandes);
router.get('/:id', commandeController.getCommandeById);
router.put('/:id', commandeController.updateCommande);
router.delete('/:id', commandeController.deleteCommande);

module.exports = router;