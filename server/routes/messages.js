
const express = require("express");
const router = express.Router();
const { requireAuth, optionalAuth } = require("../middleware/auth");
const {
  getRecentMessages,
  getConversation,
  searchMessages,
  deleteMessage,
} = require("../controllers/messageController");

// Public routes
router.get("/recent", getRecentMessages);

// Protected routes
router.get("/conversation/:userId1/:userId2", requireAuth, getConversation);
router.get("/search", requireAuth, searchMessages);
router.delete("/:messageId", requireAuth, deleteMessage);

module.exports = router;