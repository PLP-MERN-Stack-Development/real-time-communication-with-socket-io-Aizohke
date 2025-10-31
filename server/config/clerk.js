
const { Clerk } = require("@clerk/clerk-sdk-node");

const clerkClient = Clerk({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const verifyClerkWebhook = (req) => {
  const { Webhook } = require("svix");

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set");
  }

  const payload = JSON.stringify(req.body);
  const headers = {
    "svix-id": req.headers["svix-id"],
    "svix-timestamp": req.headers["svix-timestamp"],
    "svix-signature": req.headers["svix-signature"],
  };

  const wh = new Webhook(webhookSecret);

  try {
    return wh.verify(payload, headers);
  } catch (error) {
    console.error("Webhook verification failed:", error);
    throw error;
  }
};

module.exports = {
  clerkClient,
  verifyClerkWebhook,
};