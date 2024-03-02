const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const dateofbirthRegexp =
  /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      match: dateofbirthRegexp,
      required: [true, "Birth date is required"],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      match: emailRegExp,
      required: [true, "Email is required"],
      unique: true,
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: { type: String, default: null },
    subscribe: {
      type: Boolean,
      default: false,
    },
    avatarURL: {
      type: String,
      default:
        "https://res.cloudinary.com/dh0wbc15k/image/upload/v1708685720/avatars/ZgEyxbk_y6uaSlqjj908B.png.png",
      required: true,
    },
    achievements: {
      addedToFavoriteFirst: {
        type: Boolean,
        default: false,
      },
      addedToFavoriteTenth: {
        type: Boolean,
        default: false,
      },
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const joiSignupSchema = Joi.object({
  name: Joi.string().min(2).max(20).required().empty(false).messages({
    "string.base": "The name must be a string.",
    "any.required": "The name field is required.",
    "string.empty": "The name must not be empty.",
    "string.min": "The name should have at least 2 characters.",
    "string.max": "The name should have at most 20 characters.",
  }),
  dateOfBirth: Joi.string()
    .pattern(dateofbirthRegexp)
    .required()
    .empty(false)
    .messages({
      "string.base": "The date of birth must be a string.",
      "any.required": "The date of birth field is required.",
      "string.empty": "The date of birth must not be empty.",
      "string.pattern.base": "The date of birth must be in format dd/mm/yyyy",
    }),
  email: Joi.string().pattern(emailRegExp).required().empty(false).messages({
    "string.base": "The email must be a string.",
    "any.required": "The email field is required.",
    "string.empty": "The email must not be empty.",
    "string.pattern.base": "The email must be in format test@gmail.com.",
  }),
  password: Joi.string().min(6).required().empty(false).messages({
    "string.base": "The password must be a string.",
    "any.required": "The password field is required.",
    "string.empty": "The password must not be empty.",
    "string.min": "The password should have at least 6 characters.",
  }),
});

const joiSigninSchema = Joi.object({
  password: Joi.string().min(6).required().empty(false).messages({
    "string.base": "The password must be a string.",
    "any.required": "The password field is required.",
    "string.empty": "The password must not be empty.",
    "string.min": "The password should have at least 6 characters.",
  }),
  email: Joi.string().pattern(emailRegExp).required().empty(false).messages({
    "string.base": "The email must be a string.",
    "any.required": "The email field is required.",
    "string.empty": "The email must not be empty.",
    "string.pattern.base": "The email must be in format test@gmail.com.",
  }),
});

const joiRefreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const joiEmailSchema = Joi.object({
  email: Joi.string().empty(false).pattern(emailRegExp).required().messages({
    "string.base": "The email must be a string.",
    "any.required": "The email field is required.",
    "string.empty": "The email must not be empty.",
    "string.pattern.base": "The email must be in format test@gmail.com.",
  }),
});

const schemas = {
  joiSignupSchema,
  joiSigninSchema,
  joiRefreshSchema,
  joiEmailSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
