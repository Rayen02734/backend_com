const AdminModel = require('../models/admin.model');
const { getIdFilter, handleControllerError } = require('./utils.controller');

module.exports. createAdmin = async (req, res) => {
	try {
		const admin = await AdminModel.create(req.body);
		return res.status(201).json(admin);
	} catch (error) {
		return handleControllerError(res, error);
	}
};

module.exports. getAdmins = async (req, res) => {
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
		if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

		const admin = await AdminModel.findOne(filter);
		if (!admin) return res.status(404).json({ message: 'Admin introuvable.' });

		return res.status(200).json(admin);
	} catch (error) {
		return handleControllerError(res, error);
	}
};

module.exports.updateAdmin = async (req, res) => {
	try {
		const filter = getIdFilter(req.params.id);
		if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

		const admin = await AdminModel.findOneAndUpdate(filter, req.body, {
			new: true,
			runValidators: true
		});
		if (!admin) return res.status(404).json({ message: 'Admin introuvable.' });

		return res.status(200).json(admin);
	} catch (error) {
		return handleControllerError(res, error);
	}
};

module.exports.deleteAdmin = async (req, res) => {
	try {
		const filter = getIdFilter(req.params.id);
		if (!filter) return res.status(400).json({ message: 'Identifiant invalide.' });

		const admin = await AdminModel.findOneAndDelete(filter);
		if (!admin) return res.status(404).json({ message: 'Admin introuvable.' });

		return res.status(204).send();
	} catch (error) {
		return handleControllerError(res, error);
	}
};


