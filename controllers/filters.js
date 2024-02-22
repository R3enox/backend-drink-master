const { Category, Ingredient, Glass } = require("../models/filters.js");
const { ctrlWrapper, userAge } = require("../helpers/index.js");

const listCategories = async (req, res, next) => {
  const categories = await Category.find();
  const result = categories.map(({ title }) => title);
  res.json(result);
};

const listIngredients = async (req, res, next) => {
  const { dateOfBirth } = req.user;
  const age = userAge(dateOfBirth);
  const alcohol = age < 18 ? "No" : ["Yes", "No"];
  const result = await Ingredient.find({ alcohol });
  res.json(result);
};

const listGlasses = async (req, res, next) => {
  const glasses = await Glass.find();
  const result = glasses.map(({ title }) => title);
  res.json(result);
};

module.exports = {
  listCategories: ctrlWrapper(listCategories),
  listIngredients: ctrlWrapper(listIngredients),
  listGlasses: ctrlWrapper(listGlasses),
};
