// định nghĩa các routes CRUD cho user
import express from "express";
import * as controllers from "../controllers";
import { verifyAccessToken, isAdmin } from "../middlewares/verify_token";

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
router.put("/current", controllers.updateProfileUser);
router.put("/:id", isAdmin, controllers.updateUser);
router.delete("/:id", isAdmin, controllers.deleteUser);

export default router;
