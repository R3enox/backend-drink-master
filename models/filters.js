const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
  categories: [
    {
      type: String,
    },
  ],
});

const CategoriesDB = mongoose.model("Categories", categoriesSchema);

module.exports = CategoriesDB;
