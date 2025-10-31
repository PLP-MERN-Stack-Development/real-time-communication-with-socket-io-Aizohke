
const Message = require("../models/Message");

// Get recent messages
const getRecentMessages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const messages = await Message.find({
      isPrivate: false,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: messages.length,
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch messages",
    });
  }
};

// Get conversation between two users
const getConversation = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const messages = await Message.getConversation(userId1, userId2, limit);

    res.json({
      success: true,
      count: messages.length,
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch conversation",
    });
  }
};

// Search messages
const searchMessages = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.userId;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const messages = await Message.searchMessages(query, userId);

    res.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Search messages error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search messages",
    });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    // Check if user is the sender
    if (message.senderId !== userId) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized to delete this message",
      });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete message",
    });
  }
};

module.exports = {
  getRecentMessages,
  getConversation,
  searchMessages,
  deleteMessage,
};