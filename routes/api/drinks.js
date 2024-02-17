const express = require("express");

const ctrl = require("../../controllers/drinks");

const router = express.Router();
const { isAuthenticated } = require("../../middlewares");
// isAuthenticated добавлю позже
router.get("/", ctrl.listDrink);

router.post("/own/add", isAuthenticated, ctrl.addDrink);

// getDrinkById
router.get("/:drinkId", isAuthenticated, ctrl.getById);

// favorite
router.post("/:drinkId/favorite/add/", isAuthenticated, ctrl.addFavorite);

router.delete(
  "/:drinkId/favorite/remove",
  isAuthenticated,
  ctrl.removeFavorite
);

router.get("/favorite", isAuthenticated, ctrl.getFavorite);

module.exports = router;
