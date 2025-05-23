// Make sure this is at the very top of your server.js file
require("dotenv").config()

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const { seedAdmin } = require("./controllers/auth.controller")

const app = express()

// Debug: Log environment variables (remove in production)
console.log("🔍 Environment Variables Check:")
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Not set")
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Not set")
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ Not set")
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Not set")

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get("/", (req, res) => {
  res.json({ message: "ZYNOTEX Employee Management API" })
})

app.use("/api/v1/auth", require("./routes/auth.routes"))
app.use("/api/v1/user", require("./routes/user.routes"))
app.use("/api/v1/leave", require("./routes/leave.routes"))

const PORT = process.env.PORT || 5000

// Connect to database and start server
connectDB().then(() => {
  seedAdmin()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
