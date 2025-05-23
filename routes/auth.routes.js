const express = require("express")
const router = express.Router()
const { protect, isAdmin } = require("../middleware/auth.middleware")
const { body, validationResult } = require("express-validator")
const {
  registerUserByAdmin,
  loginUser,
  verifyAdminLogin,
  sendOtp,
  verifyOtpAndResetPassword,
} = require("../controllers/auth.controller")

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }
  next()
}

// Register user by admin
router.post(
  "/create-user",
  [
    protect,
    isAdmin,
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("designation").optional().isString(),
    body("department")
      .optional()
      .isIn(["Engineering", "Design", "Management", "Human Resources", "Finance", "Marketing", "Sales"]),
    body("bloodGroup").optional().isIn(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
    body("phoneNo").optional().isMobilePhone(),
    body("address").optional().isString(),
    body("dateOfBirth").optional().isISO8601().toDate(),
    validateRequest,
  ],
  registerUserByAdmin,
)

// Login user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validateRequest,
  ],
  loginUser,
)

// Verify admin login with OTP
router.post(
  "/verify",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("code").isLength({ min: 6, max: 6 }).withMessage("Code must be 6 digits"),
    validateRequest,
  ],
  verifyAdminLogin,
)

// Send password reset OTP
router.post("/send-otp", [body("email").isEmail().withMessage("Valid email is required"), validateRequest], sendOtp)

// Verify OTP and reset password
router.post(
  "/verify-otp-email",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
    body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    validateRequest,
  ],
  verifyOtpAndResetPassword,
)

module.exports = router
