// định nghĩa các routes CRUD cho user
import * as controllers from "../controllers";
import express from "express";

const router = express.Router();

router.post("/register", controllers.register);

export default router;
