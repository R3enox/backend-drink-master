const express = require("express");

const { isAuthenticated } = require("../../middlewares");

const ctrl = require("../../controllers/drinks");
const checkConfirmation = require("../../middlewares/checkConfirmation");

const router = express.Router();

router.post("/own/add", isAuthenticated, ctrl.addDrink);

router.get("/own", isAuthenticated, ctrl.getMyDrinks);

router.delete(
  "/own/remove/:id",
  isAuthenticated,
  checkConfirmation,
  ctrl.deleteMyDrink
);

module.exports = router;
