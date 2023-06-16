// có thể tạo các file route riêng rồi import vào file route chung này
import user from "./user";
import colorTag from "./color_tag";
import collectionTag from "./collection_tag";
import palette from "./palette";
import { notFound, errHandler } from "../middlewares/errHandler";

const initRoutes = (app) => {
  app.use("/api/v1/user", user);
  app.use("/api/v1/colortag", colorTag);
  app.use("/api/v1/collectiontag", collectionTag);
  app.use("/api/v1/palette", palette);

  app.use(notFound);

  // hứng lỗi từ các middleware trước đó
  app.use(errHandler);
};

export default initRoutes;
