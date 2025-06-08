const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
  try {
    const { name, phone, service, note, clinicId } = req.body;
    if (!name || !phone || !service || !clinicId) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const appointment = await Appointment.create({
      name,
      phone,
      service,
      note,
      clinic: clinicId,
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error("Lỗi khi tạo lịch hẹn:", err);
    res.status(500).json({ message: 'Lỗi server khi tạo lịch hẹn' });
  }
};
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('clinic');
    res.json(appointments);
  } catch (err) {
    console.error('Lỗi lấy lịch hẹn:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy lịch hẹn' });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa lịch hẹn' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa lịch hẹn' });
  }
};
