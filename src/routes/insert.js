// định nghĩa các routes CRUD cho user
const express = require("express");
const controllers = require("../controllers");
const { verifyAccessToken, isSuperAdmin } = require("../middlewares/verify_token");

const router = express.Router();

router.use(verifyAccessToken);

router.use(isSuperAdmin);
router.post("/user", controllers.insertUser);
router.post("/colortag", controllers.insertColorTag);
router.post("/collectiontag", controllers.insertCollectionTag);

module.exports = router;
