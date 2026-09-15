const GuestModel = require('../models/guest.model');
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

