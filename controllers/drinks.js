const { UserDrinksDB } = require("../models/drinks");
const { ctrlWrapper, userAge, HttpError } = require("../helpers");
const { User } = require("../models/user");
const { Drink } = require("../models/drinks");
const path = require("path");
const { nanoid } = require("nanoid");
const cloudinary = require("cloudinary").v2;

const listDrinks = async (req, res) => {
  const { dateOfBirth } = req.user;

  const age = userAge(dateOfBirth);
  const data = await Drink.find();
  const filteredData =
    age < 18
      ? data.filter((drink) => drink.alcoholic === "Non alcoholic")
      : data;
  res.json(filteredData);
};
const searchDrinks = async (req, res) => {
  const { category, ingredient, keyName } = req.query;
  const { dateOfBirth } = req.user;
  const age = userAge(dateOfBirth);
  const data = await Drink.find();
  let filteredData =
    age < 18
      ? data.filter((drink) => drink.alcoholic === "Non alcoholic")
      : data;

  if (category) {
    filteredData = filteredData.filter(
      (drink) => drink.category.toLowerCase().replace(/ /g, "%20") === category
    );
  }
  if (ingredient) {
    filteredData = filteredData.filter((drink) =>
      drink.ingredients.includes(ingredient)
    );
  }
  if (keyName) {
    filteredData = filteredData.filter((drink) =>
      drink.drink.toLowerCase().includes(keyName.toLowerCase())
    );
  }
  // if (filteredData.length === 0) {
  //   throw HttpError(404, "Not found");
  // }

  res.json(filteredData);
};

const addDrink = async (req, res, next) => {
  const { file } = req;

  const uniqueFilename = nanoid();
  const extension = path.extname(file.originalname);
  const fileName = `${uniqueFilename}${extension}`;

  const resultCloudinary = await cloudinary.uploader.upload(file.path, {
    public_id: `avatars/${fileName}`,
    folder: "avatars",
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  });
  const avatarUrl = resultCloudinary.secure_url;

  const { _id: owner, dateOfBirth } = req.user;
  const { alcoholic } = req.body;
  console.log(alcoholic);
  const age = userAge(dateOfBirth);
  if (alcoholic === "Alcoholic" && age < 18) {
    throw HttpError(400);
  }

  const drink = new UserDrinksDB({
    drink: req.body.drink,
    description: req.body.description,
    category: req.body.category,
    glass: req.body.glass,
    alcoholic: req.body.alcoholic,
    instructions: req.body.instructions,
    drinkThumb: avatarUrl,
    ingredients: [
      {
        title: req.body.ingredients[0][`title`],
        measure: req.body.ingredients[0][`measure`],
        ingredientId: nanoid(),
      },
    ],
    owner: owner,
  });

  const result = await UserDrinksDB.create(drink);
  const updatedResult = await UserDrinksDB.findById(result._id).select(
    "-createdAt -updatedAt"
  );
  res.status(201).json(updatedResult);
};

const addFavorite = async (req, res, next) => {
  const { drinkId } = req.params;

  const { _id } = req.user;

  const drink = await Drink.findById(drinkId);

  if (drink.favorite.includes(_id)) {
    throw HttpError(400, "cocktail is already in favorites");
  }

  const result = await Drink.findByIdAndUpdate(
    drinkId,
    { $push: { favorite: _id } },
    { new: true }
  );

  res.status(200).json(result);
};

const removeFavorite = async (req, res, next) => {
  const { drinkId } = req.params;
  const { _id } = req.user;

  await Drink.findByIdAndUpdate(
    drinkId,
    { $pull: { favorite: _id } },
    { new: true }
  );
  res.status(200).json({ message: "Drink removed from favorites" });
};

const getFavorite = async (req, res, next) => {
  const { _id } = req.user;

  const favoriteDrinks = await Drink.find({ favorite: _id });

  if (favoriteDrinks.length === 0) {
    throw HttpError(400, "You don't have a favorite drink");
  }

  res.status(200).json(favoriteDrinks);
};

const getMyDrinks = async (req, res, next) => {
  const { _id: owner } = req.user;

  const myDrink = await Drink.find({ owner });
  if (myDrink.length === 0) {
    return res.status(200).json({
      success: true,
      message: "You don't have your own drinks yet",
      data: [],
    });
  }
  res.status(200).json(myDrink);
};

const deleteMyDrink = async (req, res, next) => {
  const { id: drinkId } = req.params;
  const { _id } = req.user;
  const owner = _id.toString();

  // if (!req.isConfirmed) {
  //   throw HttpError(404, "No confirmation of deletion provided");
  // }
  const deletedDrink = await Drink.findByIdAndDelete({
    _id: drinkId,
    owner: owner,
  });

  if (!deletedDrink) {
    throw HttpError(404, "Drink not found or you are not the owner");
  }
  res.status(200).json({ message: "Drink deleted" });
};

module.exports = {
  listDrinks: ctrlWrapper(listDrinks),
  searchDrinks: ctrlWrapper(searchDrinks),
  addDrink: ctrlWrapper(addDrink),
  addFavorite: ctrlWrapper(addFavorite),
  removeFavorite: ctrlWrapper(removeFavorite),
  getFavorite: ctrlWrapper(getFavorite),
  getMyDrinks: ctrlWrapper(getMyDrinks),
  deleteMyDrink: ctrlWrapper(deleteMyDrink),
};
