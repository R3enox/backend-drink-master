const express = require("express");
const ctrl = require("../../controllers/drinks");
const router = express.Router();

router.get("/", ctrl.listDrink);

module.exports = router;
