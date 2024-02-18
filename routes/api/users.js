const express = require("express");
const router = express.Router();

const authController = require("../../controllers/authController");

const { isAuthenticated, upload } = require("../../middlewares");

router.patch(
  "/avatar",
  isAuthenticated,
  upload.single("avatar"),
  authController.updateAvatar
  
);

module.exports = router;
