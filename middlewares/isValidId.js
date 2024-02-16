const { isValidObjectId } = require("mongoose");

const { HttpError } = require("../helpers");

const isValidId = (req, res, next) => {
  const { _id } = req.params;
  if (!isValidObjectId(_id)) {
    next(HttpError(404, `Id "${_id}" is not valid`));
  }
  next();
};

module.exports = isValidId;
