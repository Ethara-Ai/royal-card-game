/**
 * Error logging service for application-wide error tracking
 * Provides centralized error handling with multiple severity levels
 * Can be extended to integrate with external services (Sentry, LogRocket, etc.)
 */

// Log levels for different severity types
export const LOG_LEVELS = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
};

// Configuration for error logging
const config = {
  enableConsoleLog:
    typeof import.meta !== "undefined"
      ? import.meta.env.MODE !== "production"
      : true,
  enableRemoteLogging: false, // Set to true when integrating external service
  maxStoredErrors: 50, // Maximum errors to keep in memory
};

// Store recent errors in memory for debugging
const errorHistory = [];

/**
 * Logs error to console (development) or external service (production)
 * @param {string} level - Log level (error, warn, info, debug)
 * @param {string} message - Error message
 * @param {Object} context - Additional context about the error
 * @param {Error} error - Original error object (optional)
 */
const logToService = (level, message, context = {}, error = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    level,
    message,
    timestamp,
    context: {
      ...context,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      url: typeof window !== "undefined" ? window.location.href : null,
    },
    error: error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : null,
  };

  // Store in memory for debugging
  errorHistory.push(logEntry);
  if (errorHistory.length > config.maxStoredErrors) {
    errorHistory.shift();
  }

  // Console logging for development
  if (config.enableConsoleLog) {
    const consoleMethod = level === "error" ? console.error : console.warn;
    consoleMethod(`[${level.toUpperCase()}] ${message}`, {
      ...logEntry.context,
      error: logEntry.error,
    });
  }

  // TODO: Add external logging service integration here
  // Example: Sentry, LogRocket, DataDog, etc.
  if (config.enableRemoteLogging) {
    sendToRemoteService(logEntry);
  }
};

/**
 * Placeholder for remote logging service integration
 * @param {Object} logEntry - The log entry to send
 */
const sendToRemoteService = (logEntry) => {
  // Example Sentry integration:
  // if (window.Sentry) {
  //   if (logEntry.level === LOG_LEVELS.ERROR) {
  //     window.Sentry.captureException(logEntry.error || new Error(logEntry.message), {
  //       contexts: { custom: logEntry.context },
  //     });
  //   } else {
  //     window.Sentry.captureMessage(logEntry.message, logEntry.level);
  //   }
  // }

  // For now, just log that we would send to remote service
  if (config.enableConsoleLog) {
    console.warn("[Remote Logging] Would send:", logEntry);
  }
};

/**
 * Log an error
 * @param {string} message - Error message
 * @param {Error|Object} errorOrContext - Error object or context
 * @param {Object} additionalContext - Additional context (if first param is Error)
 */
export const logError = (
  message,
  errorOrContext = {},
  additionalContext = {},
) => {
  const isErrorObject = errorOrContext instanceof Error;
  const error = isErrorObject ? errorOrContext : null;
  const context = isErrorObject ? additionalContext : errorOrContext;

  logToService(LOG_LEVELS.ERROR, message, context, error);
};

/**
 * Log a warning
 * @param {string} message - Warning message
 * @param {Object} context - Additional context
 */
export const logWarning = (message, context = {}) => {
  logToService(LOG_LEVELS.WARN, message, context);
};

/**
 * Log informational message
 * @param {string} message - Info message
 * @param {Object} context - Additional context
 */
export const logInfo = (message, context = {}) => {
  logToService(LOG_LEVELS.INFO, message, context);
};

/**
 * Log debug message
 * @param {string} message - Debug message
 * @param {Object} context - Additional context
 */
export const logDebug = (message, context = {}) => {
  logToService(LOG_LEVELS.DEBUG, message, context);
};

/**
 * Get recent error history for debugging
 * @param {number} count - Number of recent errors to retrieve
 * @returns {Array} Recent error entries
 */
export const getErrorHistory = (count = 10) => errorHistory.slice(-count);

/**
 * Clear error history
 */
export const clearErrorHistory = () => {
  errorHistory.length = 0;
};

/**
 * Configure error logging service
 * @param {Object} newConfig - Configuration options
 */
export const configureErrorLogger = (newConfig) => {
  Object.assign(config, newConfig);
};

/**
 * Log game-specific errors with additional context
 * @param {string} message - Error message
 * @param {Object} gameContext - Game state context
 * @param {Error} error - Original error
 */
export const logGameError = (message, gameContext = {}, error = null) => {
  logError(message, error, {
    component: "GameLogic",
    gamePhase: gameContext.phase,
    currentPlayer: gameContext.currentPlayer,
    playerCount: gameContext.playerCount,
    ...gameContext,
  });
};

/**
 * Log component rendering errors
 * @param {string} componentName - Name of the component
 * @param {Error} error - Error object
 * @param {Object} errorInfo - React error info
 */
export const logComponentError = (componentName, error, errorInfo = {}) => {
  logError(`Component Error: ${componentName}`, error, {
    component: componentName,
    componentStack: errorInfo.componentStack,
    errorBoundary: true,
  });
};

/**
 * Log performance metrics
 * @param {string} metricName - Name of the metric
 * @param {number} value - Metric value
 * @param {Object} context - Additional context
 */
export const logPerformance = (metricName, value, context = {}) => {
  logInfo(`Performance: ${metricName}`, {
    metric: metricName,
    value,
    unit: context.unit || "ms",
    ...context,
  });
};

// Export configuration for testing
export const __getConfig = () => ({ ...config });

export default {
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
};
