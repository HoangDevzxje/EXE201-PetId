// Load environment variables
require("dotenv").config();
require("./cron/reminderScheduler"); // hoặc đúng path bạn đặt

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import middlewares
const { checkAuthorize } = require("./middleware/authMiddleware");

// Import routes
const authRoutes = require("./routes/authRoute");
const petRoutes = require("./routes/petRoute");
const reminderRoutes = require("./routes/reminderRoute");
const productRoutes = require("./routes/productRoute");
const categoryRoutes = require("./routes/categoryRoute");
const orderRoutes = require("./routes/orderRoute");

const DB = require("./config/db");
const app = express();
const port = process.env.PORT || 9999;

// ===== Middleware =====
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// ===== Routes =====
app.use("/auth", authRoutes);
app.use("/pets", petRoutes);
app.use("/reminders", reminderRoutes);
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);
app.use("/uploads", express.static("uploads"));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // Database connection
  DB.connectDB();
});
