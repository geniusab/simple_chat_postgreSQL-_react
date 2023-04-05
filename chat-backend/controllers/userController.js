const sequelize = require("sequelize");
const config = require("../config/app");
const User = require("../models").User;

exports.update = async (req, res) => {
  if (req.file) {
    req.body.avatar = req.file.filename;
  }

  if (typeof req.body.avatar !== "undefined" && req.body.avatar.length === 0)
    delete req.body.avatar;

  try {
    const [rows, result] = await User.update(req.body, {
      where: {
        id: req.user.id,
      },
      returning: true,
      individualHooks: true,
    });

    const user = result[0].get({ raw: true });
    user.avatar = result[0].avatar;
    delete user.password;
    return res.send(user);

    // const { id } = req.params;
    // const user = await User.findOne({
    //   where: { id },
    // });
    // user.update({ firstName });
  } catch (e) {
    res.end(JSON.stringify({ status: "error", message: e.message }));
  }
};

exports.search = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        [sequelize.Op.or]: {
          namesConcated: sequelize.where(
            sequelize.fn(
              "concat",
              sequelize.col("firstName"),
              " ",
              sequelize.col("lastName")
            ),
            {
              [sequelize.Op.iLike]: `%${req.query.term}%`,
            }
          ),
          email: {
            [sequelize.Op.iLike]: `%${req.query.term}%`,
          },
        },
        [sequelize.Op.not]: {
          id: req.user.id,
        },
      },
      limit: 10,
    });

    return res.json(users);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
