const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
  categories: [
    {
      type: String,
    },
  ],
});

const CategoriesDB = mongoose.model("categorie", categoriesSchema);

const ingredientsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  alcohol: {
    type: String,
  },
});

const IngredientsDB = mongoose.model("ingredient", ingredientsSchema);

module.exports = { CategoriesDB, IngredientsDB };
