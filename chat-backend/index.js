const express = require("express");
const bodyParser = require("body-parser");

const config = require("./config/app");
const router = require("./router");
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(router);

const port = config.appPort;
app.listen(port, () => {
  console.log(`Serving listening on port ${port}.`);
});
