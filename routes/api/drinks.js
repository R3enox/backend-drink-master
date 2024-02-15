const express = require("express");

const ctrl = require("../../controllers/drinks");

const router = express.Router();
const { isAuthenticated } = require("../../middlewares");
// isAuthenticated добавлю позже
router.get("/", ctrl.listDrink);

router.post("/own/add", isAuthenticated, ctrl.addDrink);

module.exports = router;
