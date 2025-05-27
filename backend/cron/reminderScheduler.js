// reminderScheduler.js
const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const Pet = require("../models/Pet");
const User = require("../models/User");
const sendReminderMail = require("../utils/sendReminderMail");

// Chạy mỗi phút
cron.schedule("*/1 * * * *", async () => {
  console.log("[CRON] Đang kiểm tra các nhắc lịch tiêm...");
  try {
    const now = new Date();
    const reminders = await Reminder.find({
      remindAt: { $lte: now },
      emailSent: false,
    })
      .populate("petId")
      .populate("userId");

    for (const reminder of reminders) {
      const { userId, petId, title, note, remindAt } = reminder;

      if (!userId?.email || !petId?.name) continue;

      await sendReminderMail({
        email: userId.email,
        petName: petId.name,
        title,
        note,
        time: remindAt,
      });

      reminder.emailSent = true;
      await reminder.save();

      console.log(`Đã gửi nhắc cho ${userId.email} về thú cưng ${petId.name}`);
    }
  } catch (err) {
    console.error("[CRON ERROR] Khi gửi reminder:", err);
  }
});
