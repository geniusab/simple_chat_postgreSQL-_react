const router = require("express").Router();
const {
  chat,
  create,
  messages,
  deleteChat,
  sendMessage,
} = require("../controllers/chatController");
const { auth: authMiddleware } = require("../middleware/auth");

router.get("/", [authMiddleware], chat);
router.post("/create", [authMiddleware], create);
router.post("/messages", [authMiddleware], messages);

//TODO: remove after include socket; for testing insert a new message
// router.post("/sendMessage", [authMiddleware], sendMessage);
router.post("/:id", [authMiddleware], deleteChat);

module.exports = router;
