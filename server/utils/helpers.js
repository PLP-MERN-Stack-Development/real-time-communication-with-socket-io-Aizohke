
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const formatTimestamp = (date = new Date()) => {
  return date.toISOString();
};

const getRelativeTime = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return past.toLocaleDateString();
};

const paginate = (query, page = 1, limit = 50) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

const calculatePaginationMetadata = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const retry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(delay * (i + 1));
    }
  }
};

module.exports = {
  generateId,
  formatTimestamp,
  getRelativeTime,
  paginate,
  calculatePaginationMetadata,
  sleep,
  retry,
};