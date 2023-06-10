import asyncHandler from "express-async-handler";
import { User } from "../models";

const register = asyncHandler(async (req, res) => {
  const { email, password, username, displayname } = req.body;
  if (!email || !password || !username || !displayname) {
    return res.status(400).json({
      success: false,
      mes: "Please fill all the fields",
    });
  }
  const response = await User.create(req.body);
  res.status(200).json({
    success: response ? true : false,
    response,
  });
});

export { register };
