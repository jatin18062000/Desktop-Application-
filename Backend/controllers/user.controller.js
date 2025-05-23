const { asyncHandler } = require("../utils/asyncHandler");
const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const getAllUsers = asyncHandler(async (req,res) => {
    const users = await User.find();
    if(!users || users.length === 0){
        throw new ApiError(404,"no users found")
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "users fetched sucessfully"
        )
    )
})

const updateUser = asyncHandler();

module.exports = {
    getAllUsers,
    updateUser
}