const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalAmount: Number,
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled"],
      default: "pending",
    },
    shippingAddress: String,
    contactPhone: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", orderSchema);
