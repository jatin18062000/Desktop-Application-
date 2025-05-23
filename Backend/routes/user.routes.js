const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/auth.middleware");
const { body, validationResult } = require("express-validator");
const { getAllUsers } = require("../controllers/user.controller");

router.get("/emps", protect, isAdmin, getAllUsers);

module.exports = router