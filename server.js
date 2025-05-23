const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require("./routes/auth.routes")
const cookieParser = require("cookie-parser")
const leavesRoutes = require("./routes/leave.routes")
const userRoutes = require("./routes/user.routes")
const path = require("path")

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // For form-urlencoded requests
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});


connectDB();
// Example route
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/leave', leavesRoutes);
app.use('/api/v1/user', userRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
