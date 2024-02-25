const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const isAuthenticated = require("./isAuthenticated");
const checkAge = require("./checkAge");
const upload = require("./upload");
const uploadDrinkPhoto = require("./uploadDrinkPhoto");
const passport = require("./google-authenticated");

module.exports = {
  validateBody,
  isValidId,
  isAuthenticated,
  checkAge,
  upload,
  uploadDrinkPhoto,
  passport,
};
