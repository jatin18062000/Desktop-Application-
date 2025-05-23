const jwt = require("jsonwebtoken")
const User = require("../models/user.model")
const { ApiError } = require("../utils/ApiError")
const { asyncHandler } = require("../utils/asyncHandler")

const protect = asyncHandler(async (req, res, next) => {
  let token

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password")

      if (!req.user) {
        throw new ApiError(401, "User not found")
      }

      next()
    } catch (error) {
      console.error("Token verification failed:", error)
      throw new ApiError(401, "Not authorized, token failed")
    }
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, no token")
  }
})

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    throw new ApiError(403, "Access denied. Admin role required.")
  }
})

module.exports = { protect, isAdmin }
