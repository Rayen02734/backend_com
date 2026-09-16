const ProduitModel = require('../models/produit.model');
const { getIdFilter, handleControllerError } = require('./utils.controller');

const populateProduit = (query) => query.populate('admin');

module.exports.createProduit = async (req, res) => {
  try {
    const produit = await ProduitModel.create(req.body);
    return res.status(201).json(await populateProduit(ProduitModel.findById(produit._id)));
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports. getProduits = async (req, res) => {
  try {
    const produits = await populateProduit(ProduitModel.find());
    return res.status(200).json(produits);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports. getProduitById = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const produit = await populateProduit(ProduitModel.findOne(filter));
    if (!produit) return res.status(404).json({ message: 'Produit introuvable.' });

    return res.status(200).json(produit);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports. updateProduit = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const produit = await populateProduit(ProduitModel.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    }));
    if (!produit) return res.status(404).json({ message: 'Produit introuvable.' });

    return res.status(200).json(produit);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports. deleteProduit = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

    const produit = await ProduitModel.findOneAndDelete(filter);
    if (!produit) return res.status(404).json({ message: 'Produit introuvable.' });

    return res.status(204).send();
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.verifierStock = async (req, res) => {
  try {
    const filter = getIdFilter(req.params.id);
    const quantite = Number(req.query.quantite || 1);
    if (!filter || !Number.isInteger(quantite) || quantite < 1) {
      return res.status(400).json({ message: 'Produit ou quantite invalide.' });
    }
    const produit = await ProduitModel.findOne(filter);
    if (!produit) return res.status(404).json({ message: 'Produit introuvable.' });
    return res.status(200).json({ disponible: produit.stock >= quantite, stock: produit.stock });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.modifierStock = async (req, res, variation) => {
  try {
    const filter = getIdFilter(req.params.id);
    const quantite = Number(req.body.quantite);
    if (!filter || !Number.isInteger(quantite) || quantite < 1) {
      return res.status(400).json({ message: 'Produit ou quantite invalide.' });
    }
    const produit = await ProduitModel.findOne(filter);
    if (!produit) return res.status(404).json({ message: 'Produit introuvable.' });
    if (variation < 0 && produit.stock < quantite) {
      return res.status(409).json({ message: 'Stock insuffisant.' });
    }
    produit.stock += variation * quantite;
    await produit.save();
    return res.status(200).json(produit);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports.diminuerStock = (req, res) => module.exports.modifierStock(req, res, -1);
module.exports.augmenterStock = (req, res) => module.exports.modifierStock(req, res, 1);

