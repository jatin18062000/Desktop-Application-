const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: false
    },
    dateOfBirth: {
      type: Date,
      required: false
    },
    department: {
      type: String,
      enum: ["Engineering","Design","Management","Human Resources","Finance","Marketing",
        "Sales"
      ],
      required: false
    },
    bloodGroup: {
      type: String,
      enum: ["A+","A-","B+","B-","O+","O-","AB+","AB-"],
      required: false
    },
    phoneNo: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: false
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
