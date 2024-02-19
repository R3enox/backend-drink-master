const express = require("express");
const ctrl = require("../../controllers/updateUser");

const { isAuthenticated, upload } = require("../../middlewares");

const router = express.Router();

// router.post(
//   "/avatar",
//   isAuthenticated,
//   upload.single("avatar"),
//  ctrl.updateAvatar
// );

router.patch(
  "/update",
  isAuthenticated,
  upload.single("avatar"),
  ctrl.updateUser
);

module.exports = router;
