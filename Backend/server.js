const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require("./routes/auth.routes")
const cookieParser = require("cookie-parser")
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
