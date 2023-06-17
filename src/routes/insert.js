// định nghĩa các routes CRUD cho user
import express from "express";
import * as controllers from "../controllers";
import { verifyAccessToken, isSuperAdmin } from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyAccessToken);

router.use(isSuperAdmin);
router.post("/user", controllers.insertUser);
router.post("/colortag", controllers.insertColorTag);
router.post("/collectiontag", controllers.insertCollectionTag);

export default router;
