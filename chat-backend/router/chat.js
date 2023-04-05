const router = require("express").Router();
const {
  chat,
  create,
  messages,
  deleteChat,
  sendMessage,
  imageUpload,
  addUserToGroup,
} = require("../controllers/chatController");
const { auth: authMiddleware } = require("../middleware/auth");
const { chatFile: chatMiddleware } = require("../middleware/fileUpload");

router.get("/", [authMiddleware], chat);
router.post("/create", [authMiddleware], create);
// router.post("/messages", [authMiddleware], messages);
router.get("/messages", messages);
router.post("/upload-image", [authMiddleware, chatMiddleware], imageUpload);

//TODO: remove after include socket; for testing insert a new message
// router.post("/sendMessage", [authMiddleware], sendMessage);
router.post("/:id", [authMiddleware], deleteChat);

router.post("/add-user-to-group", [authMiddleware], addUserToGroup);

module.exports = router;
