// định nghĩa các routes CRUD cho user
import express from "express";
import * as controllers from "../controllers";
import { verifyAccessToken, isAdmin, isSuperAdmin } from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyAccessToken);

router.use(isAdmin);
router.get("/", controllers.getCollectionTags);
router.get("/:id", controllers.getCollectionTag);

router.use(isSuperAdmin);
router.post("/", controllers.createCollectionTag);
router.put("/:id", controllers.updateCollectionTag);
router.delete("/:id", controllers.deleteCollectionTag);

export default router;
