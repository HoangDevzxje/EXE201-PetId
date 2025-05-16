const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
  content: String,
  sentAt: Date,
  channel: { type: String, enum: ["email", "push"] },
});

const NotificationLog = mongoose.model("NotificationLog", notificationSchema);
module.exports = NotificationLog;