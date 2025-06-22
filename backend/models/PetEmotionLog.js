const mongoose = require("mongoose");

const petEmotionLogSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    date: { type: Date, default: Date.now },
    state: {
      type: String,
      required: true,
    },
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PetEmotionLog", petEmotionLogSchema);
