const express = require("express");

const { isAuthenticated, upload, validateBody } = require("../../middlewares");
const ctrl = require("../../controllers/usersController");
const { schemas } = require("../../models/user");

const router = express.Router();

router.post(
  "/subscribe",
  isAuthenticated,
  validateBody(schemas.joiEmailSchema),
  ctrl.subscribe
);

router.get("/current", isAuthenticated, ctrl.getCurrent);

router.patch(
  "/update",
  isAuthenticated,
  upload.single("avatar"),
  ctrl.updateUser
);

router.get(
  "/achievements/activity",
  isAuthenticated,
  ctrl.checkActivityAchievements
);

router.get(
  "/achievements/add-to-favorites",
  isAuthenticated,
  ctrl.checkAddToFavoritesAchievements
);

router.get(
  "/achievements/create-own",
  isAuthenticated,
  ctrl.checkCreateOwnAchievements
);

module.exports = router;
