
const path = require("path");
const { nanoid } = require("nanoid");
const cloudinary = require("cloudinary").v2;

const {
  ctrlWrapper,
  getUserAge,
  HttpError,
  setPagination,
  isAdult,
} = require("../helpers");

const { Drink } = require("../models/drinks");

const popularCategories = [
  "Ordinary Drink",
  "Cocktail",
  "Shake",
  "Other/Unknown",
];

const listDrinks = async (req, res) => {
  const { limit = 3 } = req.query;
  const { dateOfBirth } = req.user;

  const age = getUserAge(dateOfBirth);
  const mustBeAlcoholic = isAdult(age);

  const query = { category: { $in: popularCategories } };
  if (!mustBeAlcoholic) query.alcoholic = "Non alcoholic";

  const drinks = await Drink.aggregate([
    {
      $match: {
        category: {
          $in: popularCategories,
        },
      },
    },
    { $sort: { category: 1, createdAt: 1 } },
    {
      $group: {
        _id: "$category",
        items: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        items: { $slice: ["$items", Number(limit)] },
      },
    },
    { $unwind: "$items" },
    {
      $replaceRoot: {
        newRoot: "$items",
      },
    },
  ]);

  res.json(drinks);
};

const searchDrinks = async (req, res) => {
  const { page = 1, limit = 10, keyName, category, ingredient } = req.query;
  const { dateOfBirth } = req.user;

  const age = getUserAge(dateOfBirth);
  const mustBeAlcoholic = isAdult(age);

  const query = {};
  if (!mustBeAlcoholic) query.alcoholic = "Non alcoholic";
  if (keyName) query.drink = { $regex: keyName, $options: "i" };
  if (category) query.category = category;
  if (ingredient) query.ingredients = { $elemMatch: { title: ingredient } };

  const paginateOptions = setPagination(page, limit);

  const [
    {
      paginatedResult,
      totalCount: [{ totalCount } = { totalCount: 0 }],
    },
  ] = await Drink.aggregate([
    {
      $facet: {
        paginatedResult: [
          { $match: query },
          { $skip: paginateOptions.skip },
          { $limit: paginateOptions.limit },
        ],
        totalCount: [{ $match: query }, { $count: "totalCount" }],
      },
    },
  ]);

  res.json({ paginatedResult, totalCount });
};

const addDrink = async (req, res, next) => {
  const { file } = req;
  const uniqueFilename = nanoid();
  const extension = path.extname(file.originalname);
  const fileName = `${uniqueFilename}${extension}`;

  const resultCloudinary = await cloudinary.uploader.upload(file.path, {
    public_id: `${fileName}`,
    folder: "cocktail",
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  });
  const avatarUrl = resultCloudinary.secure_url;

  const { _id: owner, dateOfBirth } = req.user;

  const {
    drink,
    description,
    category,
    glass,
    alcoholic,
    instructions,
    ingredients,
  } = req.body;

  const age = getUserAge(dateOfBirth);

  if (alcoholic === "Alcoholic" && age < 18) {
    throw HttpError(400);
  }

  const newDrink = new Drink({
    drink,
    description,
    category,
    glass,
    alcoholic,
    instructions,
    drinkThumb: avatarUrl,
    ingredients: ingredients.map(({ title, measure, ingredientId }) => ({
      title,
      measure,
      ingredientId,
    })),
    owner: owner,
  });

  const result = await Drink.create(newDrink);
  const updatedResult = await Drink.findById(result._id).select(
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

  const result = await Drink.findByIdAndUpdate(drinkId, {
    $push: { favorite: _id },
  });

  res.status(200).json(result);
};

const removeFavorite = async (req, res, next) => {
  const { drinkId } = req.params;
  const { _id } = req.user;

  const result = await Drink.findByIdAndUpdate(drinkId, {
    $pull: { favorite: _id },
  });

  if (!result) {
    throw HttpError(404, "not found");
  }

  res.status(200).json({ message: "Drink removed from favorites" });
};

const getFavorite = async (req, res, next) => {
  const { _id } = req.user;

  const favoriteDrinks = await Drink.find({ favorite: _id });

  if (favoriteDrinks.length === 0) {
    return res.status(200).json({
      success: true,
      message: "You don't have a favorite drink",
      data: [],
    });
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
