const express = require("express");
const { registerUser, loginUser, registerUserByAdmin, verifyAdminLogin } = require("../controllers/auth.controller");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { protect, isAdmin } = require("../middleware/auth.middleware");

router.post(
  "/create-user",
  [
    protect,
    isAdmin,
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Email is required").normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
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

router.post("/verify", verifyAdminLogin)

module.exports = router;
