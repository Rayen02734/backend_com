const express = require('express');
const adminController = require('../controllers/admin.controller');
const { requireAdminAuth } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/login', adminController.loginAdmin);
router.post('/', adminController.createAdmin);
router.use(requireAdminAuth);
router.get('/', adminController.getAdmins);
router.get('/:id', adminController.getAdminById);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);
router.post('/:id/ajouter-produit', adminController.ajouterProduit);
router.put('/:id/modifier-produit/:produitId', adminController.modifierProduit);
router.delete('/:id/supprimer-produit/:produitId', adminController.supprimerProduit);
router.get('/:id/gerer-stock/:produitId', adminController.gererStock);
router.get('/:id/consulter-commandes', adminController.consulterCommandes);
router.put('/:id/modifier-statut-commande/:commandeId', adminController.modifierStatutCommande);
router.get('/:id/consulter-analyse', adminController.consulterAnalyse);

module.exports = router;