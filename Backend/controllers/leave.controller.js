const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const Leave = require("../models/leave.model");
const { ApiResponse } = require("../utils/ApiResponse");
const { default: mongoose } = require("mongoose");

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
  const allLeavesRaw = await Leave.find().populate("user", "name email");

  if (!allLeavesRaw.length) {
    throw new ApiError(404, "No leaves found");
  }

  const allLeaves = allLeavesRaw.filter((leave) => leave.status !== "pending");
  const pendingLeaves = allLeavesRaw.filter(
    (leave) => leave.status === "pending"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { allLeaves, pendingLeaves },
        "All and pending leaves fetched"
      )
    );
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

const getAllLeaveStats = asyncHandler(async (req, res) => {
  const stats = await Leave.aggregate([
    {
      $group: {
        _id: "$reason",
        count: { $sum: 1 },
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Leave stats of all employees"));
});

const getUserLeaveStats = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const userLeaves = await Leave.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(String(userId)) } },
    {
      $group: {
        _id: "$reason",
        count: { $sum: 1 },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, userLeaves, "leaves by user"));
});

const getSingleLeave = asyncHandler(async (req, res) => {
  const leaveId = req.params.leaveId;

  const leave = await Leave.findById(leaveId)

  if (!leave.length) {
    throw new ApiError(404, "No leave record found for this user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        leave,
        "Leave details for the user fetched successfully"
      )
    );
});

module.exports = {
  createLeave,
  getAllLeaves,
  UpdateLeave,
  getAllLeaveStats,
  getUserLeaveStats,
  getSingleLeave,
};
