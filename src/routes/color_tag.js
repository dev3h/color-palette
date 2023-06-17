// định nghĩa các routes CRUD cho user
const express = require("express");
const controllers = require("../controllers");
const {
  verifyAccessToken,
  isAdmin,
  isSuperAdmin,
} = require("../middlewares/verify_token");

const router = express.Router();

router.use(verifyAccessToken);

router.use(isAdmin);
router.get("/", controllers.getColorTags);
router.get("/:id", controllers.getColorTag);

router.use(isSuperAdmin);
router.post("/", controllers.createColorTag);
router.put("/:id", controllers.updateColorTag);
router.delete("/:id", controllers.deleteColorTag);

module.exports = router;
