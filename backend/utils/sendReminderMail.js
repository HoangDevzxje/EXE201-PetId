const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const templatePath = path.join(process.cwd(), "utils", "reminderTemplate.html");
const template = fs.readFileSync(templatePath, "utf8");

const sendReminderMail = async ({ email, petName, title, note, time }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailHtml = template
      .replace("{{PET_NAME}}", petName)
      .replace("{{TITLE}}", title)
      .replace("{{NOTE}}", note || "Không có ghi chú")
      .replace("{{TIME}}", new Date(time).toLocaleString("vi-VN"));

    await transporter.sendMail({
      from: `"SIXMIX PETID" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "📬 Nhắc lịch tiêm phòng thú cưng",
      html: emailHtml,
    });
  } catch (err) {
    console.error("Gửi mail reminder thất bại:", err);
  }
};

module.exports = sendReminderMail;
