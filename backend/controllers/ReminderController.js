const Reminder = require("../models/Reminder");

const getRemindersByUser = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id }).populate(
      "pet",
      "name"
    );
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getRemindersByUser,
};
