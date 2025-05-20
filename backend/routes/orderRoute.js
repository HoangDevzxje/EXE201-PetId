const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/create", async (req, res) => {
  try {
    const { customer, items, total } = req.body;

    const order = new Order({
      customer,
      items,
      total,
    });

    await order.save();

    res.json({ success: true, message: "Đơn hàng đã được lưu" });
  } catch (error) {
    console.error("Lỗi tạo đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

module.exports = router;
