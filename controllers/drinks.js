const { UserDrinksDB } = require("../models/drinks");
const { ctrlWrapper, HttpError } = require("../helpers");
const { User } = require("../models/user");

const addDrink = async (req, res, next) => {
  //   const { _id: owner } = req.user;
  const result = await UserDrinksDB.create({ ...req.body });
  const updatedResult = await UserDrinksDB.findById(result._id).select(
    "-createdAt -updatedAt"
  );
  res.status(201).json(updatedResult);
};

const getMyDrinks = async (req, res, next) => {
  const { _id: owner } = req.user;
  const user = await User.findById(owner);
  if (!user) {
    throw HttpError(404, "User not found");
  }
  const drinks = await UserDrinksDB.find(owner);

  if (drinks.length === 0) {
    return res
      .status(404)
      .json({ message: "You don't have your own drinks yet" });
  }
  res.json(drinks);
};

module.exports = {
  addDrink: ctrlWrapper(addDrink),
  getMyDrinks: ctrlWrapper(getMyDrinks),
};
