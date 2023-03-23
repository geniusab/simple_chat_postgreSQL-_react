require("dotenv").config();

module.exports = {
  appKey: process.env.API_KEY,
  appUrl: process.env.APP_URL,
  appPort: process.env.APP_PORT,
};
