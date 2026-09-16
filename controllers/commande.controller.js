const CommandeModel = require('../models/commande.model');
const LigneCommandeModel = require('../models/ligneCommande.model');
const { getIdFilter, handleControllerError } = require('./utils.controller');

const populateCommande = (query) => query.populate('guest admin');

module.exports.createCommande = async (req, res) => {
  try {
    const commande = await CommandeModel.create(req.body);
    return res.status(201).json(await populateCommande(CommandeModel.findById(commande._id)));
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.getCommandes = async (req, res) => {
  try {
    const commandes = await populateCommande(CommandeModel.find());
    return res.status(200).json(commandes);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.getCommandeById = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const commande = await populateCommande(CommandeModel.findOne(filter));
    if (!commande) return res.status(404).json({ message: 'Commande introuvable.' });

    return res.status(200).json(commande);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.updateCommande = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const commande = await populateCommande(CommandeModel.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    }));
    if (!commande) return res.status(404).json({ message: 'Commande introuvable.' });

    return res.status(200).json(commande);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.deleteCommande = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const commande = await CommandeModel.findOneAndDelete(filter);
    if (!commande) return res.status(404).json({ message: 'Commande introuvable.' });

    return res.status(204).send();
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.calculerTotal = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });
    const commande = await CommandeModel.findOne(filter);
    if (!commande) return res.status(404).json({ message: 'Commande introuvable.' });
    const lignes = await LigneCommandeModel.find({ commande: commande._id });
    commande.total = lignes.reduce((total, ligne) => total + ligne.sousTotal, 0);
    await commande.save();
    return res.status(200).json(commande);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.modifierStatutCommande = async (req, res, statut = req.body.statut) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter || !statut) return res.status(400).json({ message: 'Commande ou statut invalide.' });
    const commande = await CommandeModel.findOneAndUpdate(filter, { statut }, {
      new: true,
      runValidators: true
    });
    if (!commande) return res.status(404).json({ message: 'Commande introuvable.' });
    return res.status(200).json(commande);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.confirmerCommande = (req, res) => module.exports.modifierStatutCommande(req, res, 'confirmee');
module.exports.annulerCommande = (req, res) => module.exports.modifierStatutCommande(req, res, 'annulee');

