const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    species: { type: String, enum: ["dog", "cat", "other"], required: true },
    breed: String,
    gender: { type: String, enum: ["male", "female", "unknown"] },
    birthDate: Date,
    weightKg: Number,
    avatarUrl: String,
    notes: String,
    medicalHistory: [
      {
        date: Date,
        description: String,
        vet: String,
      },
    ],
    vaccinationRecords: [
      {
        vaccineName: String,
        date: Date,
        nextDoseDue: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema);
