const express = require("express");

const ctrl = require("../../controllers/filters");

const router = express.Router();

router.get("/categories", ctrl.listCategories);

router.get("/ingredients", ctrl.listIngredients);

router.get("/glasses", ctrl.listGlasses);

module.exports = router;

