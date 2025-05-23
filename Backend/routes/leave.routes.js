const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/auth.middleware");
const {
  createLeave,
  getAllLeaves,
  UpdateLeave,
} = require("../controllers/leave.controller");
const { body, validationResult } = require("express-validator");

router.post(
  "/apply-leave",
  [
    protect,
    body("startDate").notEmpty().withMessage("Start date is required"),
    body("endDate").notEmpty().withMessage("End date is required"),
    body("reason").notEmpty().withMessage("reason is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    createLeave(req, res, next);
  }
);

router.get("/getAllLeaves", getAllLeaves);

router.put("/update-leave/:userId", protect, isAdmin, UpdateLeave);

module.exports = router;
