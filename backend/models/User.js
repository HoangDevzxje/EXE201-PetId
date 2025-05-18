const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, match: /^[0-9]{10,11}$/ },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('User', userSchema);