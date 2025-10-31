
const { clerkClient } = require("../config/clerk");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Verify token with Clerk
    const session = await clerkClient.sessions.verifySession(token);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    // Attach user info to request
    req.userId = session.userId;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      const session = await clerkClient.sessions.verifySession(token);
      if (session) {
        req.userId = session.userId;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  requireAuth,
  optionalAuth,
};