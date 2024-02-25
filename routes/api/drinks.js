const express = require("express");

const ctrl = require("../../controllers/drinksController");

const router = express.Router();
const { isAuthenticated } = require("../../middlewares");

const uploadDrinkPhoto = require("../../middlewares/uploadDrinkPhoto");

router.get("/", isAuthenticated, ctrl.listDrinks);

router.get("/search", isAuthenticated, ctrl.searchDrinks);

router.get("/popular", isAuthenticated, ctrl.popularDrinks);

router.get("/own", isAuthenticated, ctrl.getMyDrinks);

router.post(
  "/own/add",
  isAuthenticated,
  uploadDrinkPhoto.single("drinkThumb"),
  ctrl.addDrink
);

router.get("/favorite", isAuthenticated, ctrl.getFavorite);

router.post("/:drinkId/favorite/add/", isAuthenticated, ctrl.addFavorite);

router.delete(
  "/:drinkId/favorite/remove",
  isAuthenticated,
  ctrl.removeFavorite
);

router.delete("/own/remove/:id", isAuthenticated, ctrl.deleteMyDrink);

router.get("/:drinkId", isAuthenticated, ctrl.getDrinkById);

module.exports = router;
