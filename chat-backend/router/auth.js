const router = require("express").Router();
// const { body } = require("express-validator");
const { login, register } = require("../controllers/authController");
const { validate } = require("../validators");
const { rules: registrationRules } = require("../validators/auth/register");
const { rules: loginRules } = require("../validators/auth/login");

router.post("/login", [loginRules, validate], login);
router.post(
  "/register",
  [
    // body("firstName").notEmpty(),
    // body("lastName").notEmpty(),
    // body("gender").notEmpty(),
    // body("email").isEmail(),
    // body("password").isLength({ min: 5 }),
    registrationRules,
    validate,
  ],

  register
);

module.exports = router;
