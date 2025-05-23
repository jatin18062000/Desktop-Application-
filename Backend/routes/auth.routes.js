const express = require("express");
const {
  registerUser,
  loginUser,
  registerUserByAdmin,
  verifyAdminLogin,
  sendOtp,
  verifyOtpAndResetPassword,
} = require("../controllers/auth.controller");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { protect, isAdmin } = require("../middleware/auth.middleware");

router.post(
  "/create-user",
  [
    protect,
    isAdmin,
    body("name").notEmpty().withMessage("Name is required"),
    body("designation").notEmpty().withMessage("Designation is required"),
    body("department")
      .isIn([
        "Engineering",
        "Design",
        "Management",
        "Human Resources",
        "Finance",
        "Marketing",
        "Sales",
      ])
      .withMessage("Invalid department"),
    body("bloodGroup")
      .isIn(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
      .withMessage("Invalid blood group"),
    body("phoneNo").notEmpty().withMessage("Phone number is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role")
      .optional()
      .isIn(["user", "admin"])
      .withMessage("Role must be user or admin"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    registerUserByAdmin(req, res, next);
  }
);

router.post("/login", loginUser);

router.post("/verify", verifyAdminLogin);

router.post(
  "/send-otp",
  [
    body("email").isEmail().withMessage("Valid email is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    sendOtp(req, res, next);
  }
);

router.post(
  "/verify-otp-email",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("otp").notEmpty().withMessage("OTP is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    verifyOtpAndResetPassword(req, res, next);
  }
);

module.exports = router;
