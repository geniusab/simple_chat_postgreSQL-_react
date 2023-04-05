const router = require("express").Router();
const { update, search } = require("../controllers/userController");
const { auth: authMiddleware } = require("../middleware/auth");
const { validate } = require("../validators");
const { rules: updateRules } = require("../validators/user/update");
const { userFile } = require("../middleware/fileUpload");

router.post(
  "/update",
  [authMiddleware, userFile, updateRules, validate],
  update
);

router.get("/search-users", authMiddleware, search);

module.exports = router;
