const { validationResult } = require("express-validator");

exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.send({ status: 400, errors: errors.array() });
  }

  next();
};
