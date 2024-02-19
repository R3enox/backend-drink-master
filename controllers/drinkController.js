const { ctrlWrapper, HttpError } = require("../helpers");
const { Drink } = require("../models/drinks");

const getDrinkById = async (req, res, next) => {
  const { drinkId } = req.params;
  const cocktail = await Drink.findById(drinkId);
  if (!cocktail) throw HttpError(404);
  res.status(200).json(cocktail);
};

module.exports = {
  getDrinkById: ctrlWrapper(getDrinkById),
};
