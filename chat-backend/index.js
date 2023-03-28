const express = require("express");
const bodyParser = require("body-parser");

const config = require("./config/app");
const router = require("./router");
const app = express();

// CORS middleware
const allowCrossDomain = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `http://localhost:3000`);
  res.header(`Access-Control-Allow-Methods`, `GET,PATCH,PUT,POST,DELETE`);
  // res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  res.header(`Access-Control-Allow-Headers`, `*`);
  next();
};
app.use(allowCrossDomain);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

app.use(router);
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/uploads"));

const port = config.appPort;
app.listen(port, () => {
  console.log(`Serving listening on port ${port}.`);
});
