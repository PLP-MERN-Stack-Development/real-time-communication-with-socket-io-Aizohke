
const express = require("express");
const router = express.Router();
const { requireAuth, optionalAuth } = require("../middleware/auth");
const {
  getAllUsers,
  getActiveUsers,
  getUserById,
  updateUserProfile,
  getUserStats,
} = require("../controllers/userController");

// Public routes
router.get("/", optionalAuth, getAllUsers);
router.get("/active", getActiveUsers);
router.get("/:userId", getUserById);

// Protected routes
router.put("/:userId", requireAuth, updateUserProfile);
router.get("/:userId/stats", requireAuth, getUserStats);

module.exports = router;