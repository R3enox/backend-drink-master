const express = require("express");

const authController = require("../../controllers/authController");

const {
  validateBody,
  isAuthenticated,
  passport,
} = require("../../middlewares");

const { schemas } = require("../../models/user");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleAuth
);

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

router.post(
  "/refresh",
  validateBody(schemas.joiRefreshSchema),
  authController.refresh
);

router.post("/signout", isAuthenticated, authController.signOut);

module.exports = router;
