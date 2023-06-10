// notFound là một hàm trả về lỗi 404
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errHandler = (err, req, res, next) => {
  // nếu status code là 200 thì set status code là 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    success: false,
    mes: err?.message,
  });
};

export { notFound, errHandler };
