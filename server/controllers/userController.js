
const User = require("../models/User");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v").sort({ lastSeen: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
    });
  }
};

// Get active users
const getActiveUsers = async (req, res) => {
  try {
    const activeUsers = await User.findOnlineUsers();

    res.json({
      success: true,
      count: activeUsers.length,
      users: activeUsers,
    });
  } catch (error) {
    console.error("Get active users error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch active users",
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ clerkId: userId }).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Prevent updating sensitive fields
    delete updates.clerkId;
    delete updates.email;

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user",
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ clerkId: userId }).select("metadata");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      stats: user.metadata,
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user statistics",
    });
  }
};

module.exports = {
  getAllUsers,
  getActiveUsers,
  getUserById,
  updateUserProfile,
  getUserStats,
};