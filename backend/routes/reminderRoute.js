const router = require("express").Router();
const ReminderController = require("../controllers/ReminderController");
const { checkAuthorize } = require("../middleware/authMiddleware");

// Lấy tất cả nhắc nhở của user
router.get(
  "/",
  checkAuthorize(["user"]),
  ReminderController.getRemindersByUser
);

module.exports = router;
