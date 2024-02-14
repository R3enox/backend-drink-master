const { UserDrinksDB } = require("../models/drinks");
const { ctrlWrapper } = require("../helpers");

const addDrink = async (req, res, next) => {
  //   const { _id: owner } = req.user;
  const result = await UserDrinksDB.create({ ...req.body });
  const updatedResult = await UserDrinksDB.findById(result._id).select(
    "-createdAt -updatedAt"
  );
  res.status(201).json(updatedResult);
};

module.exports = {
  addDrink: ctrlWrapper(addDrink),
};
