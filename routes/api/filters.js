const express = require("express");

const { isAuthenticated } = require("../../middlewares");

const ctrl = require("../../controllers/filters");

const router = express.Router();

router.get("/categories", isAuthenticated, ctrl.listCategories);

router.get("/ingredients", isAuthenticated, ctrl.listIngredients);

router.get("/glasses", isAuthenticated, ctrl.listGlasses);

module.exports = router;
