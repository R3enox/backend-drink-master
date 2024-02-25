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
  const { per_category = 3 } = req.query;
  const { dateOfBirth } = req.user;

  const age = getUserAge(dateOfBirth);
  const mustBeAlcoholic = isAdult(age);

  const filter = { category: { $in: popularCategories } };
  if (!mustBeAlcoholic) filter.alcoholic = "Non alcoholic";

  const drinks = await Drink.aggregate([
    {
      $match: filter,
    },
    { $sort: { category: 1, createdAt: -1 } },
    {
      $group: {
        _id: "$category",
        items: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        items: { $slice: ["$items", Number(per_category)] },
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
  const { page = 1, per_page = 10, search, category, ingredient } = req.query;
  const { dateOfBirth } = req.user;

  const age = getUserAge(dateOfBirth);
  const mustBeAlcoholic = isAdult(age);

  const filter = {};
  if (!mustBeAlcoholic) filter.alcoholic = "Non alcoholic";
  if (search) filter.drink = { $regex: search, $options: "i" };
  if (category) filter.category = category;
  if (ingredient) filter.ingredients = { $elemMatch: { title: ingredient } };

  const paginateOptions = setPagination(page, per_page);

  const [
    {
      paginatedResult,
      totalCount: [{ totalCount } = { totalCount: 0 }],
    },
  ] = await Drink.aggregate([
    {
      $facet: {
        paginatedResult: [
          { $match: filter },
          { $skip: paginateOptions.skip },
          { $limit: paginateOptions.limit },
        ],
        totalCount: [{ $match: filter }, { $count: "totalCount" }],
      },
    },
  ]);

  res.json({ paginatedResult, totalCount });
};

const popularDrinks = async (req, res, next) => {
  const { dateOfBirth } = req.user;
  const { limit = 4 } = req.query;

  const age = getUserAge(dateOfBirth);
  const mustBeAlcoholic = isAdult(age);

  const filter = {};
  if (!mustBeAlcoholic) filter.alcoholic = "Non alcoholic";

  const result = await Drink.find(filter);

  result.sort((a, b) => b.favorite.length - a.favorite.length);
  const newArray = result.slice(0, limit);

  res.status(200).json(newArray);
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

  await cloudinary.uploader.destroy(file.filename);

  const photoDrinkUrl = resultCloudinary.secure_url;

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
    drinkThumb: photoDrinkUrl,
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
    throw HttpError(400, "Cocktail is already in favorites");
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
    throw HttpError(404, "Not found");
  }

  res.status(200).json({ message: "Drink is removed from favorites" });
};

const getFavorite = async (req, res, next) => {
  const { page = 1, per_page = 10 } = req.query;
  const { _id } = req.user;

  const filter = { favorite: _id };
  const paginateOptions = setPagination(page, per_page);

  const [
    {
      paginatedResult,
      totalCount: [{ totalCount } = { totalCount: 0 }],
    },
  ] = await Drink.aggregate([
    {
      $facet: {
        paginatedResult: [
          { $match: filter },
          { $skip: paginateOptions.skip },
          { $limit: paginateOptions.limit },
        ],
        totalCount: [{ $match: filter }, { $count: "totalCount" }],
      },
    },
  ]);

  if (totalCount === 0) {
    return res.status(200).json({
      success: true,
      message: "You don't have a favorite drink",
      data: [],
    });
  }

  res.status(200).json({ paginatedResult, totalCount });
};

const getMyDrinks = async (req, res, next) => {
  const { page = 1, per_page = 10 } = req.query;
  const { _id: owner } = req.user;

  const filter = { owner };
  const paginateOptions = setPagination(page, per_page);

  const [
    {
      paginatedResult,
      totalCount: [{ totalCount } = { totalCount: 0 }],
    },
  ] = await Drink.aggregate([
    {
      $facet: {
        paginatedResult: [
          { $match: filter },
          { $skip: paginateOptions.skip },
          { $limit: paginateOptions.limit },
        ],
        totalCount: [{ $match: filter }, { $count: "totalCount" }],
      },
    },
  ]);

  res.status(200).json({ paginatedResult, totalCount });
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
    throw HttpError(404, "Drink not found or user is not the owner");
  }
  res.status(200).json({ message: "Drink is deleted" });
};

module.exports = {
  listDrinks: ctrlWrapper(listDrinks),
  popularDrinks: ctrlWrapper(popularDrinks),
  searchDrinks: ctrlWrapper(searchDrinks),
  addDrink: ctrlWrapper(addDrink),
  addFavorite: ctrlWrapper(addFavorite),
  removeFavorite: ctrlWrapper(removeFavorite),
  getFavorite: ctrlWrapper(getFavorite),
  getMyDrinks: ctrlWrapper(getMyDrinks),
  deleteMyDrink: ctrlWrapper(deleteMyDrink),
};
