const express = require("express");
const ctrl = require("../../controllers/usersController");

const { isAuthenticated, upload, validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user");
const usersController = require("../../controllers/usersController");

const router = express.Router();

router.post(
  "/subscribe",
  isAuthenticated,
  validateBody(schemas.joiEmailSchema),
  usersController.subscribe
);

router.get("/current", isAuthenticated, ctrl.getCurrent);

router.patch(
  "/update",
  isAuthenticated,
  upload.single("avatar"),
  ctrl.updateUser
);

router.get(
  "/achievements/add-to-favorites",
  isAuthenticated,
  ctrl.checkAddToFavoritesAchievements
);

module.exports = router;
