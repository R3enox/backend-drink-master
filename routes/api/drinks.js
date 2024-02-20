const express = require("express");

const ctrl = require("../../controllers/drinks");

// const checkConfirmation = require("../../middlewares/checkConfirmation");

const router = express.Router();
const { isAuthenticated } = require("../../middlewares");
const uploadDrinkPhoto = require("../../middlewares/uploadDrinkPhoto");

router.get("/", isAuthenticated, ctrl.listDrinks);
router.get("/search", isAuthenticated, ctrl.searchDrinks);
router.post(
  "/own/add",
  isAuthenticated,
  uploadDrinkPhoto.single("drinkThumb"),
  ctrl.addDrink
);
router.get("/own", isAuthenticated, ctrl.getMyDrinks);
router.delete(
  "/own/remove/:id",
  isAuthenticated,
  // checkConfirmation,
  ctrl.deleteMyDrink
);

module.exports = router;
