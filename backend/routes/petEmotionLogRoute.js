const express = require("express");
const router = express.Router();
const controller = require("../controllers/PetEmotionLogController");

router.post("/", controller.createLog);
router.get("/:petId", controller.getWeeklyLogs);
router.get("/:petId/weeks", controller.getWeeksWithLogs);
router.get("/:petId/chart", controller.getChartData);
router.put("/note/:logId", controller.updateNote);
router.delete("/:logId", controller.deleteLog);

module.exports = router;
