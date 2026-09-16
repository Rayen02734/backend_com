const PaiementModel = require('../models/paiement.model');
const { getIdFilter, handleControllerError } = require('./utils.controller');

const populatePaiement = (query) => query.populate('commande');

module.exports.createPaiement = async (req, res) => {
  try {
    const paiement = await PaiementModel.create(req.body);
    return res.status(201).json(await populatePaiement(PaiementModel.findById(paiement._id)));
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.getPaiements = async (req, res) => {
  try {
    const paiements = await populatePaiement(PaiementModel.find());
    return res.status(200).json(paiements);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.getPaiementById = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const paiement = await populatePaiement(PaiementModel.findOne(filter));
    if (!paiement) return res.status(404).json({ message: 'Paiement introuvable.' });

    return res.status(200).json(paiement);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.updatePaiement = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const paiement = await populatePaiement(PaiementModel.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    }));
    if (!paiement) return res.status(404).json({ message: 'Paiement introuvable.' });

    return res.status(200).json(paiement);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.deletePaiement = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const paiement = await PaiementModel.findOneAndDelete(filter);
    if (!paiement) return res.status(404).json({ message: 'Paiement introuvable.' });

    return res.status(204).send();
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.effectuerPaiement = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });
    const paiement = await PaiementModel.findOneAndUpdate(filter, { statut: 'effectue' }, {
      new: true,
      runValidators: true
    }).populate('commande');
    if (!paiement) return res.status(404).json({ message: 'Paiement introuvable.' });
    return res.status(200).json(paiement);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.verifierPaiement = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });
    const paiement = await PaiementModel.findOne(filter).populate('commande');
    if (!paiement) return res.status(404).json({ message: 'Paiement introuvable.' });
    return res.status(200).json({ valide: paiement.statut === 'effectue', paiement });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.rembourser = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });
    const paiement = await PaiementModel.findOneAndUpdate(filter, { statut: 'rembourse' }, {
      new: true,
      runValidators: true
    }).populate('commande');
    if (!paiement) return res.status(404).json({ message: 'Paiement introuvable.' });
    return res.status(200).json(paiement);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

