const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const sendEmail = require("../utils/emailService");
const crypto = require("crypto");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// Register User
const registerUserByAdmin = asyncHandler(async (req, res) => {
  const {
    name,
    designation,
    department,
    bloodGroup,
    phoneNo,
    address,
    email,
    password,
    dateOfBirth,
    role = "user",
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    designation,
    department,
    bloodGroup,
    phoneNo,
    address,
    email,
    dateOfBirth,
    password: hashedPassword,
    role,
  });

  // const token = generateToken(user);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "User created by admin"
    )
  );
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  console.log("user", user);

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  if (user.role === "admin") {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit

    user.adminLoginCode = code;
    user.adminLoginCodeExpires = Date.now() + 10 * 60 * 1000; // valid for 10 mins
    await user.save();

    await sendEmail(user.email, "Your Admin Login Code", `Code: ${code}`);

    return res.status(200).json(
      new ApiResponse(200, {
        message: "Verification code sent to admin email",
      })
    );
  }

  const token = generateToken(user);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      "Login successful"
    )
  );
});

const verifyAdminLogin = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.role !== "admin") throw new ApiError(401, "Invalid admin");

  if (
    !user.adminLoginCode ||
    user.adminLoginCode !== code ||
    user.adminLoginCodeExpires < Date.now()
  ) {
    throw new ApiError(400, "Invalid or expired verification code");
  }

  // Clear the code after successful verification
  user.adminLoginCode = undefined;
  user.adminLoginCodeExpires = undefined;
  await user.save();

  const token = generateToken(user);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      "Admin login verified successfully"
    )
  );
});

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  user.resetOtp = hashedOtp;
  user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  // Send OTP via email/SMS
  await sendEmail({
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`,
  });

  res.status(200).json(new ApiResponse(200, null, "OTP sent to email"));
});

const verifyOtpAndResetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.resetOtp || !user.resetOtpExpires)
    throw new ApiError(400, "Invalid request");

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  if (user.resetOtp !== hashedOtp || user.resetOtpExpires < Date.now()) {
    throw new ApiError(400, "OTP is invalid or expired");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOtp = undefined;
  user.resetOtpExpires = undefined;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Password reset successful"));
});

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      email: "jatinjaiswal47@gmail.com",
    });
    if (existingAdmin) {
      console.log("🔹 Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      name: "Admin",
      email: "jatinjaiswal47@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Default admin created:", admin.email);
  } catch (err) {
    console.error("❌ Failed to seed admin:", err);
  }
};

module.exports = {
  registerUserByAdmin,
  loginUser,
  seedAdmin,
  verifyAdminLogin,
  sendOtp,
  verifyOtpAndResetPassword
};
