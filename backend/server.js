require("dotenv").config();
require("./cron/reminderScheduler");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { checkAuthorize } = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoute");
const petRoutes = require("./routes/petRoute");
const reminderRoutes = require("./routes/reminderRoute");
const productRoutes = require("./routes/productRoute");
const categoryRoutes = require("./routes/categoryRoute");
const chatbotRoutes = require("./routes/chatbotRoute");
const orderRoutes = require("./routes/orderRoute");
const adminRoutes = require("./routes/adminRoute");
const clinicRoutes = require("./routes/clinicRoute");
const userRoutes = require("./routes/userRoute");
const appointmentRoutes = require("./routes/appointmentRoute");
const blogRoutes = require("./routes/blogRoute");

const DB = require("./config/db");
const app = express();
const port = process.env.PORT || 9999;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/pets", petRoutes);
app.use("/reminders", reminderRoutes);


app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/clinics", clinicRoutes);
app.use("/users", userRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/blogs", blogRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  DB.connectDB();
});
