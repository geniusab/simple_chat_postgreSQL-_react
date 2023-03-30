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
router.post("/:id", [authMiddleware], deleteChat);

//TODO: remove after include socket; for testing insert a new message
router.post("/sendMessage", [authMiddleware], sendMessage);

module.exports = router;
