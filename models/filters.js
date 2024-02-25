const { Schema, model } = require("mongoose");

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
