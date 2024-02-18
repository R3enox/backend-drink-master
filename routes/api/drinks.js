const express = require("express");

const ctrl = require("../../controllers/drinks");
const checkConfirmation = require("../../middlewares/checkConfirmation");

const router = express.Router();
const { isAuthenticated } = require("../../middlewares");
// isAuthenticated добавлю позже
router.get("/", ctrl.listDrink);

router.post("/own/add", isAuthenticated, ctrl.addDrink);

// favorite
router.post("/:drinkId/favorite/add/", isAuthenticated, ctrl.addFavorite);

router.delete(
  "/:drinkId/favorite/remove",
  isAuthenticated,
  ctrl.removeFavorite
);

router.get("/favorite", isAuthenticated, ctrl.getFavorite);

router.get("/own", isAuthenticated, ctrl.getMyDrinks);

router.delete(
  "/own/remove/:id",
  isAuthenticated,
  checkConfirmation,
  ctrl.deleteMyDrink
);

module.exports = router;
