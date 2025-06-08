const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

<<<<<<< HEAD
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
=======
// Đặt đơn hàng mới
router.post("/", checkAuthorize(["user"]), OrderController.createOrder);

// Lấy danh sách đơn hàng của user
router.get("/", checkAuthorize(["user"]), OrderController.getOrdersByUser);

// Lấy chi tiết một đơn hàng cụ thể
router.get(
  "/:orderId",
  checkAuthorize(["user"]),
  OrderController.getOrderDetail
);
router.put(
  "/:orderId/status",
  checkAuthorize(["user"]),
  OrderController.updateOrderStatus
);
>>>>>>> backup-code-8-6

module.exports = router;
