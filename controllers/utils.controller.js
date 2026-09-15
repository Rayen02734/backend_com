const mongoose = require('mongoose');

module.exports.getIdFilter = function(value) {
  if (mongoose.isValidObjectId(value)) {
    return { _id: value };
  }

  const numericId = Number(value);
  return Number.isInteger(numericId) ? { id: numericId } : null;
}

module.exports.handleControllerError = function(res, error) {
  if (error.code === 11000) {
    return res.status(409).json({
      message: 'Une valeur unique existe deja.',
      fields: error.keyValue
    });
  }

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: 'Erreur interne du serveur.' });
}

