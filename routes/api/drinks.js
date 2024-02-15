const express = require("express");


const ctrl = require("../../controllers/drinks");

const router = express.Router();

router.post("/own/add", ctrl.addDrink);

module.exports = router;






