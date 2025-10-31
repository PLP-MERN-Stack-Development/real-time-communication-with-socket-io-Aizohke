
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["online", "offline", "away", "busy"],
      default: "offline",
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    bio: {
      type: String,
      maxlength: 200,
      default: "",
    },
    preferences: {
      notifications: {
        type: Boolean,
        default: true,
      },
      soundEnabled: {
        type: Boolean,
        default: true,
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
    },
    metadata: {
      totalMessages: {
        type: Number,
        default: 0,
      },
      totalReactions: {
        type: Number,
        default: 0,
      },
      joinedRooms: [
        {
          type: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ status: 1 });
userSchema.index({ lastSeen: -1 });

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return (
    `${this.firstName || ""} ${this.lastName || ""}`.trim() || this.username
  );
});

// Method to update last seen
userSchema.methods.updateLastSeen = function () {
  this.lastSeen = new Date();
  return this.save();
};

// Method to update status
userSchema.methods.updateStatus = function (status) {
  this.status = status;
  this.lastSeen = new Date();
  return this.save();
};

// Method to increment message count
userSchema.methods.incrementMessageCount = function () {
  this.metadata.totalMessages += 1;
  return this.save();
};

// Static method to find online users
userSchema.statics.findOnlineUsers = function () {
  return this.find({ status: { $in: ["online", "away", "busy"] } })
    .select("clerkId username email avatar status lastSeen")
    .sort({ lastSeen: -1 });
};

// Ensure virtuals are included in JSON
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("User", userSchema);