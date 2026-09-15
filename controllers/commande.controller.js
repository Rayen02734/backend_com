const CommandeModel = require('../models/commande.model');
const { getIdFilter, handleControllerError } = require('./utils.controller');

const populateCommande = (query) => query.populate('guest admin');

const createCommande = async (req, res) => {
  try {
    const commande = await CommandeModel.create(req.body);
    return res.status(201).json(await populateCommande(CommandeModel.findById(commande._id)));
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const getCommandes = async (req, res) => {
  try {
    const commandes = await populateCommande(CommandeModel.find());
    return res.status(200).json(commandes);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const getCommandeById = async (req, res) => {
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

const updateCommande = async (req, res) => {
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

const deleteCommande = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const commande = await Commande.findOneAndDelete(filter);
    if (!commande) return res.status(404).json({ message: 'Commande introuvable.' });

    return res.status(204).send();
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports = {
  createCommande,
  getCommandes,
  getCommandeById,
  updateCommande,
  deleteCommande
};