const express = require("express");

const ctrl = require("../../controllers/filters");

const router = express.Router();

router.get("/categories", ctrl.listCategories);

router.get("/ingredients", () => {});

router.get("/glasses", () => {});

module.exports = router;
