// có thể tạo các file route riêng rồi import vào file route chung này
const user = require("./user");
const colorTag = require("./color_tag");
const collectionTag = require("./collection_tag");
const palette = require("./palette");
const insert = require("./insert");
const { notFound, errHandler } = require("../middlewares/errHandler");

const initRoutes = (app) => {
  app.use("/api/v1/user", user);
  app.use("/api/v1/colortag", colorTag);
  app.use("/api/v1/collectiontag", collectionTag);
  app.use("/api/v1/palette", palette);
  app.use("/api/v1/insert", insert);

  app.use(notFound);

  // hứng lỗi từ các middleware trước đó
  app.use(errHandler);
};

module.exports = initRoutes;
