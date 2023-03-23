const router = require("express").Router();

router.get("/home", (req, res) => {
  res.send("home screen");
});

router.use("/", require("./auth"));

module.exports = router;
