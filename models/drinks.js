const mongoose = require("mongoose");

// connect db user-drinks
const ingredientSchema = {
  title: {
    type: String,
    required: true,
  },
  measure: {
    type: String,
    required: true,
  },
  ingredientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
};

const userDrinksSchema = new mongoose.Schema(
  {
    drink: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    glass: {
      type: String,
      required: true,
    },
    alcoholic: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    drinkThumb: {
      type: String,
      required: true,
    },
    ingredients: [ingredientSchema],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    favorite: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      default: [],
    },
  },
  { versionKey: false, timestamps: true }
);

const Drink = mongoose.model("recipe", userDrinksSchema);

module.exports = { Drink };
