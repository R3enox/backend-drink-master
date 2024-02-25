const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const isAuthenticated = require("./isAuthenticated");
const checkAge = require("./checkAge");
const upload = require("./upload");
const uploadDrinkPhoto = require("./uploadDrinkPhoto");

module.exports = {
  validateBody,
  isValidId,
  isAuthenticated,
  checkAge,
  upload,
  uploadDrinkPhoto,
};
