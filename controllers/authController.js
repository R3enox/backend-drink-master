const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { ctrlWrapper, HttpError } = require("../helpers");
const { default: mongoose } = require("mongoose");

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY, FRONTEND_URL } = process.env;

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
  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: "2m" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });

  const newUser = await User.create({
    ...req.body,
    _id,
    accessToken,
    refreshToken,
    password: hashPassword,
  });

  res.status(201).json({
    accessToken,
    refreshToken,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      dateOfBirth: newUser.dateOfBirth,
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
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: "2m" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });

  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      avatarURL: user.avatarURL,
    },
  });
};

const googleAuth = async (req, res) => {
  const { _id: id } = req.user;
  const payload = {
    id,
  };
  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: "2m" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  await User.findByIdAndUpdate(id, { accessToken, refreshToken });

  res.redirect(
    `${FRONTEND_URL}/google?accessToken=${accessToken}&refreshToken=${refreshToken}`
  );
};

const refresh = async (req, res) => {
  const { refreshToken: token } = req.body;
  try {
    const { id } = jwt.verify(token, REFRESH_SECRET_KEY);
    const isExist = await User.findOne({ refreshToken: token });
    if (!isExist) throw HttpError(403, "Token invalid");

    const payload = {
      id,
    };
    const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
      expiresIn: "7d",
    });
    await User.findByIdAndUpdate(isExist._id, { accessToken, refreshToken });
    res.json({ accessToken, refreshToken });
  } catch (error) {
    throw HttpError(403);
  }
};

const signOut = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { accessToken: null, refreshToken: null });

  res.status(204).json({ message: "No Content" });
};

module.exports = {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  googleAuth: ctrlWrapper(googleAuth),
  refresh: ctrlWrapper(refresh),
  signOut: ctrlWrapper(signOut),
};
