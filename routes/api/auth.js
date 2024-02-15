const express = require("express");

const authController = require("../../controllers/authController");

const { validateBody, isAuthenticated } = require("../../middlewares");

const { schemas } = require("../../models/user");

const router = express.Router();

router.post(
  "/signup",
  validateBody(schemas.joiSignupSchema),
  authController.signUp
);

router.post(
  "/signin",
  validateBody(schemas.joiSigninSchema),
  authController.signIn
);

router.get("/current", isAuthenticated, authController.getCurrent);

router.post("/signout", isAuthenticated, authController.signOut);

module.exports = router;
