const express = require("express");
const router = express.Router();
const controller = require("../controllers/PetEmotionLogController");

// Tạo log mới
router.post("/", controller.createLog);

// Lấy log theo tuần
router.get("/:petId", controller.getWeeklyLogs);

// Lấy danh sách các tuần có log
router.get("/:petId/weeks", controller.getWeeksWithLogs);

// Lấy dữ liệu biểu đồ theo tuần
router.get("/:petId/chart", controller.getChartData);

// Lấy log theo tháng
router.get("/:petId/month", controller.getMonthlyLogs);

// Thống kê cảm xúc theo tuần
router.get("/:petId/stats/week", controller.getWeeklyStats);

// Thống kê cảm xúc theo tháng
router.get("/:petId/stats/month", controller.getMonthlyStats);

// Cập nhật ghi chú
router.put("/note/:logId", controller.updateNote);

// Xoá log
router.delete("/:logId", controller.deleteLog);

module.exports = router;
