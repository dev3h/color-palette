// định nghĩa các routes CRUD cho user
import express from "express";
import * as controllers from "../controllers";
import { verifyAccessToken, isAdmin } from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyAccessToken);
router.use(isAdmin);

router.post("/", controllers.createPalette);
router.get("/", controllers.getPalettes);
router.get("/:id", controllers.getPalette);
router.put("/:id", controllers.updatePalette);
router.put("/like/:pid", controllers.toggleLiked);
router.delete("/:id", controllers.deletePalette);

export default router;
