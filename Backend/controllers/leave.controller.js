const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const Leave = require("../models/leave.model");
const { ApiResponse } = require("../utils/ApiResponse");

const createLeave = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate, reason, additionalDetails } = req.body;

  if (new Date(startDate) < Date.now()) {
    throw new ApiError(400, "Please pick a correct start date");
  }

  const leaveApplication = new Leave({
    user: userId,
    startDate,
    endDate,
    reason,
    additionalDetails,
  });

  await leaveApplication.save();

  return res
    .status(201)
    .json(new ApiResponse(201, leaveApplication, "Leave applied successfully"));
});

const getAllLeaves = asyncHandler(async (req, res) => {
  const leaves = await Leave.find();
  if (leaves.length === 0) {
    throw new ApiError(404, "No leaves found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, leaves, "leaves got successfylly"));
});

const UpdateLeave = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const userId = req.params.userId;
  if (!["approved", "rejected"].includes(status) || !userId) {
    throw new ApiError(400, "pls use appropriate leave or user is not found");
  }
  const leave = await Leave.findOne({ user: userId });
  leave.status = status;

  await leave.save();

  return res
    .status(200)
    .json(new ApiResponse(200, leave, "leave updated successfully"));
});

module.exports = {
  createLeave,
  getAllLeaves,
  UpdateLeave,
};
