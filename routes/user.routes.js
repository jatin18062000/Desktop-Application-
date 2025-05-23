const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/auth.middleware");
const { body, validationResult } = require("express-validator");
const { getAllUsers, updateUser, getUserById } = require("../controllers/user.controller");

router.get("/emps", protect, isAdmin, getAllUsers);

router.put(
  "/update-user/:userId",
  [
    protect,
    isAdmin,
    body("name").optional().isString().withMessage("Name must be a string"),
    body("designation").optional().isString(),
    body("dateOfBirth").optional().isISO8601().toDate(),
    body("bloodGroup")
      .optional()
      .isIn(["A+","A-","B+","B-","O+","O-","AB+","AB-"]),
    body("phoneNo").optional().isMobilePhone(),
    body("address").optional().isString(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  updateUser
);

router.get("/single-user/:userId",getUserById)

module.exports = router