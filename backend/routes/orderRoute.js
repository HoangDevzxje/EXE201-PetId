const router = require("express").Router();
const OrderController = require("../controllers/OrderController");
const { checkAuthorize } = require("../middleware/authMiddleware");

// Lấy danh sách đơn hàng của user
router.get("/", checkAuthorize(["user"]), OrderController.getOrdersByUser);

// Lấy chi tiết một đơn hàng cụ thể
router.get(
  "/:orderId",
  checkAuthorize(["user"]),
  OrderController.getOrderDetail
);

module.exports = router;
