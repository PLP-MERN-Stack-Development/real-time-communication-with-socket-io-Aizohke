
const express = require("express");
const router = express.Router();
const { webhookLimiter } = require("../middleware/rateLimiter");
const { handleClerkWebhook } = require("../controllers/webhookController");

// Clerk webhook endpoint
router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  webhookLimiter,
  handleClerkWebhook
);

module.exports = router;