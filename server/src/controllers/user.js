import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { generateAccessToken, generateRefreshToken } from "../middlewares/jwt";

const register = asyncHandler(async (req, res) => {
  const { email, password, username, displayname } = req.body;
  if (!email || !password || !username || !displayname) {
    return res.status(400).json({
      success: false,
      mes: "Please fill all the fields",
    });
  }
  const user = await User.findOne({ email });
  if (user) throw new Error("User already exists");
  else {
    const newUser = await User.create(req.body);
    res.status(200).json({
      success: newUser ? true : false,
      mes: newUser ? "Register successfully" : "Register failed",
      response,
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      mes: "Please fill all the fields",
    });
  }
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    const { password, role, ...userData } = response.toObject();
    const accessToken = generateAccessToken(userData._id, role);
    const refreshToken = generateRefreshToken(userData._id);

    // lưu refreshToken vào db
    await User.findByIdAndUpdate(userData._id, { refreshToken });

    // lưu refreshToken vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // path: "/api/v1/user/refresh_token",
    });

    return res.status(200).json({
      success: true,
      accessToken: accessToken ? `Bearer ${accessToken}` : null,
      userData,
    });
  } else {
    throw new Error("invalid credentials");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-password -refreshToken -role");
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "User not found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie && !cookie.refreshToken) throw new Error("No refresh token in cookie");

  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token not matched",
  });
});

// đây là logout ở server, ta sẽ xóa cookie. Có thể logout ở client bằng việc xóa accessToken
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie || !cookie.refreshToken) throw new Error("No refresh token in cookie");

  // xóa refreshToken trong db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );

  // xóa refreshToken trong cookie trình duyệt
  res.clearCookie("refreshToken", "", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: "Logout successfully",
  });
});

export { register, login, getCurrent, refreshAccessToken, logout };
