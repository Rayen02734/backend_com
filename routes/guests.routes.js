const express = require('express');
const guestController = require('../controllers/guest.controller');
const router = express.Router();

router.post('/', guestController.createGuest);
router.get('/', guestController.getGuests);
router.get('/:id', guestController.getGuestById);
router.put('/:id', guestController.updateGuest);
router.delete('/:id', guestController.deleteGuest);
router.post('/:id/acheter-produit', guestController.acheterProduit);
router.post('/:id/passer-commande', guestController.passerCommande);
router.post('/:id/faire-paiement', guestController.fairePaiement);

module.exports = router;