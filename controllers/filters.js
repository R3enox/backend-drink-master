const { categoriesDB, IngredientsDB } = require("../models/filters.js");
const { ctrlWrapper } = require("../helpers/index.js");

const listCategories = async (req, res, next) => {
  const result = await categoriesDB.find();
  res.json(result);
};

const listIngredients = async (req, res, next) => {
  const result = await IngredientsDB.find();
  res.json(result);
};

module.exports = {
  listCategories: ctrlWrapper(listCategories),
  listIngredients: ctrlWrapper(listIngredients),
};
