const { Schema, model } = require("mongoose");

// const Joi = require("joi");

const { handleMongooseError } = require("../middlewares");

const drinkSchema = new Schema({});

drinkSchema.post("save", handleMongooseError);

const Drink = model("recipe", drinkSchema);

module.exports = {
  Drink,
};
