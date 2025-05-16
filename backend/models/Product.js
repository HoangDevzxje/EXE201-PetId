const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    imageUrl: String,
    isActive: { type: Boolean, default: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
