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
    subscribe: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default:
        "https://res.cloudinary.com/dh0wbc15k/image/upload/v1708685720/avatars/ZgEyxbk_y6uaSlqjj908B.png.png",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const joiSignupSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "missing required field name" }),
  dateOfBirth: Joi.string()
    .pattern(dateofbirthRegexp)
    .required()
    .messages({ "any.required": "missing required field birthdate" }),
  email: Joi.string()
    .pattern(emailRegExp)
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
    .pattern(emailRegExp)
    .required()
    .messages({ "any.required": "missing required field email" }),
});

const joiEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
});

const schemas = {
  joiSignupSchema,
  joiSigninSchema,
  joiEmailSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
