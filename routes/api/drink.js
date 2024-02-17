const express = require("express");

const router = express.Router();
const ctrl = require("../../controllers/drinkController");


router.get("/:drinkId", ctrl.getContactById);


module.exports = router;