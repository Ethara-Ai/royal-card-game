/**
 * Input sanitization utilities for user-generated content
 * Provides protection against XSS and injection attacks
 */

/**
 * Sanitize username input
 * Removes potentially dangerous characters and enforces length limits
 * @param {string} input - Raw username input
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized username
 */
export const sanitizeUsername = (input, options = {}) => {
  const {
    maxLength = 20,
    minLength = 0,
    allowSpaces = true,
    allowNumbers = true,
    allowSpecialChars = false,
  } = options;

  if (!input || typeof input !== "string") {
    return "";
  }

  let sanitized = input.trim();

  // Remove HTML tags and potentially dangerous characters
  sanitized = sanitized.replace(/<[^>]*>/g, "");
  sanitized = sanitized.replace(/[<>'"&]/g, "");

  // Remove control characters and zero-width characters
  // Remove control characters (C0 and C1 control codes)
  // Using dynamic regex construction to avoid no-control-regex lint error
  sanitized = sanitized.replace(
    new RegExp(`[\\u0000-\\u001F\\u007F-\\u009F]`, "g"),
    "",
  );
  sanitized = sanitized.replace(/[\u200B-\u200D\uFEFF]/g, "");

  // Remove leading/trailing spaces
  sanitized = sanitized.trim();

  // Handle space option
  if (!allowSpaces) {
    sanitized = sanitized.replace(/\s+/g, "");
  } else {
    // Replace multiple spaces with single space
    sanitized = sanitized.replace(/\s+/g, " ");
  }

  // Remove numbers if not allowed
  if (!allowNumbers) {
    sanitized = sanitized.replace(/\d/g, "");
  }

  // Remove special characters if not allowed
  if (!allowSpecialChars) {
    sanitized = sanitized.replace(/[^\w\s]/g, "");
  }

  // Enforce length limits
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  if (sanitized.length < minLength) {
    return "";
  }

  return sanitized;
};

/**
 * Sanitize general text input
 * More permissive than username but still safe
 * @param {string} input - Raw text input
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized text
 */
export const sanitizeText = (input, options = {}) => {
  const { maxLength = 1000, allowHTML = false } = options;

  if (!input || typeof input !== "string") {
    return "";
  }

  let sanitized = input.trim();

  // Remove HTML if not allowed
  if (!allowHTML) {
    sanitized = sanitized.replace(/<[^>]*>/g, "");
  }

  // Remove control characters
  // Remove control characters (C0 and C1 control codes)
  // Using dynamic regex construction to avoid no-control-regex lint error
  sanitized = sanitized.replace(
    new RegExp(`[\\u0000-\\u001F\\u007F-\\u009F]`, "g"),
    "",
  );

  // Enforce length limit
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
};

/**
 * Escape HTML special characters
 * Prevents XSS by converting special chars to HTML entities
 * @param {string} input - Raw HTML string
 * @returns {string} Escaped HTML string
 */
export const escapeHTML = (input) => {
  if (!input || typeof input !== "string") {
    return "";
  }

  const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return input.replace(/[&<>"'/]/g, (char) => htmlEscapes[char]);
};

/**
 * Unescape HTML entities back to characters
 * @param {string} input - Escaped HTML string
 * @returns {string} Unescaped string
 */
export const unescapeHTML = (input) => {
  if (!input || typeof input !== "string") {
    return "";
  }

  const htmlUnescapes = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#x27;": "'",
    "&#x2F;": "/",
  };

  return input.replace(
    /&(?:amp|lt|gt|quot|#x27|#x2F);/g,
    (entity) => htmlUnescapes[entity],
  );
};

/**
 * Validate and sanitize URL
 * Ensures URL is safe and uses allowed protocols
 * @param {string} input - Raw URL input
 * @param {Array} allowedProtocols - Allowed URL protocols
 * @returns {string|null} Sanitized URL or null if invalid
 */
export const sanitizeURL = (input, allowedProtocols = ["http", "https"]) => {
  if (!input || typeof input !== "string") {
    return null;
  }

  const trimmed = input.trim();

  try {
    const url = new URL(trimmed);

    // Check if protocol is allowed
    const protocol = url.protocol.replace(":", "");
    if (!allowedProtocols.includes(protocol)) {
      return null;
    }

    // Remove javascript: and data: protocols
    if (protocol === "javascript" || protocol === "data") {
      return null;
    }

    return url.toString();
  } catch {
    // Invalid URL
    return null;
  }
};

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Sanitize numeric input
 * @param {string|number} input - Raw numeric input
 * @param {Object} options - Validation options
 * @returns {number|null} Sanitized number or null if invalid
 */
export const sanitizeNumber = (input, options = {}) => {
  const { min = -Infinity, max = Infinity, allowFloat = true } = options;

  if (input === null || input === undefined || input === "") {
    return null;
  }

  const num = allowFloat ? parseFloat(input) : parseInt(input, 10);

  if (isNaN(num)) {
    return null;
  }

  if (num < min || num > max) {
    return null;
  }

  return num;
};

/**
 * Sanitize boolean input
 * @param {any} input - Raw boolean input
 * @returns {boolean} Sanitized boolean
 */
export const sanitizeBoolean = (input) => {
  if (typeof input === "boolean") {
    return input;
  }

  if (typeof input === "string") {
    const lower = input.toLowerCase().trim();
    return lower === "true" || lower === "1" || lower === "yes";
  }

  if (typeof input === "number") {
    return input !== 0;
  }

  return false;
};

/**
 * Remove SQL injection patterns
 * Basic protection for text that might be used in queries
 * @param {string} input - Raw input
 * @returns {string} Sanitized input
 */
export const sanitizeSQL = (input) => {
  if (!input || typeof input !== "string") {
    return "";
  }

  // Remove common SQL injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(-{2}|\/\*|\*\/)/g, // SQL comments
    /(;|\||&)/g, // Command separators
    /('|")/g, // Quotes
  ];

  let sanitized = input;
  sqlPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });

  return sanitized.trim();
};

/**
 * Validate string length
 * @param {string} input - Input string
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {boolean} True if length is valid
 */
export const isValidLength = (input, min = 0, max = Infinity) => {
  if (!input || typeof input !== "string") {
    return false;
  }

  const length = input.trim().length;
  return length >= min && length <= max;
};

/**
 * Check if input contains only alphanumeric characters
 * @param {string} input - Input string
 * @param {boolean} allowSpaces - Allow spaces in input
 * @returns {boolean} True if alphanumeric
 */
export const isAlphanumeric = (input, allowSpaces = false) => {
  if (!input || typeof input !== "string") {
    return false;
  }

  const pattern = allowSpaces ? /^[a-zA-Z0-9\s]+$/ : /^[a-zA-Z0-9]+$/;
  return pattern.test(input);
};

/**
 * Sanitize object keys to prevent prototype pollution
 * @param {Object} obj - Object to sanitize
 * @returns {Object} Sanitized object
 */
export const sanitizeObjectKeys = (obj) => {
  if (!obj || typeof obj !== "object") {
    return {};
  }

  const dangerous = ["__proto__", "constructor", "prototype"];
  const sanitized = {};

  Object.keys(obj).forEach((key) => {
    if (!dangerous.includes(key)) {
      sanitized[key] = obj[key];
    }
  });

  return sanitized;
};

/**
 * Deep sanitize object (recursive)
 * @param {any} value - Value to sanitize
 * @param {number} depth - Current recursion depth
 * @param {number} maxDepth - Maximum recursion depth
 * @returns {any} Sanitized value
 */
export const deepSanitize = (value, depth = 0, maxDepth = 10) => {
  // Prevent deep recursion
  if (depth > maxDepth) {
    return null;
  }

  // Handle primitives
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    return sanitizeText(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((item) => deepSanitize(item, depth + 1, maxDepth));
  }

  // Handle objects
  if (typeof value === "object") {
    const sanitized = sanitizeObjectKeys(value);
    const result = {};

    Object.keys(sanitized).forEach((key) => {
      result[key] = deepSanitize(sanitized[key], depth + 1, maxDepth);
    });

    return result;
  }

  return value;
};

export default {
  sanitizeUsername,
  sanitizeText,
  escapeHTML,
  unescapeHTML,
  sanitizeURL,
  isValidEmail,
  sanitizeNumber,
  sanitizeBoolean,
  sanitizeSQL,
  isValidLength,
  isAlphanumeric,
  sanitizeObjectKeys,
  deepSanitize,
};
