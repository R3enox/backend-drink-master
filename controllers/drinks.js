const { UserDrinksDB } = require("../models/drinks");
const { ctrlWrapper } = require("../helpers");

const addDrink = async (req, res, next) => {
  //   const { _id: owner } = req.user;
  const result = await UserDrinksDB.create({ ...req.body });
  res.json(result);
};

module.exports = {
  addDrink: ctrlWrapper(addDrink),
};
