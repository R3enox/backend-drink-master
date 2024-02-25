const ctrlWrapper = require("../helpers/ctrlWrapper.js");
const { Category, Ingredient, Glass } = require("../models/filters.js");

const listCategories = async (req, res) => {
  const categories = await Category.aggregate([{ $sort: { title: 1 } }]);
  const result = categories.map(({ title }) => title);
  res.json(result);
};

const listIngredients = async (req, res) => {
  const { isAdult } = req.user;

  const filter = {};
  if (!isAdult) filter.alcohol = "No";

  const result = await Ingredient.aggregate([
    { $sort: { title: 1 } },
    { $match: filter },
  ]);
  res.json(result);
};

const listGlasses = async (req, res) => {
  const glasses = await Glass.aggregate([{ $sort: { title: 1 } }]);
  const result = glasses.map(({ title }) => title);
  res.json(result);
};

module.exports = {
  listCategories: ctrlWrapper(listCategories),
  listIngredients: ctrlWrapper(listIngredients),
  listGlasses: ctrlWrapper(listGlasses),
};
