// const DrinksModel = require("../models/DrinksModel");

const getContactById = async (req, res, next) => {
  try {
    const { drinkId } = req.params;
    // const cocktail = await DrinksModel.findById(drinkId);
    return res.status(200).json(drinkId);
  } catch (error) {
    next(error);
  }
};

module.exports = getContactById;
