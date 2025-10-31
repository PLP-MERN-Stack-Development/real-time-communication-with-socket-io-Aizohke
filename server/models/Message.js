
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
      index: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    messageType: {
      type: String,
      enum: ["text", "file", "image", "system"],
      default: "text",
    },
    isPrivate: {
      type: Boolean,
      default: false,
      index: true,
    },
    recipientId: {
      type: String,
      index: true,
    },
    recipientName: {
      type: String,
    },
    roomName: {
      type: String,
      index: true,
    },
    file: {
      name: String,
      type: String,
      size: Number,
      data: String,
    },
    reactions: [
      {
        userId: String,
        username: String,
        emoji: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      delivered: {
        type: Boolean,
        default: false,
      },
      read: {
        type: Boolean,
        default: false,
      },
      readAt: Date,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
messageSchema.index({ createdAt: -1 });
messageSchema.index({ senderId: 1, recipientId: 1 });
messageSchema.index({ roomName: 1, createdAt: -1 });
messageSchema.index({ isPrivate: 1, createdAt: -1 });

// Method to add reaction
messageSchema.methods.addReaction = function (userId, username, emoji) {
  // Check if user already reacted with this emoji
  const existingReaction = this.reactions.find(
    (r) => r.userId === userId && r.emoji === emoji
  );

  if (!existingReaction) {
    this.reactions.push({ userId, username, emoji });
  }

  return this.save();
};

// Method to remove reaction
messageSchema.methods.removeReaction = function (userId, emoji) {
  this.reactions = this.reactions.filter(
    (r) => !(r.userId === userId && r.emoji === emoji)
  );
  return this.save();
};

// Method to mark as read
messageSchema.methods.markAsRead = function () {
  this.status.read = true;
  this.status.readAt = new Date();
  return this.save();
};

// Static method to get conversation
messageSchema.statics.getConversation = function (
  userId1,
  userId2,
  limit = 50
) {
  return this.find({
    isPrivate: true,
    $or: [
      { senderId: userId1, recipientId: userId2 },
      { senderId: userId2, recipientId: userId1 },
    ],
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get room messages
messageSchema.statics.getRoomMessages = function (roomName, limit = 100) {
  return this.find({
    roomName,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to search messages
messageSchema.statics.searchMessages = function (query, userId) {
  return this.find({
    $or: [{ senderId: userId }, { recipientId: userId }],
    content: { $regex: query, $options: "i" },
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(50);
};

module.exports = mongoose.model("Message", messageSchema);