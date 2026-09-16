const jwt = require('jsonwebtoken');
const AdminModel = require('../models/admin.model');

const requireAdminAuth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  const headerToken = authorization && authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;
  const token = headerToken || req.cookies.admin_token;

  if (!token) return res.status(401).json({ message: 'Authentification requise.' });
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'JWT_SECRET non configure.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Acces admin requis.' });
    }
    const admin = await AdminModel.findById(decoded.sub).select('-password');
    if (!admin) return res.status(401).json({ message: 'Administrateur introuvable.' });
    req.admin = admin;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expire.' });
  }
};

module.exports = { requireAdminAuth };