const { Schema, model } = require("mongoose");

//* connect db categories
const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Category = model("category", categorySchema);

//* connect db ingredients
const ingredientSchema = new Schema(
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

const Ingredient = model("ingredient", ingredientSchema);

//* connect db glasses
const glassSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Glass = model("glass", glassSchema);

module.exports = { Category, Ingredient, Glass };
