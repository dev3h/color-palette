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
router.get("/", controllers.getCollectionTags);
router.get("/:id", controllers.getCollectionTag);

router.use(isSuperAdmin);
router.post("/", controllers.createCollectionTag);
router.put("/:id", controllers.updateCollectionTag);
router.delete("/:id", controllers.deleteCollectionTag);

module.exports = router;
