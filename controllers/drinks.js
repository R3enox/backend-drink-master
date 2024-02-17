const { UserDrinksDB } = require("../models/drinks");
const { ctrlWrapper, userAge, HttpError } = require("../helpers");

const { Drink } = require("../models/drinks");

const listDrinks = async (req, res) => {
  const { dateOfBirth } = req.user;

  const age = userAge(dateOfBirth);
  const data = await Drink.find();
  const filteredData =
    age < 18 ? data.filter((drink) => drink.alcoholic !== "Alcoholic") : data;
  res.json(filteredData);
};
const searchDrinks = async (req, res) => {
  const { category, ingredient, keyName } = req.query;
  const { dateOfBirth } = req.user;
  const age = userAge(dateOfBirth);
  const data = await Drink.find();
  let filteredData =
    age < 18 ? data.filter((drink) => drink.alcoholic !== "Alcoholic") : data;

  if (category) {
    filteredData = filteredData.filter(
      (drink) => drink.category.toLowerCase().replace(/ /g, "%20") === category
    );
  }
  if (ingredient) {
    filteredData = filteredData.filter((drink) =>
      drink.ingredients.includes(ingredient)
    );
  }
  if (keyName) {
    filteredData = filteredData.filter((drink) =>
      drink.drink.toLowerCase().includes(keyName.toLowerCase())
    );
  }
  // if (filteredData.length === 0) {
  //   throw HttpError(404, "Not found");
  // }

  res.json(filteredData);
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

module.exports = {
  listDrinks: ctrlWrapper(listDrinks),
  searchDrinks: ctrlWrapper(searchDrinks),
  addDrink: ctrlWrapper(addDrink),
};
