const { getUserAge, isAdult } = require("../helpers");

const checkAge = (req, res, next) => {
  const { dateOfBirth } = req.user;

  const age = getUserAge(dateOfBirth);
  req.user.isAdult = isAdult(age);

  next();
};

module.exports = checkAge;
