/**
 * API Documentation
 *
 * This file documents all available API endpoints in the application.
 * Each endpoint includes the URL, HTTP method, required parameters,
 * authentication requirements, and a brief description.
 */

// Base URL
const BASE_URL = "http://localhost:5000/api/v1"

/**
 * Authentication APIs
 */

// Login User
// POST http://localhost:5000/api/v1/auth/login
// Required: email, password
// Returns: For regular users - user data and token
//          For admin users - sends OTP to email and requires verification
const LOGIN_API = `${BASE_URL}/auth/login`

// Verify Admin Login with OTP
// POST http://localhost:5000/api/v1/auth/verify
// Required: email, code (6-digit OTP)
// Returns: Admin user data and token
const VERIFY_ADMIN_API = `${BASE_URL}/auth/verify`

// Create User (Admin only)
// POST http://localhost:5000/api/v1/auth/create-user
// Required: name, email, password
// Optional: designation, department, bloodGroup, phoneNo, address, dateOfBirth, role
// Headers: Authorization: Bearer {admin_token}
// Returns: Created user data
const CREATE_USER_API = `${BASE_URL}/auth/create-user`

// Send Password Reset OTP
// POST http://localhost:5000/api/v1/auth/send-otp
// Required: email
// Returns: Success message
const SEND_OTP_API = `${BASE_URL}/auth/send-otp`

// Verify OTP and Reset Password
// POST http://localhost:5000/api/v1/auth/verify-otp-email
// Required: email, otp, newPassword
// Returns: Success message
const VERIFY_OTP_RESET_PASSWORD_API = `${BASE_URL}/auth/verify-otp-email`

/**
 * User/Employee APIs
 */

// Get All Users (Admin only)
// GET http://localhost:5000/api/v1/users
// Headers: Authorization: Bearer {admin_token}
// Returns: List of all users
const GET_ALL_USERS_API = `${BASE_URL}/users`

// Get User by ID
// GET http://localhost:5000/api/v1/users/:userId
// Headers: Authorization: Bearer {token}
// Returns: User data
const GET_USER_BY_ID_API = `${BASE_URL}/users/:userId`

// Update User
// PUT http://localhost:5000/api/v1/users/:userId
// Required: Any user fields to update (except email)
// Headers: Authorization: Bearer {token}
// Returns: Updated user data
const UPDATE_USER_API = `${BASE_URL}/users/:userId`

// Delete User (Admin only)
// DELETE http://localhost:5000/api/v1/users/:userId
// Headers: Authorization: Bearer {admin_token}
// Returns: Success message
const DELETE_USER_API = `${BASE_URL}/users/:userId`

// Upload User Profile Image
// POST http://localhost:5000/api/v1/users/upload-profile/:userId
// Required: image file (multipart/form-data)
// Headers: Authorization: Bearer {token}
// Returns: Updated user with image URL
const UPLOAD_PROFILE_IMAGE_API = `${BASE_URL}/users/upload-profile/:userId`

/**
 * Leave Management APIs
 */

// Apply for Leave
// POST http://localhost:5000/api/v1/leave/apply-leave
// Required: startDate, endDate, reason
// Optional: additionalDetails
// Headers: Authorization: Bearer {token}
// Returns: Created leave application
const APPLY_LEAVE_API = `${BASE_URL}/leave/apply-leave`

// Get All Leaves (Admin only)
// GET http://localhost:5000/api/v1/leave/getAllLeaves
// Headers: Authorization: Bearer {admin_token}
// Returns: All leaves and pending leaves
const GET_ALL_LEAVES_API = `${BASE_URL}/leave/getAllLeaves`

// Update Leave Status (Admin only)
// PUT http://localhost:5000/api/v1/leave/update-leave/:userId
// Required: status (approved/rejected)
// Headers: Authorization: Bearer {admin_token}
// Returns: Updated leave
const UPDATE_LEAVE_API = `${BASE_URL}/leave/update-leave/:userId`

// Get Leave Statistics (Admin only)
// GET http://localhost:5000/api/v1/leave/leave-stats
// Headers: Authorization: Bearer {admin_token}
// Returns: Leave statistics grouped by reason
const GET_LEAVE_STATS_API = `${BASE_URL}/leave/leave-stats`

// Get User Leave Statistics (Admin only)
// GET http://localhost:5000/api/v1/leave/user-leave-stats/:userId
// Headers: Authorization: Bearer {admin_token}
// Returns: Leave statistics for specific user
const GET_USER_LEAVE_STATS_API = `${BASE_URL}/leave/user-leave-stats/:userId`

// Get Single Leave
// GET http://localhost:5000/api/v1/leave/:leaveId
// Headers: Authorization: Bearer {token}
// Returns: Leave details
const GET_SINGLE_LEAVE_API = `${BASE_URL}/leave/:leaveId`

module.exports = {
  // Auth APIs
  LOGIN_API,
  VERIFY_ADMIN_API,
  CREATE_USER_API,
  SEND_OTP_API,
  VERIFY_OTP_RESET_PASSWORD_API,

  // User APIs
  GET_ALL_USERS_API,
  GET_USER_BY_ID_API,
  UPDATE_USER_API,
  DELETE_USER_API,
  UPLOAD_PROFILE_IMAGE_API,

  // Leave APIs
  APPLY_LEAVE_API,
  GET_ALL_LEAVES_API,
  UPDATE_LEAVE_API,
  GET_LEAVE_STATS_API,
  GET_USER_LEAVE_STATS_API,
  GET_SINGLE_LEAVE_API,
}
