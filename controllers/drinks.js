const { UserDrinksDB } = require("../models/drinks");
const { ctrlWrapper, userAge, HttpError } = require("../helpers");
const { User } = require("../models/user");

const addDrink = async (req, res, next) => {
  const { _id: owner, dateOfBirth } = req.user;
  const { alcoholic } = req.body;
  const age = userAge(dateOfBirth);
  if (alcoholic === "Alcoholic" && age < 18) {
    throw HttpError(400);
  }

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
  addDrink: ctrlWrapper(addDrink),
  getMyDrinks: ctrlWrapper(getMyDrinks),
  deleteMyDrink: ctrlWrapper(deleteMyDrink),
};
