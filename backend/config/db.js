const mongoose = require("mongoose");
const User = require("../models/User");
const Order = require("../models/Order");
const Category = require("../models/Category");
const NotificationLog = require("../models/NotificationLog");
const Pet = require("../models/Pet");
const Product = require("../models/Product");
const DB = {};
DB.user = User;
DB.order = Order;
DB.category = Category;
DB.notificationLog = NotificationLog;
DB.pet = Pet;
DB.product = Product;


DB.connectDB = async () => {
  try {
    // Thử kết nối với MongoDB Atlas trước
    await mongoose.connect(process.env.DB_CONNECTION_CLOUD, {
      dbName: process.env.DB_NAME,
    });
    console.log("✅ Connected to the cloud database (MongoDB Atlas)");
  } catch (err) {
    console.error("❌ Cloud database connection failed. Trying local...");

    try {
      // Nếu thất bại, thử kết nối với MongoDB local
      await mongoose.connect(process.env.DB_CONNECTION_LOCAL, {
        dbName: process.env.DB_NAME,
      });
      console.log("✅ Connected to the local database (MongoDB)");
    } catch (localErr) {
      console.error("❌ Could not connect to any database", localErr);
      process.exit(1); // Dừng chương trình nếu không thể kết nối với bất kỳ DB nào
    }
  }
};

module.exports = DB;