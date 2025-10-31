
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ["public", "private", "direct"],
      default: "public",
    },
    creator: {
      type: String,
      required: true,
    },
    members: [
      {
        userId: {
          type: String,
          required: true,
        },
        username: String,
        role: {
          type: String,
          enum: ["admin", "moderator", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    settings: {
      maxMembers: {
        type: Number,
        default: 100,
      },
      isArchived: {
        type: Boolean,
        default: false,
      },
      allowFileSharing: {
        type: Boolean,
        default: true,
      },
    },
    metadata: {
      totalMessages: {
        type: Number,
        default: 0,
      },
      lastMessage: {
        content: String,
        timestamp: Date,
        senderId: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
roomSchema.index({ "members.userId": 1 });
roomSchema.index({ type: 1 });

// Method to add member
roomSchema.methods.addMember = function (userId, username, role = "member") {
  const existingMember = this.members.find((m) => m.userId === userId);

  if (!existingMember) {
    this.members.push({ userId, username, role });
  }

  return this.save();
};

// Method to remove member
roomSchema.methods.removeMember = function (userId) {
  this.members = this.members.filter((m) => m.userId !== userId);
  return this.save();
};

// Method to update last message
roomSchema.methods.updateLastMessage = function (content, senderId) {
  this.metadata.lastMessage = {
    content,
    timestamp: new Date(),
    senderId,
  };
  this.metadata.totalMessages += 1;
  return this.save();
};

// Static method to find user rooms
roomSchema.statics.findUserRooms = function (userId) {
  return this.find({
    "members.userId": userId,
    "settings.isArchived": false,
  }).sort({ "metadata.lastMessage.timestamp": -1 });
};

module.exports = mongoose.model("Room", roomSchema);
