const setAlcoholic = (age) =>
  age < 18
    ? ["Non alcoholic"]
    : ["Alcoholic", "Non alcoholic", "Optional alcohol"];

module.exports = setAlcoholic;
