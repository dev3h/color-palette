import jwt, { TokenExpiredError } from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const verifyAccessToken = asyncHandler((req, res, next) => {
  const token = req?.headers?.authorization;
  if (token?.startsWith("Bearer")) {
    const accessToken = token.split(" ")[1];

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decode) => {
      if (err) return res.status(401).json({ success: false, mes: err.message });
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({ success: false, mes: "Require authentication!" });
  }
});

const isAdmin = asyncHandler((req, res, next) => {
  const { role } = req.user;
  if (role !== "admin")
    return res.status(401).json({ success: false, mes: "Require admin role!" });
  next();
});

export { verifyAccessToken, isAdmin };
