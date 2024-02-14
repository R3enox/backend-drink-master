const {
  IngredientsDB,
  CategoriesDB,
  GlassesDB,
} = require("../models/filters.js");
const { ctrlWrapper } = require("../helpers/index.js");

const listCategories = async (req, res, next) => {
  const result = await CategoriesDB.find();
  res.json(result);
};

const listIngredients = async (req, res, next) => {
  const result = await IngredientsDB.find();
  res.json(result);
};

const listGlasses = async (req, res, next) => {
  const result = await GlassesDB.find();
  res.json(result);
};
module.exports = {
  listCategories: ctrlWrapper(listCategories),
  listIngredients: ctrlWrapper(listIngredients),
  listGlasses: ctrlWrapper(listGlasses),
};
