const express = require("express");
const router = express.Router();
const {
  handleChatMessage,
  getUserPets,
  analyzeHealth,
} = require("../controllers/ChatBotController");

router.post("/message", handleChatMessage);
router.get("/user-pets/:userId", getUserPets);
router.post("/health-analysis", analyzeHealth);

module.exports = router;
