// định nghĩa các routes CRUD cho user
const express = require("express");
const controllers = require("../controllers");
const { verifyAccessToken, isSuperAdmin } = require("../middlewares/verify_token");

const router = express.Router();

router.get("/", controllers.getColorTags);
router.get("/:id", controllers.getColorTag);

router.use(verifyAccessToken);

router.use(isSuperAdmin);
router.post("/", controllers.createColorTag);
router.put("/:id", controllers.updateColorTag);
router.delete("/:id", controllers.deleteColorTag);

module.exports = router;
