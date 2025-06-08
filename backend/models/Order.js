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
<<<<<<< HEAD
      default: "pending", // hoặc "paid"
=======
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
>>>>>>> backup-code-8-6
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
