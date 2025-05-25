const router = require("express").Router();
const OrderController = require("../controllers/OrderController");
const { checkAuthorize } = require("../middleware/authMiddleware");

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

module.exports = router;
