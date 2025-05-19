const router = require("express").Router();
const ReminderController = require("../controllers/ReminderController");
const { checkAuthorize } = require("../middleware/authMiddleware");

router.get("/", checkAuthorize(["user"]), ReminderController.getAllReminders);
router.get(
  "/pet/:petId",
  checkAuthorize(["user"]),
  ReminderController.getRemindersByPet
);
router.post("/", checkAuthorize(["user"]), ReminderController.createReminder);
router.put(
  "/:reminderId",
  checkAuthorize(["user"]),
  ReminderController.updateReminder
);
router.delete(
  "/:reminderId",
  checkAuthorize(["user"]),
  ReminderController.deleteReminder
);

module.exports = router;
