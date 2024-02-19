const express = require("express");
const ctrl = require("../../controllers/updateAvatar");

const { isAuthenticated, upload } = require("../../middlewares");

const router = express.Router();

router.post(
  "/avatar",
  isAuthenticated,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
