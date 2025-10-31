
const sanitizeUsername = (username) => {
  if (!username) return "";

  return username
    .trim()
    .replace(/[^a-zA-Z0-9_-\s]/g, "")
    .substring(0, 50);
};

const sanitizeMessage = (message) => {
  if (!message) return "";

  return message.trim().substring(0, 2000);
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidFileType = (mimeType) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  return allowedTypes.includes(mimeType);
};

const isValidFileSize = (size, maxSizeMB = 10) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
};

const validateMessageData = (data) => {
  const errors = [];

  if (!data.message || data.message.trim().length === 0) {
    errors.push("Message content is required");
  }

  if (data.message && data.message.length > 2000) {
    errors.push("Message is too long (max 2000 characters)");
  }

  if (data.file) {
    if (!isValidFileType(data.file.type)) {
      errors.push("Invalid file type");
    }

    if (!isValidFileSize(data.file.size)) {
      errors.push("File size exceeds limit (10MB)");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  sanitizeUsername,
  sanitizeMessage,
  isValidEmail,
  isValidUrl,
  isValidFileType,
  isValidFileSize,
  validateMessageData,
};