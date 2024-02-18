const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { ctrlWrapper, HttpError } = require("../helpers");
const { default: mongoose } = require("mongoose");

const fs = require("node:fs/promises");

const path = require("node:path");

const Jimp = require("jimp");

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const signUp = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const _id = new mongoose.Types.ObjectId();
  const payload = {
    id: _id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });

  const newUser = await User.create({
    ...req.body,
    _id,
    token,
    password: hashPassword,
  });

  res.status(201).json({
    token,
    user: {
      name: newUser.name,
      avatarURL: newUser.avatarURL,
    },
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  console.log(user);
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      name: user.name,
      avatarURL: user.avatarURL,
    },
  });
};

const signOut = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({ message: "No Content" });
};

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  console.log(req.file);
  const { path: tempUpload, originalname } = req.file;

  if (!req.file) {
    console.log("Please upload a file");
    next();
  }

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  const picture = await Jimp.read(tempUpload);
  await picture.scaleToFit(250, 250).writeAsync(tempUpload);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  signOut: ctrlWrapper(signOut),
  updateAvatar: ctrlWrapper(updateAvatar),
};
