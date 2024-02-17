const { ctrlWrapper, HttpError } = require("../helpers");
const { UserDrinksDB } = require("../models/drinks");

const getContactById = async (req, res, next) => {
  const { drinkId } = req.params;
  const cocktail = await UserDrinksDB.findById(drinkId);
  if (!cocktail) throw HttpError(404);
  res.status(200).json(cocktail);
};

module.exports = {
  getContactById: ctrlWrapper(getContactById),
};
