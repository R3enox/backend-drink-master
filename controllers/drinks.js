const { UserDrinksDB } = require("../models/drinks");
const { ctrlWrapper, userAge, HttpError } = require("../helpers");

const { Drink } = require("../models/drinks");
// const { default: mongoose } = require("mongoose");

const listDrink = async (req, res) => {
  // checking age +18
  // checking login user
  const data = await Drink.find();
  res.json(data);
};

const addDrink = async (req, res, next) => {
  const { _id: owner, birthdate } = req.user;
  const { alcoholic } = req.body;
  const age = userAge(birthdate);
  if (alcoholic === "Alcoholic" && age < 18) {
    throw HttpError(400);
  }

  const result = await UserDrinksDB.create({ ...req.body, owner });
  const updatedResult = await UserDrinksDB.findById(result._id).select(
    "-createdAt -updatedAt"
  );
  res.status(201).json(updatedResult);
};

// getDrinklById
const getById = async (req, res, next) => {
  const { drinkId } = req.params;

  const result = await UserDrinksDB.findById(drinkId);

  if (!result) {
    throw HttpError(404, `Not found`);
  }

  res.status(200).json(result);
};

// favorite

const addFavorite = async (req, res, next) => {
  const { drinkId } = req.params;

  const { _id } = req.user;

  const drink = await UserDrinksDB.findById(drinkId);

  if (drink.favorite.includes(_id)) {
    throw HttpError(400, "cocktail is already in favorites");
  }

  const result = await UserDrinksDB.findByIdAndUpdate(
    drinkId,
    { $push: { favorite: _id } },
    { new: true }
  );

  res.status(200).json(result);
};

const removeFavorite = async (req, res, next) => {
  const { drinkId } = req.params;
  const { _id } = req.user;
  const result = await UserDrinksDB.findByIdAndUpdate(
    drinkId,
    { $pull: { favorite: _id } },
    { new: true }
  );
  res.json(result);
};

const getFavorite = async (req, res, next) => {
  const { _id } = req.user;
  // console.log('_id: ', _id);

  const favoriteDrinks = await UserDrinksDB.find({ favorite: _id });

  if (!favoriteDrinks) {
    throw HttpError(400, "you don't have a favorite drink");
  }

  res.status(200).json(favoriteDrinks);
};

module.exports = {
  listDrink: ctrlWrapper(listDrink),
  addDrink: ctrlWrapper(addDrink),
  addFavorite: ctrlWrapper(addFavorite),
  removeFavorite: ctrlWrapper(removeFavorite),
  getFavorite: ctrlWrapper(getFavorite),
  getById: ctrlWrapper(getById),
};
