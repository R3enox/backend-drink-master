const { CategoriesDB } = require("../models/filters.js");
const { ctrlWrapper } = require("../helpers/index.js");

const listCategories = async (req, res, next) => {
  const result = await CategoriesDB.find();
  res.json(result);
};

module.exports = {
  listCategories: ctrlWrapper(listCategories),
};
