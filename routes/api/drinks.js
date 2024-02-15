const express = require("express");

const { isAuthenticated } = require("../../middlewares");

const ctrl = require("../../controllers/drinks");

const router = express.Router();

router.post("/own/add", isAuthenticated, ctrl.addDrink);

module.exports = router;
