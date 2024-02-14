const mongoose = require("mongoose");
const { ctrlWrapper } = require("../helpers/index.js");

const categoriesDB = mongoose.model("Categories");

const listCategories = async (req, res, next) => {
  const result = await categoriesDB.find();
  res.json(result);
};

module.exports = {
  listCategories: ctrlWrapper(listCategories),
};
