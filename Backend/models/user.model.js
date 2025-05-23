const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true
    },
    department: {
      type: String,
      enum: ["Engineering","Design","Management","Human Resources","Finance","Marketing",
        "Sales"
      ],
      required: true
    },
    bloodGroup: {
      type: String,
      enum: ["A+","A-","B+","B-","O+","O-","AB+","AB-"],
      required: true
    },
    phoneNo: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    verificationCode: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    adminLoginCode: {
      type: String,
    },
    adminLoginCodeExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
