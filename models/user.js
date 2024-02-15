const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    birthdate: {
      type: Number,
      required: [true, "Birth date is required"],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    token: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const joiSignupSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "missing required field name" }),
  birthdate: Joi.string().required(),
  email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .messages({ "any.required": "missing required field email" }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({ "any.required": "missing required field password" }),
});

const joiSigninSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .required()
    .messages({ "any.required": "missing required field password" }),
  email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .messages({ "any.required": "missing required field email" }),
});

const schemas = {
  joiSignupSchema,
  joiSigninSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
