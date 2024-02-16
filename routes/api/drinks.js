const express = require("express");

const ctrl = require("../../controllers/drinks");
const { isAuthenticated } = require("../../middlewares");

const router = express.Router();

router.post("/own/add", ctrl.addDrink);

router.get("/own", isAuthenticated, ctrl.getMyDrinks);

module.exports = router;
