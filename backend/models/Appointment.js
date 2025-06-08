const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  note: String,
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
