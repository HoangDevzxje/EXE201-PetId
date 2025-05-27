const Reminder = require("../models/Reminder");

// 📌 1. Lấy tất cả reminder của user
const getAllReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id }).populate(
      "petId",
      "name"
    );
    res.status(200).json(reminders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Không thể tải danh sách nhắc nhở", error });
  }
};

// 📌 2. Lấy reminder theo pet
const getRemindersByPet = async (req, res) => {
  try {
    const reminders = await Reminder.find({
      userId: req.user._id,
      petId: req.params.petId,
    });
    res.status(200).json(reminders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Không thể tải reminder theo thú cưng", error });
  }
};

// 📌 3. Tạo mới reminder
const createReminder = async (req, res) => {
  try {
    const newReminder = new Reminder({
      userId: req.user._id,
      petId: req.body.petId,
      title: req.body.title,
      note: req.body.note,
      remindAt: req.body.remindAt,
      emailSent: false,
    });

    const saved = await newReminder.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Không thể tạo reminder", error });
  }
};

// 📌 4. Cập nhật reminder
const updateReminder = async (req, res) => {
  try {
    const updated = await Reminder.findOneAndUpdate(
      { _id: req.params.reminderId, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Reminder không tồn tại" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Không thể cập nhật reminder", error });
  }
};

// 📌 5. Xoá reminder
const deleteReminder = async (req, res) => {
  try {
    const deleted = await Reminder.findOneAndDelete({
      _id: req.params.reminderId,
      userId: req.user._id,
    });
    if (!deleted)
      return res.status(404).json({ message: "Reminder không tồn tại" });
    res.status(200).json({ message: "Đã xoá reminder" });
  } catch (error) {
    res.status(500).json({ message: "Không thể xoá reminder", error });
  }
};

module.exports = {
  getAllReminders,
  getRemindersByPet,
  createReminder,
  updateReminder,
  deleteReminder,
};
