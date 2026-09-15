const express = require('express');
const adminController = require('../controllers/admin.controller');
const router = express.Router();

router.post('/', adminController.createAdmin);
router.get('/', adminController.getAdmins);
router.get('/:id', adminController.getAdminById);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;