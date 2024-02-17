// const fs = require("fs/promises");
// const path = require("path");
const Jimp = require("jimp");
const { UserDrinksDB } = require("../models/drinks");
const { ctrlWrapper, userAge, HttpError } = require("../helpers");

// const avatarDir = path.join(__dirname, "../", "public", "avatars");

const addDrink = async (req, res, next) => {
  // const { path: tempUpload, originalname } = req.file;
  const { _id: owner, dateOfBirth } = req.user;
  const { alcoholic } = req.body;
  const age = userAge(dateOfBirth);
  if (alcoholic === "Alcoholic" && age < 18) {
    throw HttpError(400);
  }

  // const image = await Jimp.read(tempUpload);
  // await image.resize(250, 250);

  // const fileName = `${_id}_${originalname}`;
  // console.log(fileName);
  // const resultUpdateAvatar = path.join(avatarDir, fileName);

  // await image.writeAsync(resultUpdateAvatar);
  // await fs.unlink(tempUpload);
  // const avatarURL = path.join("avatars", fileName);

  const result = await UserDrinksDB.create({ ...req.body, owner });
  const updatedResult = await UserDrinksDB.findById(result._id).select(
    "-createdAt -updatedAt"
  );
  res.status(201).json(updatedResult);
};

module.exports = {
  addDrink: ctrlWrapper(addDrink),
};
