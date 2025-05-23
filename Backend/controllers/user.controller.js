const { asyncHandler } = require("../utils/asyncHandler");
const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "user" });
  if (!users || users.length === 0) {
    throw new ApiError(404, "no users found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, users, "users fetched sucessfully"));
});

const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const updatedData = req.body; 

  const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});


const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "no user found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "single user fetched"));
});

module.exports = {
  getAllUsers,
  updateUser,
  getUserById
};
