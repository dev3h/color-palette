// định nghĩa các routes CRUD cho user
import express from "express";
import * as controllers from "../controllers";
import { verifyAccessToken, isAdmin, isSuperAdmin } from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyAccessToken);

router.use(isAdmin);
router.get("/", controllers.getColorTags);
router.get("/:id", controllers.getColorTag);

router.use(isSuperAdmin);
router.post("/", controllers.createColorTag);
router.put("/:id", controllers.updateColorTag);
router.delete("/:id", controllers.deleteColorTag);

export default router;
