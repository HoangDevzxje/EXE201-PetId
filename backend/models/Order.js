const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: String,
      phone: String,
      address: String,
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: Number,
    status: {
      type: String,
      default: "pending", // hoặc "paid"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
