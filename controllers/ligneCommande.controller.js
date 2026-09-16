const LigneCommandeModel = require('../models/ligneCommande.model');
const { getIdFilter, handleControllerError } = require('./utils.controller');

const populateLigneCommande = (query) => query.populate('commande produit');

module.exports.createLigneCommande = async (req, res) => {
  try {
    const ligneCommande = await LigneCommandeModel.create(req.body);
    return res.status(201).json(await populateLigneCommande(LigneCommandeModel.findById(ligneCommande._id)));
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.getLignesCommande = async (req, res) => {
  try {
    const lignesCommande = await populateLigneCommande(LigneCommandeModel.find());
    return res.status(200).json(lignesCommande);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.getLigneCommandeById = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const ligneCommande = await populateLigneCommande(LigneCommandeModel.findOne(filter));
    if (!ligneCommande) return res.status(404).json({ message: 'Ligne de commande introuvable.' });

    return res.status(200).json(ligneCommande);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.updateLigneCommande = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const ligneCommande = await populateLigneCommande(LigneCommandeModel.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    }));
    if (!ligneCommande) return res.status(404).json({ message: 'Ligne de commande introuvable.' });

    return res.status(200).json(ligneCommande);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.deleteLigneCommande = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const ligneCommande = await LigneCommandeModel.findOneAndDelete(filter);
    if (!ligneCommande) return res.status(404).json({ message: 'Ligne de commande introuvable.' });

    return res.status(204).send();
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.calculerSousTotal = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });
    const ligneCommande = await LigneCommandeModel.findOne(filter);
    if (!ligneCommande) return res.status(404).json({ message: 'Ligne de commande introuvable.' });
    ligneCommande.sousTotal = ligneCommande.quantite * ligneCommande.prixUnitaire;
    await ligneCommande.save();
    return res.status(200).json(await populateLigneCommande(LigneCommandeModel.findById(ligneCommande._id)));
  } catch (error) {
    return handleControllerError(res, error);
  }
};

