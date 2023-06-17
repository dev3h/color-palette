// định nghĩa các routes CRUD cho user
const express = require("express");
const controllers = require("../controllers");
const {
  verifyAccessToken,
  isAdmin,
  isSuperAdmin,
} = require("../middlewares/verify_token");
const uploadCloud = require("../config/cloudinary.config");

const router = express.Router();

router.post("/register", controllers.register);
router.post("/login", controllers.login);
router.get("/current", verifyAccessToken, controllers.getCurrent);
router.post("/refreshtoken", controllers.refreshAccessToken);
router.get("/logout", controllers.logout);
router.get("/forgotpassword", controllers.forgotPassword);
router.put("/resetpassword", controllers.resetPassword);

router.use(verifyAccessToken);
router.get("/", isAdmin, controllers.getUsers);
router.put("/current", uploadCloud.single("avatar"), controllers.updateProfileUser);

router.use(isSuperAdmin);
router.post("/", controllers.createUser);
router.put("/:id", uploadCloud.single("avatar"), controllers.updateUser);
router.delete("/:id", controllers.deleteUser);

module.exports = router;
