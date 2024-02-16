const mongoose = require("mongoose");

// connect db user-drinks
const ingredientSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  measure: {
    type: String,
    required: true,
  },
  ingredientId: {
    type: String,
    required: true,
  },
});

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
  },
  { versionKey: false, timestamps: true }
);

const UserDrinksDB = mongoose.model("user-drink", userDrinksSchema);
const Drink = mongoose.model("recipe", userDrinksSchema);

module.exports = { UserDrinksDB, Drink };
