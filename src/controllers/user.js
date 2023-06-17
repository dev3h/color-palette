const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;

const { User } = require("../models");
const { generateAccessToken, generateRefreshToken } = require("../middlewares/jwt");
const sendMail = require("../utils/sendMail");

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
    const { password, role, refreshToken, ...userData } = response.toObject();
    const accessToken = generateAccessToken(userData._id, role);
    const newRefreshToken = generateRefreshToken(userData._id);

    // lưu refreshToken vào db
    await User.findByIdAndUpdate(userData._id, { newRefreshToken });

    // lưu refreshToken vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // path: "/api/v1/user/refresh_token",
    });

    return res.status(200).json({
      success: true,
      accessToken: accessToken ? accessToken : null,
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

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Please provide email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangeToken();
  await user.save();

  const html = `Vui lòng click vào link để đổi mật khẩu. Link này hết hạn sau 15p: <a href=${process.env.URL_SERVER}/api/user/resetpassword/${resetToken}>Click here</a>`;

  const data = {
    email,
    html,
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: true,
    rs,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) throw new Error("Please provide token and password");

  const passwordChangeToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log(passwordChangeToken);
  const user = await User.findOne({
    passwordResetToken: passwordChangeToken,
    passwordResetExpires: { $gt: Date.now() }, // passwordResetExpires > Date.now()
  });
  if (!user) throw new Error("Invalid reset token");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();

  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Update password successfully" : "Update password failed",
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select("-password -refreshToken -role");
  return res.status(200).json({
    success: response ? true : false,
    users: response ? response : "User not found",
  });
});

const createUser = asyncHandler(async (req, res) => {
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
      mes: newUser ? "create user successfully" : "create user failed",
    });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let bodyToUpdate = req.body || {};

  if (!id) throw new Error("missing input");
  const fileData = req?.file;

  const oldAvatar = await User.findById(id).select("avatar");

  if (fileData) {
    const { path, filename } = fileData;
    if (!bodyToUpdate["avatar"]) bodyToUpdate["avatar"] = {}; // Kiểm tra nếu chưa có object avatar trong bodyToUpdate
    bodyToUpdate["avatar"]["path"] = path;
    bodyToUpdate["avatar"]["filename"] = filename;
  }

  const response = await User.findByIdAndUpdate(id, bodyToUpdate, { new: true }).select(
    "-password -refreshToken -role"
  );
  if (response && fileData && oldAvatar)
    await cloudinary.uploader.destroy(oldAvatar.avatar.filename);

  return res.status(200).json({
    success: response ? true : false,
    updateUser: response ? response : "Update user failed",
  });
});

const updateProfileUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id) throw new Error("missing input");
  let bodyToUpdate = req.body || {};

  const fileData = req?.file;

  const oldAvatar = await User.findById(id).select("avatar");

  if (fileData) {
    const { path, filename } = fileData;
    if (!bodyToUpdate["avatar"]) bodyToUpdate["avatar"] = {}; // Kiểm tra nếu chưa có object avatar trong bodyToUpdate
    bodyToUpdate["avatar"]["path"] = path;
    bodyToUpdate["avatar"]["filename"] = filename;
  }
  const response = await User.findByIdAndUpdate(_id, bodyToUpdate, { new: true }).select(
    "-password -refreshToken -role"
  );
  if (response && fileData && oldAvatar)
    await cloudinary.uploader.destroy(oldAvatar.avatar.filename);

  return res.status(200).json({
    success: response ? true : false,
    updateUser: response ? response : "Update profile failed",
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("missing input");
  const response = await User.findByIdAndDelete(id);
  return res.status(200).json({
    success: response ? true : false,
    deletedUser: response
      ? `User with email ${response.email} deleted`
      : "Delete user failed",
  });
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  createUser,
  updateProfileUser,
  updateUser,
  deleteUser,
};
