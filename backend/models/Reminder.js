const mongoose = require("mongoose");
const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    title: String,
    note: String,
    remindAt: Date,
    emailSent: { type: Boolean, default: false }, // Để kiểm soát đã gửi mail hay chưa
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", reminderSchema);
