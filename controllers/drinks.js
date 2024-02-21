const { UserDrinksDB } = require("../models/drinks");
const { ctrlWrapper, userAge, HttpError } = require("../helpers");
// const { User } = require("../models/user");
const { Drink } = require("../models/drinks");

const listDrinks = async (req, res) => {
  const { dateOfBirth } = req.user;

  const age = userAge(dateOfBirth);
  const alcoholic =
    age < 18
      ? ["Non alcoholic"]
      : ["Alcoholic", "Optional alcohol", "Non alcoholic"];
  const data = await Drink.find({ alcoholic: { $in: alcoholic } });
  res.json(data);
};
const searchDrinks = async (req, res) => {
  const { category, ingredient, keyName } = req.query;
  const { dateOfBirth } = req.user;
  const age = userAge(dateOfBirth);
  const alcoholic =
    age < 18
      ? ["Non alcoholic"]
      : ["Alcoholic", "Optional alcohol", "Non alcoholic"];
  let data = await Drink.find({ alcoholic: { $in: alcoholic } });
  if (category) {
    data = data.filter((drink) => drink.category.toLowerCase() === category);
  }
  if (ingredient) {
    data = data.filter((drink) =>
      drink.ingredients.find((item) => item.title.toLowerCase() === ingredient)
    );
  }
  if (keyName) {
    data = data.filter((drink) =>
      drink.drink.toLowerCase().includes(keyName.toLowerCase())
    );
  }
  res.json(data);
};

const addDrink = async (req, res, next) => {
  const { _id: owner, dateOfBirth } = req.user;
  const { alcoholic } = req.body;
  const age = userAge(dateOfBirth);
  if (alcoholic === "Alcoholic" && age < 18) {
    throw HttpError(400);
  }

  const result = await UserDrinksDB.create({ ...req.body, owner });
  const updatedResult = await UserDrinksDB.findById(result._id).select(
    "-createdAt -updatedAt"
  );
  res.status(201).json(updatedResult);
};

const addFavorite = async (req, res, next) => {
  const { drinkId } = req.params;

  const { _id } = req.user;

  const drink = await Drink.findById(drinkId);

  if (drink.favorite.includes(_id)) {
    throw HttpError(400, "cocktail is already in favorites");
  }

  const result = await Drink.findByIdAndUpdate(
    drinkId,
    { $push: { favorite: _id } },
    { new: true }
  );

  res.status(200).json(result);
};

const removeFavorite = async (req, res, next) => {
  const { drinkId } = req.params;
  const { _id } = req.user;

  await Drink.findByIdAndUpdate(
    drinkId,
    { $pull: { favorite: _id } },
    { new: true }
  );
  res.status(200).json({ message: "Drink removed from favorites" });
};

const getFavorite = async (req, res, next) => {
  const { _id } = req.user;

  const favoriteDrinks = await Drink.find({ favorite: _id });

  if (favoriteDrinks.length === 0) {
    throw HttpError(400, "You don't have a favorite drink");
  }

  res.status(200).json(favoriteDrinks);
};

const getMyDrinks = async (req, res, next) => {
  const { _id: owner } = req.user;

  const myDrink = await Drink.find({ owner });
  if (myDrink.length === 0) {
    return res.status(200).json({
      success: true,
      message: "You don't have your own drinks yet",
      data: [],
    });
  }
  res.status(200).json(myDrink);
};

const deleteMyDrink = async (req, res, next) => {
  const { id: drinkId } = req.params;
  const { _id } = req.user;
  const owner = _id.toString();

  // if (!req.isConfirmed) {
  //   throw HttpError(404, "No confirmation of deletion provided");
  // }
  const deletedDrink = await Drink.findByIdAndDelete({
    _id: drinkId,
    owner: owner,
  });

  if (!deletedDrink) {
    throw HttpError(404, "Drink not found or you are not the owner");
  }
  res.status(200).json({ message: "Drink deleted" });
};

module.exports = {
  listDrinks: ctrlWrapper(listDrinks),
  searchDrinks: ctrlWrapper(searchDrinks),
  addDrink: ctrlWrapper(addDrink),
  addFavorite: ctrlWrapper(addFavorite),
  removeFavorite: ctrlWrapper(removeFavorite),
  getFavorite: ctrlWrapper(getFavorite),
  getMyDrinks: ctrlWrapper(getMyDrinks),
  deleteMyDrink: ctrlWrapper(deleteMyDrink),
};
