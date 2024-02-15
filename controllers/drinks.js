const { UserDrinksDB } = require("../models/drinks");
const { ctrlWrapper, userAge, HttpError } = require("../helpers");

const addDrink = async (req, res, next) => {
  const { _id: owner, birthdate } = req.user;
  const { alcoholic } = req.body;
  const age = userAge(birthdate);
  if (alcoholic === "Alcoholic" && age < 18) {
    throw HttpError(400);
  }

  const result = await UserDrinksDB.create({ ...req.body, owner });
  const updatedResult = await UserDrinksDB.findById(result._id).select(
    "-createdAt -updatedAt"
  );
  res.status(201).json(updatedResult);
};

module.exports = {
  addDrink: ctrlWrapper(addDrink),
};
