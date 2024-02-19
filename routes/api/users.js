const express = require("express");
const ctrl = require("../../controllers/users");

const { isAuthenticated, upload } = require("../../middlewares");

const router = express.Router();

// router.post(
//   "/avatar",
//   isAuthenticated,
//   upload.single("avatar"),
//  ctrl.updateAvatar
// );


router.get("/current", isAuthenticated, ctrl.getCurrent);

router.patch(
  "/update",
  isAuthenticated,
  upload.single("avatar"),
  ctrl.updateUser
);

module.exports = router;
