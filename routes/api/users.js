const express = require("express");
const ctrl = require("../../controllers/users");

const { isAuthenticated, upload } = require("../../middlewares");

const router = express.Router();

router.get("/current", isAuthenticated, ctrl.getCurrent);

router.post(
  "/avatar",
  isAuthenticated,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
