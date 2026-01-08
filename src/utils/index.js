/**
 * Barrel export for utility functions
 * Provides clean imports from a single entry point
 */

export { getSuitIcon, getRankDisplay, getCardColor } from "./cardHelpers";
export { cardPatterns, getPatternStyle } from "./patterns";
export { getPlayerDisplayName } from "./playerUtils";

// Sanitization utilities
export {
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
} from "./sanitize";

// Error logging utilities
export {
  logError,
  logWarning,
  logInfo,
  logDebug,
  logGameError,
  logComponentError,
  logPerformance,
  getErrorHistory,
  clearErrorHistory,
  configureErrorLogger,
  LOG_LEVELS,
} from "./errorLogger";
