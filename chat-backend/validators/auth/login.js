const { validationResult } = require("express-validator");
const { body } = require("express-validator");

exports.rules = (() => {
  return [body("email").isEmail()];
})();
