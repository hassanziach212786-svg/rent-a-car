const mongoose = require('mongoose');

const validateBody = (schema, options = {}) => (req, res, next) => {
  if (
    options.allowEmptyWithFile &&
    req.file &&
    Object.keys(req.body || {}).length === 0
  ) {
    return next();
  }

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    res.status(400);
    throw new Error(error.details.map((detail) => detail.message).join(', '));
  }

  req.body = value;
  next();
};

const validateObjectId = (paramName = 'id') => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    res.status(400);
    throw new Error(`Invalid ${paramName}`);
  }

  next();
};

module.exports = { validateBody, validateObjectId };
