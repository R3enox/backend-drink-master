const express = require("express");

const { isAuthenticated, checkAge } = require("../../middlewares");

const ctrl = require("../../controllers/filtersController");

const router = express.Router();

router.get("/categories", isAuthenticated, ctrl.listCategories);

router.get("/ingredients", isAuthenticated, checkAge, ctrl.listIngredients);

router.get("/glasses", isAuthenticated, ctrl.listGlasses);

module.exports = router;
