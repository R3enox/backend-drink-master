const mongoose = require("mongoose");

// connect db categories
const categoriesSchema = new mongoose.Schema(
  {
    categories: [
      {
        type: String,
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const CategoriesDB = mongoose.model("categorie", categoriesSchema);

// connect db ingredients
const ingredientsSchema = new mongoose.Schema(
  {
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
  },
  { versionKey: false, timestamps: true }
);

const IngredientsDB = mongoose.model("ingredient", ingredientsSchema);

// connect db glasses
const glassesSchema = new mongoose.Schema(
  {
    glasses: [
      {
        type: String,
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const GlassesDB = mongoose.model("glasse", glassesSchema);

module.exports = { CategoriesDB, IngredientsDB, GlassesDB };
