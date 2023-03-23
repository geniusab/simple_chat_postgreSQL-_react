const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/app");
const User = require("../models").User;
// const { validationResult } = require("express-validator");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // find the user
    const user = await User.findOne({
      where: { email },
    });
    // check if the user found
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    // check if password matches
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Password incorrect" });
    }
    // generate auth token
    const userWithToken = generateToken(user.get({ raw: true }));

    return res.send(userWithToken);
  } catch (e) {
    res.end(JSON.stringify({ status: "error", message: e.message }));
  }

  return res.end([]);
};

exports.register = async (req, res) => {
  //   const errors = validationResult(req);

  //   if (!errors.isEmpty()) {
  //     return res.send({ status: 400, errors: errors.array() });
  //   }
  try {
    const user = await User.create(req.body);
    user.password = bcrypt.hashSync(user.password, 10);
    // generate auth token
    const userWithToken = generateToken(user.get({ raw: true }));
    return res.send(userWithToken);
  } catch (e) {
    res.end(JSON.stringify({ status: "error", message: e.message }));
  }
};

function generateToken(user) {
  delete user.password;
  const token = jwt.sign(user, config.appKey, { expiresIn: "7d" });

  return { ...user, ...{ token } };
}
