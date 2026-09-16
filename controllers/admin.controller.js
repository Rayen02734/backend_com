const AdminModel = require('../models/admin.model');
const ProduitModel = require('../models/produit.model');
const CommandeModel = require('../models/commande.model');
const { analyserBoutique } = require('../services/IA.service');
const { getIdFilter, handleControllerError } = require('./utils.controller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '8h';

const withoutPassword = (admin) => {
    const data = admin.toObject();
    delete data.password;
    return data;
};

module.exports.createAdmin = async (req, res) => {
    try {
        const data = { ...req.body };
        data.password = await bcrypt.hash(data.password, 12);
        const admin = await AdminModel.create(data);
        return res.status(201).json(withoutPassword(admin));
    } catch (error) {
        return handleControllerError(res, error);
    }
};

module.exports.getAdmins = async (req, res) => {
    try {
        const admins = await AdminModel.find();
        return res.status(200).json(admins);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

module.exports.getAdminById = async (req, res) => {
    try {
        const filter = getIdFilter(req.params.id);

        if (!filter) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const admin = await AdminModel.findOne(filter);

        if (!admin) {
            return res.status(404).json({
                message: 'Admin introuvable.'
            });
        }

        return res.status(200).json(admin);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

module.exports.updateAdmin = async (req, res) => {
    try {
        const filter = getIdFilter(req.params.id);

        if (!filter) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const admin = await AdminModel.findOneAndUpdate(
            filter,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!admin) {
            return res.status(404).json({
                message: 'Admin introuvable.'
            });
        }

        return res.status(200).json(admin);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

module.exports.deleteAdmin = async (req, res) => {
    try {
        const filter = getIdFilter(req.params.id);

        if (!filter) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const admin = await AdminModel.findOneAndDelete(filter);

        if (!admin) {
            return res.status(404).json({
                message: 'Admin introuvable.'
            });
        }

        return res.status(204).send();
    } catch (error) {
        return handleControllerError(res, error);
    }
};

module.exports.ajouterProduit = async (req, res) => {
    try {
        const adminFilter = getIdFilter(req.params.id);

        if (!adminFilter) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const admin = await AdminModel.findOne(adminFilter);

        if (!admin) {
            return res.status(404).json({
                message: 'Admin introuvable.'
            });
        }

        const produit = await ProduitModel.create({
            ...req.body,
            admin: admin._id
        });

        return res.status(201).json(
            await ProduitModel
                .findById(produit._id)
                .populate('admin')
        );
    } catch (error) {
        return handleControllerError(res, error);
    }
};

module.exports.modifierProduit = async (req, res) => {
    try {
        const produitFilter = getIdFilter(req.params.produitId);

        if (!produitFilter) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const produit = await ProduitModel
            .findOneAndUpdate(
                produitFilter,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            )
            .populate('admin');

        if (!produit) {
            return res.status(404).json({
                message: 'Produit introuvable.'
            });
        }

        return res.status(200).json(produit);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

module.exports.supprimerProduit = async (req, res) => {
    try {
        const produitFilter = getIdFilter(req.params.produitId);

        if (!produitFilter) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const produit = await ProduitModel.findOneAndDelete(
            produitFilter
        );

        if (!produit) {
            return res.status(404).json({
                message: 'Produit introuvable.'
            });
        }

        return res.status(204).send();
    } catch (error) {
        return handleControllerError(res, error);
    }
};

module.exports.gererStock = async (req, res) => {
    try {
        const produitFilter = getIdFilter(
            req.params.produitId
        );

        const quantite = Number(req.body.quantite);

        if (
            !produitFilter ||
            !Number.isInteger(quantite) ||
            quantite === 0
        ) {
            return res.status(400).json({
                message: 'Produit ou quantite invalide.'
            });
        }

        const produit = await ProduitModel.findOne(
            produitFilter
        );

        if (!produit) {
            return res.status(404).json({
                message: 'Produit introuvable.'
            });
        }

        const ancienStock = Number(produit.stock || 0);
        const nouveauStock = ancienStock + quantite;

        if (nouveauStock < 0) {
            return res.status(409).json({
                message: 'Stock insuffisant.',
                ancienStock,
                quantiteDemandee: quantite,
                stockDisponible: ancienStock
            });
        }

        produit.stock = nouveauStock;

        await produit.save();

        return res.status(200).json({
            success: true,
            message: quantite > 0
                ? 'Stock augmenté automatiquement.'
                : 'Stock diminué automatiquement.',
            ancienStock,
            variation: quantite,
            nouveauStock,
            produit
        });
    } catch (error) {
        return handleControllerError(res, error);
    }
};

module.exports.consulterCommandes = async (req, res) => {
    try {
        const commandes = await CommandeModel
            .find()
            .populate('guest admin');

        return res.status(200).json(commandes);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

module.exports.modifierStatutCommande = async (req, res) => {
    try {
        const filter = getIdFilter(
            req.params.commandeId
        );

        if (!filter || !req.body.statut) {
            return res.status(400).json({
                message: 'Commande ou statut invalide.'
            });
        }

        const commande = await CommandeModel
            .findOneAndUpdate(
                filter,
                {
                    statut: req.body.statut
                },
                {
                    new: true,
                    runValidators: true
                }
            )
            .populate('guest admin');

        if (!commande) {
            return res.status(404).json({
                message: 'Commande introuvable.'
            });
        }

        return res.status(200).json(commande);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

module.exports.consulterAnalyse = async (req, res) => {
    try {
        const [commandes, produits] = await Promise.all([
            CommandeModel
                .find()
                .select('total statut'),

            ProduitModel
                .find()
                .select('nom stock')
        ]);

        const nombreCommandes = commandes.length;

        const chiffreAffaires = commandes.reduce(
            (total, commande) =>
                total + Number(commande.total || 0),
            0
        );

        const commandesParStatut = commandes.reduce(
            (stats, commande) => {
                const statut = commande.statut || 'inconnu';

                stats[statut] =
                    (stats[statut] || 0) + 1;

                return stats;
            },
            {}
        );

        const produitsAnalyse = produits.map(
            (produit) => ({
                nom: produit.nom,
                stock: Number(produit.stock || 0)
            })
        );

        const donneesAnalyse = {
            nombreCommandes,
            chiffreAffaires,
            commandesParStatut,
            produits: produitsAnalyse
        };

        const analyseIA =
            await analyserBoutique(
                donneesAnalyse
            );

        return res.status(200).json({
            success: true,
            statistiques: donneesAnalyse,
            analyseIA
        });

    } catch (error) {
        console.error(
            'Erreur consulterAnalyse :',
            error
        );

        return handleControllerError(
            res,
            error
        );
    }
};

module.exports.loginAdmin = async (req, res) => {
    try {
        const { mail, password } = req.body;
        if (!mail || !password) {
            return res.status(400).json({ message: 'Mail et mot de passe obligatoires.' });
        }
        if (!JWT_SECRET) {
            return res.status(500).json({ message: 'JWT_SECRET non configure.' });
        }

        const admin = await AdminModel.findOne({ mail: mail.toLowerCase().trim() });
        if (!admin) return res.status(401).json({ message: 'Identifiants invalides.' });

        let passwordValid = await bcrypt.compare(password, admin.password);
        if (!passwordValid && admin.password === password) {
            admin.password = await bcrypt.hash(password, 12);
            await admin.save();
            passwordValid = true;
        }
        if (!passwordValid) return res.status(401).json({ message: 'Identifiants invalides.' });

        const token = jwt.sign({ sub: admin._id.toString(), role: 'admin' }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });
        res.cookie('admin_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 8 * 60 * 60 * 1000
        });
        return res.status(200).json({ token, admin: withoutPassword(admin) });
    } catch (error) {
        return handleControllerError(res, error);
    }
};