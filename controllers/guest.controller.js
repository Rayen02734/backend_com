const GuestModel = require('../models/guest.model');
const ProduitModel = require('../models/produit.model');
const CommandeModel = require('../models/commande.model');
const PaiementModel = require('../models/paiement.model');
const { getIdFilter, handleControllerError } = require('./utils.controller');

module.exports.createGuest = async (req, res) => {
  try {
    const guest = await GuestModel.create(req.body);
    return res.status(201).json(guest);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.getGuests = async (req, res) => {
  try {
    const guests = await GuestModel.find();
    return res.status(200).json(guests);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.getGuestById = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const guest = await GuestModel.findOne(filter);
    if (!guest) return res.status(404).json({ message: 'Guest introuvable.' });

    return res.status(200).json(guest);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.updateGuest = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const guest = await GuestModel.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    });
    if (!guest) return res.status(404).json({ message: 'Guest introuvable.' });

    return res.status(200).json(guest);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.deleteGuest = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const guest = await GuestModel.findOneAndDelete(filter);
    if (!guest) return res.status(404).json({ message: 'Guest introuvable.' });

    return res.status(204).send();
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.acheterProduit = async (req, res) => {
  try {
    const guestFilter = getIdFilter(req.params.id);
    const produitFilter = getIdFilter(req.body.produitId);
    const quantite = Number(req.body.quantite);
    if (!guestFilter || !produitFilter || !Number.isInteger(quantite) || quantite < 1) {
      return res.status(400).json({ message: 'Guest, produit ou quantite invalide.' });
    }

    const [guest, produit] = await Promise.all([
      GuestModel.findOne(guestFilter),
      ProduitModel.findOne(produitFilter)
    ]);
    if (!guest) return res.status(404).json({ message: 'Guest introuvable.' });
    if (!produit) return res.status(404).json({ message: 'Produit introuvable.' });
    if (produit.stock < quantite) return res.status(409).json({ message: 'Stock insuffisant.' });

    produit.stock -= quantite;
    await produit.save();
    return res.status(200).json({ produit, quantite });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.passerCommande = async (req, res) => {
  try {
    const guestFilter = getIdFilter(req.params.id);
    if (!guestFilter) return res.status(400).json({ message: 'Identifiant invalide.' });
    const guest = await GuestModel.findOne(guestFilter);
    if (!guest) return res.status(404).json({ message: 'Guest introuvable.' });

    const commande = await CommandeModel.create({ ...req.body, guest: guest._id });
    return res.status(201).json(await CommandeModel.findById(commande._id).populate('guest admin'));
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.fairePaiement = async (req, res) => {
  try {
    const guestFilter = getIdFilter(req.params.id);
    if (!guestFilter) return res.status(400).json({ message: 'Identifiant invalide.' });
    const guest = await GuestModel.findOne(guestFilter);
    if (!guest) return res.status(404).json({ message: 'Guest introuvable.' });

    const paiement = await PaiementModel.create(req.body);
    return res.status(201).json(await PaiementModel.findById(paiement._id).populate('commande'));
  } catch (error) {
    return handleControllerError(res, error);
  }
};

