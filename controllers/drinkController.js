const { Schema, model } = require("mongoose");

const { HttpError, ctrlWrapper } = require("../helpers");

const getMyDrinks = async (req, res, next) => {
  const { _id: owner } = req.user;

  // Уточнити назву моделі
  const user = await UserModel.findById({ owner });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  // Уточнити назву моделі
  const drinks = await DrinksModel.find({ owner });
  // якщо масив власників
  // const drinks = await DrinksModel.find({ owners: owner });
  // Уточнити назву поля myDrinks
  if (!user.myDrinks || user.myDrinks.length === 0) {
    throw HttpError(404, "User has no drinks");
  }
  res.json(drinks);
};

module.exports = {
  getMyDrinks: ctrlWrapper(getMyDrinks),
};

// Додати у модель нвпоїв (в залежності від кількості owners)

// owner: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
// required: "true",
//     },

// або
// owners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }];

//Перевірка, чи валідний _id

// const { isValidObjectId } = require("mongoose");

// const isValidId = (req, res, next) => {
//   const { _id } = req.user;
//   if (!isValidObjectId(_id)) {
//     return next(HttpError(404, `Id "${_id}" is not valid`));
//   }
//   next();
// };

// module.exports = isValidId;

const deleteMtDrink = async (req, res, next) => {
  const { _id } = req.params;
  const result = await DrinksModel.findByIdAndDelete(_id);
  if (!result) {
    throw HttpError(404, "Contact not found");
  }

  res.status(200).json({ message: "contact deleted" });
};
