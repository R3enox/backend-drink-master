const mongoose = require("mongoose");

// connect db categories
const categoriesSchema = new mongoose.Schema({
  categories: [
    {
      type: String,
    },
  ],
});

const CategoriesDB = mongoose.model("categorie", categoriesSchema);

// connect db ingredients
const ingredientsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  ingredientThumb: {
    type: String,
  },

  alcohol: {
    type: String,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
  },
});

const IngredientsDB = mongoose.model("ingredient", ingredientsSchema);

module.exports = { CategoriesDB, IngredientsDB };
