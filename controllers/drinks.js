// const fs = require("fs/promises");
// const path = require("path");
const Jimp = require("jimp");
const { UserDrinksDB } = require("../models/drinks");
const { ctrlWrapper, userAge, HttpError } = require("../helpers");
const { User } = require("../models/user");

const { Drink } = require("../models/drinks");

const listDrink = async (req, res) => {
  // checking age +18
  // checking login user
  const data = await Drink.find();
  res.json(data);
};

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

const getMyDrinks = async (req, res, next) => {
  const { _id: owner } = req.user;
  const user = await User.findById(owner);
  if (!user) {
    throw HttpError(404);
  }
  const drinks = await UserDrinksDB.find(owner);

  if (drinks.length === 0) {
    throw HttpError(404, "You don't have your own drinks yet");
  }
  res.json(drinks);
};

const deleteMyDrink = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { id: drinkId } = req.params;

  // Перевіряю, чи підтвердив користувач видалення
  if (!req.isConfirmed) {
    throw HttpError(404, "No confirmation of deletion provided");
  }

  // Видаляємо напій, перевіряючи обидва поля _id напою та owner
  const result = await UserDrinksDB.findByIdAndDelete({
    _id: drinkId,
    owner: owner,
  });

  if (!result) {
    throw HttpError(404, "Drink not found or you are not the owner");
  }

  res.status(200).json({ message: "Drink deleted" });
};

module.exports = {
  listDrink: ctrlWrapper(listDrink),
  addDrink: ctrlWrapper(addDrink),
  getMyDrinks: ctrlWrapper(getMyDrinks),
  deleteMyDrink: ctrlWrapper(deleteMyDrink),
};
