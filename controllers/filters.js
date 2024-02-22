const { Category, Ingredient, Glass } = require("../models/filters.js");
const { ctrlWrapper, getUserAge, isAdult } = require("../helpers/index.js");

const listCategories = async (req, res) => {
  const categories = await Category.find();
  const result = categories.map(({ title }) => title);
  res.json(result);
};

const listIngredients = async (req, res) => {
  const { dateOfBirth } = req.user;

  const age = getUserAge(dateOfBirth);
  const mustHaveAlcohol = isAdult(age);

  const filter = {};
  if (!mustHaveAlcohol) filter.alcohol = "No";

  const result = await Ingredient.find(filter);

  res.json(result);
};

const listGlasses = async (req, res) => {
  const glasses = await Glass.find();
  const result = glasses.map(({ title }) => title);
  res.json(result);
};

module.exports = {
  listCategories: ctrlWrapper(listCategories),
  listIngredients: ctrlWrapper(listIngredients),
  listGlasses: ctrlWrapper(listGlasses),
};
