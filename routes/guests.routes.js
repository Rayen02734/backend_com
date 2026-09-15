const express = require('express');
const guestController = require('../controllers/guest.controller');
const router = express.Router();

router.post('/', guestController.createGuest);
router.get('/', guestController.getGuests);
router.get('/:id', guestController.getGuestById);
router.put('/:id', guestController.updateGuest);
router.delete('/:id', guestController.deleteGuest);

module.exports = router;