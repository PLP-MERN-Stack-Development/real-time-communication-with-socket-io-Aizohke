
const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../logs");

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const getTimestamp = () => new Date().toISOString();

const formatMessage = (level, message, meta = {}) => {
  return JSON.stringify({
    timestamp: getTimestamp(),
    level,
    message,
    ...meta,
  });
};

const writeToFile = (filename, message) => {
  const filepath = path.join(logDir, filename);
  fs.appendFileSync(filepath, message + "\n");
};

const logger = {
  info: (message, meta = {}) => {
    const log = formatMessage("INFO", message, meta);
    console.log(`[${getTimestamp()}] INFO: ${message}`);
    writeToFile("info.log", log);
  },

  error: (message, error, meta = {}) => {
    const log = formatMessage("ERROR", message, {
      ...meta,
      error: error?.message,
      stack: error?.stack,
    });
    console.error(`[${getTimestamp()}] ERROR: ${message}`, error);
    writeToFile("error.log", log);
  },

  warn: (message, meta = {}) => {
    const log = formatMessage("WARN", message, meta);
    console.warn(`[${getTimestamp()}] WARN: ${message}`);
    writeToFile("warn.log", log);
  },

  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === "development") {
      const log = formatMessage("DEBUG", message, meta);
      console.debug(`[${getTimestamp()}] DEBUG: ${message}`);
      writeToFile("debug.log", log);
    }
  },

  socket: (message, meta = {}) => {
    const log = formatMessage("SOCKET", message, meta);
    console.log(`[${getTimestamp()}] SOCKET: ${message}`);
    writeToFile("socket.log", log);
  },
};

module.exports = logger;
