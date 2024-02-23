const express = require("express");

const router = express.Router();
const ctrl = require("../../controllers/drinkController");
const { isAuthenticated } = require("../../middlewares");

router.get("/:drinkId", isAuthenticated, ctrl.getDrinkById);

module.exports = router;
