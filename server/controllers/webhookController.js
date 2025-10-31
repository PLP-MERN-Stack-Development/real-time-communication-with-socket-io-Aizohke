
const User = require("../models/User");
const { verifyClerkWebhook } = require("../config/clerk");

// Handle Clerk webhooks
const handleClerkWebhook = async (req, res) => {
  try {
    // Verify webhook signature
    const evt = verifyClerkWebhook(req);

    const { type, data } = evt;

    switch (type) {
      case "user.created":
        await handleUserCreated(data);
        break;

      case "user.updated":
        await handleUserUpdated(data);
        break;

      case "user.deleted":
        await handleUserDeleted(data);
        break;

      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    res.json({ success: true, received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({
      success: false,
      error: "Webhook processing failed",
    });
  }
};

// Handler for user.created event
const handleUserCreated = async (data) => {
  try {
    const user = await User.create({
      clerkId: data.id,
      email: data.email_addresses[0]?.email_address,
      username:
        data.username ||
        data.first_name ||
        data.email_addresses[0]?.email_address.split("@")[0],
      firstName: data.first_name,
      lastName: data.last_name,
      avatar: data.image_url,
      status: "offline",
    });

    console.log("✅ User created in MongoDB:", user.username);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Handler for user.updated event
const handleUserUpdated = async (data) => {
  try {
    const user = await User.findOneAndUpdate(
      { clerkId: data.id },
      {
        $set: {
          email: data.email_addresses[0]?.email_address,
          username: data.username || data.first_name,
          firstName: data.first_name,
          lastName: data.last_name,
          avatar: data.image_url,
        },
      },
      { new: true }
    );

    console.log("✅ User updated in MongoDB:", user?.username);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Handler for user.deleted event
const handleUserDeleted = async (data) => {
  try {
    await User.findOneAndDelete({ clerkId: data.id });
    console.log("✅ User deleted from MongoDB:", data.id);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

module.exports = {
  handleClerkWebhook,
};