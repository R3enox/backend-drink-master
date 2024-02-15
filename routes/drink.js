const express = require("express");
const getContactById = require("../controllers/drinkController");
const router = express.Router();


router.get("/:drinkId", getContactById);


module.exports = router;