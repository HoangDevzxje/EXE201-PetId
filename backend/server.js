// Load environment variables from .env file
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const {checkAuthorize} = require("./middleware/authMiddleware");
const DB = require("./config/db");

const app = express();
const port = process.env.PORT || 9999;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Routes



// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // Database connection
  DB.connectDB();
});
