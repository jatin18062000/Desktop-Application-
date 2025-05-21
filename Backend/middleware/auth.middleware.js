const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1]; // <- this is what should be decoded

  if (!token) throw new ApiError(401, "Not authorized, no token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch {
    throw new ApiError(401, "Invalid token");
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Access denied, Admins only");
  }
  next();
};

module.exports = { protect, isAdmin };
