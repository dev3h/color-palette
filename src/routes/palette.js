// định nghĩa các routes CRUD cho user
const express = require("express");
const controllers = require("../controllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verify_token");

const router = express.Router();

router.use(verifyAccessToken);
router.use(isAdmin);

router.post("/", controllers.createPalette);
router.get("/", controllers.getPalettes);
router.get("/:id", controllers.getPalette);
router.put("/:id", controllers.updatePalette);
router.put("/like/:pid", controllers.toggleLiked);
router.delete("/:id", controllers.deletePalette);

module.exports = router;
