/**
 * Error Tracking Service
 * Integrates Sentry for error monitoring and performance tracking
 * Provides centralized error handling and reporting
 */

// Note: Install @sentry/react with: npm install @sentry/react
// This service provides a mock implementation that works without Sentry
// Uncomment Sentry imports when ready to use

// import * as Sentry from '@sentry/react';
// import { BrowserTracing } from '@sentry/tracing';

/**
 * Configuration for error tracking
 */
const ERROR_TRACKING_CONFIG = {
  // Set to your Sentry DSN when ready
  dsn: import.meta.env.VITE_SENTRY_DSN || "",

  // Environment
  environment: import.meta.env.MODE || "development",

  // Release version
  release: import.meta.env.VITE_APP_VERSION || "1.0.0",

  // Enable/disable based on environment
  enabled:
    import.meta.env.MODE === "production" && import.meta.env.VITE_SENTRY_DSN,

  // Performance monitoring sample rate (0.0 to 1.0)
  tracesSampleRate: import.meta.env.MODE === "production" ? 0.2 : 1.0,

  // Session replay sample rate
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    "canvas.contentDocument",

    // Random plugins/extensions
    "atomicFindClose",

    // Network errors
    "Network request failed",
    "NetworkError",
    "Failed to fetch",

    // ResizeObserver (not critical)
    "ResizeObserver loop limit exceeded",
  ],

  // Deny URLs (don't report errors from these sources)
  denyUrls: [/extensions\//i, /^chrome:\/\//i, /^chrome-extension:\/\//i],

  // Maximum breadcrumbs
  maxBreadcrumbs: 50,

  // Attach stacktrace
  attachStacktrace: true,
};

/**
 * Mock Sentry implementation for development/testing
 */
const MockSentry = {
  init: () => console.warn("[ErrorTracking] Mock Sentry initialized"),
  captureException: (error) =>
    console.error("[ErrorTracking] Exception:", error),
  captureMessage: (message) =>
    console.warn("[ErrorTracking] Message:", message),
  setUser: (user) => console.warn("[ErrorTracking] User set:", user),
  setContext: (name, context) =>
    console.warn("[ErrorTracking] Context:", name, context),
  setTag: (key, value) => console.warn("[ErrorTracking] Tag:", key, value),
  addBreadcrumb: (breadcrumb) =>
    console.warn("[ErrorTracking] Breadcrumb:", breadcrumb),
  withScope: (callback) => callback({ setLevel: () => {}, setTag: () => {} }),
  configureScope: (callback) =>
    callback({ setLevel: () => {}, setTag: () => {} }),
  Severity: {
    Fatal: "fatal",
    Error: "error",
    Warning: "warning",
    Info: "info",
    Debug: "debug",
  },
};

/**
 * Error Tracking Service Class
 */
class ErrorTrackingService {
  constructor() {
    this.initialized = false;
    this.config = ERROR_TRACKING_CONFIG;
    this.Sentry = MockSentry; // Use mock by default
  }

  /**
   * Initialize error tracking
   * @param {Object} customConfig - Custom configuration options
   */
  init(customConfig = {}) {
    if (this.initialized) {
      console.warn("[ErrorTracking] Already initialized");
      return;
    }

    this.config = { ...this.config, ...customConfig };

    if (!this.config.enabled) {
      console.warn(
        "[ErrorTracking] Error tracking disabled (development mode or no DSN)",
      );
      this.initialized = true;
      return;
    }

    try {
      // Uncomment when Sentry is installed
      // this.Sentry = Sentry;

      // Sentry.init({
      //   dsn: this.config.dsn,
      //   environment: this.config.environment,
      //   release: this.config.release,
      //   tracesSampleRate: this.config.tracesSampleRate,
      //   replaysSessionSampleRate: this.config.replaysSessionSampleRate,
      //   replaysOnErrorSampleRate: this.config.replaysOnErrorSampleRate,
      //   ignoreErrors: this.config.ignoreErrors,
      //   denyUrls: this.config.denyUrls,
      //   maxBreadcrumbs: this.config.maxBreadcrumbs,
      //   attachStacktrace: this.config.attachStacktrace,
      //
      //   integrations: [
      //     new BrowserTracing({
      //       // Set sampling rate for performance monitoring
      //       tracingOrigins: ['localhost', /^\//],
      //     }),
      //     new Sentry.Replay({
      //       maskAllText: false,
      //       blockAllMedia: false,
      //     }),
      //   ],
      //
      //   beforeSend(event, hint) {
      //     // Filter out or modify events before sending
      //     const error = hint.originalException;
      //
      //     // Don't send errors from development
      //     if (window.location.hostname === 'localhost') {
      //       return null;
      //     }
      //
      //     return event;
      //   },
      // });

      this.initialized = true;
      console.warn("[ErrorTracking] Successfully initialized");
    } catch (error) {
      console.error("[ErrorTracking] Failed to initialize:", error);
      this.initialized = false;
    }
  }

  /**
   * Capture an exception
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   */
  captureException(error, context = {}) {
    if (!this.initialized) return;

    try {
      this.Sentry.withScope((scope) => {
        // Add context
        if (context.level) {
          scope.setLevel(context.level);
        }

        // Add tags
        if (context.tags) {
          Object.entries(context.tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }

        // Add extra data
        if (context.extra) {
          Object.entries(context.extra).forEach(([key, value]) => {
            scope.setContext(key, value);
          });
        }

        this.Sentry.captureException(error);
      });
    } catch (err) {
      console.error("[ErrorTracking] Failed to capture exception:", err);
    }
  }

  /**
   * Capture a message
   * @param {string} message - Message to log
   * @param {string} level - Severity level
   * @param {Object} context - Additional context
   */
  captureMessage(message, level = "info", context = {}) {
    if (!this.initialized) return;

    try {
      this.Sentry.withScope((scope) => {
        scope.setLevel(level);

        if (context.tags) {
          Object.entries(context.tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }

        this.Sentry.captureMessage(message);
      });
    } catch (error) {
      console.error("[ErrorTracking] Failed to capture message:", error);
    }
  }

  /**
   * Set user context
   * @param {Object} user - User information
   */
  setUser(user) {
    if (!this.initialized) return;

    try {
      this.Sentry.setUser({
        id: user.id,
        username: user.username || user.name,
        email: user.email,
        ...user,
      });
    } catch (error) {
      console.error("[ErrorTracking] Failed to set user:", error);
    }
  }

  /**
   * Clear user context
   */
  clearUser() {
    if (!this.initialized) return;

    try {
      this.Sentry.setUser(null);
    } catch (error) {
      console.error("[ErrorTracking] Failed to clear user:", error);
    }
  }

  /**
   * Set custom context
   * @param {string} name - Context name
   * @param {Object} context - Context data
   */
  setContext(name, context) {
    if (!this.initialized) return;

    try {
      this.Sentry.setContext(name, context);
    } catch (error) {
      console.error("[ErrorTracking] Failed to set context:", error);
    }
  }

  /**
   * Set a tag
   * @param {string} key - Tag key
   * @param {string} value - Tag value
   */
  setTag(key, value) {
    if (!this.initialized) return;

    try {
      this.Sentry.setTag(key, value);
    } catch (error) {
      console.error("[ErrorTracking] Failed to set tag:", error);
    }
  }

  /**
   * Add a breadcrumb
   * @param {Object} breadcrumb - Breadcrumb data
   */
  addBreadcrumb(breadcrumb) {
    if (!this.initialized) return;

    try {
      this.Sentry.addBreadcrumb({
        timestamp: Date.now(),
        ...breadcrumb,
      });
    } catch (error) {
      console.error("[ErrorTracking] Failed to add breadcrumb:", error);
    }
  }

  /**
   * Track game-specific events as breadcrumbs
   */
  trackGameEvent(eventType, data = {}) {
    this.addBreadcrumb({
      category: "game",
      message: eventType,
      level: "info",
      data,
    });
  }

  /**
   * Track user actions
   */
  trackUserAction(action, data = {}) {
    this.addBreadcrumb({
      category: "user-action",
      message: action,
      level: "info",
      data,
    });
  }

  /**
   * Track API calls
   */
  trackAPICall(url, method, statusCode, duration) {
    this.addBreadcrumb({
      category: "api",
      message: `${method} ${url}`,
      level: statusCode >= 400 ? "error" : "info",
      data: {
        url,
        method,
        statusCode,
        duration,
      },
    });
  }

  /**
   * Track navigation
   */
  trackNavigation(from, to) {
    this.addBreadcrumb({
      category: "navigation",
      message: `${from} -> ${to}`,
      level: "info",
    });
  }

  /**
   * Log game state for debugging
   */
  logGameState(phase, playerData, scores) {
    this.setContext("gameState", {
      phase,
      players: playerData,
      scores,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Create an error boundary error handler
   */
  createErrorBoundaryHandler() {
    return (error, errorInfo) => {
      this.captureException(error, {
        level: "error",
        tags: {
          errorBoundary: true,
        },
        extra: {
          componentStack: errorInfo.componentStack,
        },
      });
    };
  }

  /**
   * Handle global unhandled errors
   */
  setupGlobalErrorHandlers() {
    if (typeof window === "undefined") return;

    // Unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.captureException(new Error(event.reason), {
        level: "error",
        tags: {
          type: "unhandledrejection",
        },
        extra: {
          reason: event.reason,
        },
      });
    });

    // Global errors
    window.addEventListener("error", (event) => {
      this.captureException(event.error || new Error(event.message), {
        level: "error",
        tags: {
          type: "global-error",
        },
        extra: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });
  }

  /**
   * Test error tracking
   */
  testErrorTracking() {
    try {
      this.captureMessage("Test message from error tracking service", "info");
      throw new Error("Test error from error tracking service");
    } catch (error) {
      this.captureException(error, {
        tags: { test: true },
      });
    }
  }
}

// Create singleton instance
const errorTrackingService = new ErrorTrackingService();

// Export service and utilities
export default errorTrackingService;

export const {
  init: initErrorTracking,
  captureException,
  captureMessage,
  setUser,
  clearUser,
  setContext,
  setTag,
  addBreadcrumb,
  trackGameEvent,
  trackUserAction,
  trackAPICall,
  trackNavigation,
  logGameState,
  createErrorBoundaryHandler,
  setupGlobalErrorHandlers,
  testErrorTracking,
} = errorTrackingService;

/**
 * Convenience function to wrap async functions with error tracking
 */
export const withErrorTracking =
  (fn, context = {}) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorTrackingService.captureException(error, context);
      throw error;
    }
  };

/**
 * Higher-order component to add error boundary with tracking
 */
export const withErrorBoundary = (_Component, _fallback) => (props) => {
  const ErrorBoundary = () => (
    // Implementation would use React error boundary
    <_Component {...props} />
  );
  return <ErrorBoundary />;
};
