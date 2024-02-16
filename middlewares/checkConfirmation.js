const checkConfirmation = (req, res, next) => {
  const isConfirmed = req.headers["x-is-confirmed"] === "true";
  req.isConfirmed = isConfirmed;
  next();
};

module.exports = checkConfirmation;
