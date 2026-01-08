/**
 * Analytics Service
 * Provides centralized analytics tracking for user behavior and game events
 * Supports Google Analytics, Mixpanel, or custom analytics providers
 */

import React from "react";

/**
 * Analytics configuration
 */
const ANALYTICS_CONFIG = {
  // Google Analytics
  gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID || "",

  // Mixpanel
  mixpanelToken: import.meta.env.VITE_MIXPANEL_TOKEN || "",

  // Custom analytics endpoint
  customEndpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT || "",

  // Enable/disable based on environment
  enabled: import.meta.env.MODE === "production",

  // Debug mode
  debug: import.meta.env.MODE === "development",

  // Privacy settings
  respectDoNotTrack: true,
  anonymizeIP: true,

  // User consent (GDPR compliance)
  requireConsent: true,

  // Event batching
  batchEvents: true,
  batchSize: 10,
  batchInterval: 5000, // ms
};

/**
 * Event categories for analytics
 */
export const EVENT_CATEGORIES = {
  GAME: "Game",
  USER: "User",
  UI: "UI",
  PERFORMANCE: "Performance",
  ERROR: "Error",
  SOCIAL: "Social",
};

/**
 * Common event actions
 */
export const EVENT_ACTIONS = {
  // Game events
  GAME_START: "game_start",
  GAME_END: "game_end",
  GAME_RESET: "game_reset",
  CARD_PLAYED: "card_played",
  TRICK_WON: "trick_won",
  TRICK_LOST: "trick_lost",

  // User events
  USER_JOINED: "user_joined",
  USERNAME_SET: "username_set",
  SETTINGS_CHANGED: "settings_changed",

  // UI events
  BUTTON_CLICK: "button_click",
  MODAL_OPEN: "modal_open",
  MODAL_CLOSE: "modal_close",
  THEME_TOGGLE: "theme_toggle",
  RULE_SET_CHANGED: "rule_set_changed",
  CARD_CUSTOMIZATION: "card_customization",

  // Performance
  PAGE_LOAD: "page_load",
  GAME_LOAD: "game_load",

  // Errors
  ERROR_OCCURRED: "error_occurred",
  ERROR_BOUNDARY: "error_boundary",
};

/**
 * Mock Analytics Implementation
 */
class MockAnalytics {
  trackEvent(category, action, label, value) {
    console.warn("[Analytics] Event:", { category, action, label, value });
  }

  trackPageView(path, title) {
    console.warn("[Analytics] Page View:", { path, title });
  }

  trackTiming(category, variable, time, label) {
    console.warn("[Analytics] Timing:", { category, variable, time, label });
  }

  setUserId(userId) {
    console.warn("[Analytics] User ID:", userId);
  }

  setUserProperties(properties) {
    console.warn("[Analytics] User Properties:", properties);
  }
}

/**
 * Analytics Service Class
 */
class AnalyticsService {
  constructor() {
    this.initialized = false;
    this.config = ANALYTICS_CONFIG;
    this.provider = new MockAnalytics();
    this.eventQueue = [];
    this.batchTimer = null;
    this.userConsent = !this.config.requireConsent; // Default to true if consent not required
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
  }

  /**
   * Generate a unique session ID
   */
  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize analytics
   */
  init(customConfig = {}) {
    if (this.initialized) {
      console.warn("[Analytics] Already initialized");
      return;
    }

    this.config = { ...this.config, ...customConfig };

    // Check Do Not Track
    if (this.config.respectDoNotTrack && this.isDoNotTrackEnabled()) {
      console.warn("[Analytics] Do Not Track is enabled, analytics disabled");
      this.config.enabled = false;
      this.initialized = true;
      return;
    }

    if (!this.config.enabled) {
      console.warn("[Analytics] Analytics disabled (development mode)");
      this.initialized = true;
      return;
    }

    try {
      this.initializeProviders();
      this.setupEventBatching();
      this.trackSessionStart();
      this.initialized = true;
      console.warn("[Analytics] Successfully initialized");
    } catch (error) {
      console.error("[Analytics] Failed to initialize:", error);
      this.initialized = false;
    }
  }

  /**
   * Initialize analytics providers (GA, Mixpanel, etc.)
   */
  initializeProviders() {
    // Google Analytics initialization
    if (this.config.gaTrackingId && typeof window !== "undefined") {
      // Uncomment when ready to use GA
      // const script = document.createElement('script');
      // script.async = true;
      // script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.gaTrackingId}`;
      // document.head.appendChild(script);
      //
      // window.dataLayer = window.dataLayer || [];
      // function gtag(){dataLayer.push(arguments);}
      // gtag('js', new Date());
      // gtag('config', this.config.gaTrackingId, {
      //   anonymize_ip: this.config.anonymizeIP,
      // });

      console.warn("[Analytics] Google Analytics would be initialized");
    }

    // Mixpanel initialization
    if (this.config.mixpanelToken) {
      // Uncomment when ready to use Mixpanel
      // mixpanel.init(this.config.mixpanelToken, {
      //   debug: this.config.debug,
      //   track_pageview: true,
      //   persistence: 'localStorage',
      // });

      console.warn("[Analytics] Mixpanel would be initialized");
    }
  }

  /**
   * Setup event batching
   */
  setupEventBatching() {
    if (!this.config.batchEvents) return;

    this.batchTimer = setInterval(() => {
      this.flushEventQueue();
    }, this.config.batchInterval);
  }

  /**
   * Check if Do Not Track is enabled
   */
  isDoNotTrackEnabled() {
    if (typeof navigator === "undefined") return false;
    return (
      navigator.doNotTrack === "1" ||
      window.doNotTrack === "1" ||
      navigator.msDoNotTrack === "1"
    );
  }

  /**
   * Set user consent for tracking
   */
  setUserConsent(consent) {
    this.userConsent = consent;
    if (consent) {
      console.warn("[Analytics] User consent granted");
      this.flushEventQueue();
    } else {
      console.warn("[Analytics] User consent denied");
      this.eventQueue = [];
    }
  }

  /**
   * Track an event
   */
  trackEvent(category, action, label = null, value = null, customData = {}) {
    if (!this.shouldTrack()) return;

    const event = {
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      ...customData,
    };

    if (this.config.debug) {
      console.warn("[Analytics] Track Event:", event);
    }

    if (this.config.batchEvents) {
      this.eventQueue.push(event);
      if (this.eventQueue.length >= this.config.batchSize) {
        this.flushEventQueue();
      }
    } else {
      this.sendEvent(event);
    }
  }

  /**
   * Track a page view
   */
  trackPageView(path, title) {
    if (!this.shouldTrack()) return;

    if (this.config.debug) {
      console.warn("[Analytics] Page View:", { path, title });
    }

    this.provider.trackPageView(path, title);
  }

  /**
   * Track timing/performance
   */
  trackTiming(category, variable, time, label = null) {
    if (!this.shouldTrack()) return;

    if (this.config.debug) {
      console.warn("[Analytics] Timing:", { category, variable, time, label });
    }

    this.provider.trackTiming(category, variable, time, label);
  }

  /**
   * Set user ID
   */
  setUserId(userId) {
    if (!this.shouldTrack()) return;
    this.provider.setUserId(userId);
  }

  /**
   * Set user properties
   */
  setUserProperties(properties) {
    if (!this.shouldTrack()) return;
    this.provider.setUserProperties(properties);
  }

  /**
   * Check if tracking should occur
   */
  shouldTrack() {
    return this.initialized && this.config.enabled && this.userConsent;
  }

  /**
   * Send event to analytics provider
   */
  sendEvent(event) {
    this.provider.trackEvent(
      event.category,
      event.action,
      event.label,
      event.value,
    );
  }

  /**
   * Flush event queue
   */
  flushEventQueue() {
    if (this.eventQueue.length === 0) return;

    if (this.config.debug) {
      console.warn(`[Analytics] Flushing ${this.eventQueue.length} events`);
    }

    this.eventQueue.forEach((event) => this.sendEvent(event));
    this.eventQueue = [];
  }

  /**
   * Track session start
   */
  trackSessionStart() {
    this.trackEvent(EVENT_CATEGORIES.USER, "session_start", null, null, {
      sessionId: this.sessionId,
      timestamp: this.sessionStartTime,
    });
  }

  /**
   * Track session end
   */
  trackSessionEnd() {
    const duration = Date.now() - this.sessionStartTime;
    this.trackEvent(EVENT_CATEGORIES.USER, "session_end", null, duration, {
      sessionId: this.sessionId,
      duration,
    });
    this.flushEventQueue();
  }

  // ============================================================================
  // GAME-SPECIFIC TRACKING METHODS
  // ============================================================================

  /**
   * Track game start
   */
  trackGameStart(ruleSet, playerCount = 4) {
    this.trackEvent(
      EVENT_CATEGORIES.GAME,
      EVENT_ACTIONS.GAME_START,
      ruleSet,
      playerCount,
      {
        ruleSet,
        playerCount,
        gameStartTime: Date.now(),
      },
    );
  }

  /**
   * Track game end
   */
  trackGameEnd(winner, scores, duration, trickData = {}) {
    this.trackEvent(
      EVENT_CATEGORIES.GAME,
      EVENT_ACTIONS.GAME_END,
      winner,
      duration,
      {
        winner,
        scores,
        duration,
        tricksWon: trickData.tricksWon || 0,
        totalTricks: trickData.totalTricks || 7,
        gameEndTime: Date.now(),
      },
    );
  }

  /**
   * Track card played
   */
  trackCardPlayed(cardSuit, cardRank, trickNumber, playerType = "human") {
    this.trackEvent(
      EVENT_CATEGORIES.GAME,
      EVENT_ACTIONS.CARD_PLAYED,
      `${cardSuit}-${cardRank}`,
      trickNumber,
      {
        suit: cardSuit,
        rank: cardRank,
        trick: trickNumber,
        playerType,
      },
    );
  }

  /**
   * Track trick outcome
   */
  trackTrickOutcome(won, trickNumber, winningCard) {
    this.trackEvent(
      EVENT_CATEGORIES.GAME,
      won ? EVENT_ACTIONS.TRICK_WON : EVENT_ACTIONS.TRICK_LOST,
      `trick-${trickNumber}`,
      trickNumber,
      {
        trickNumber,
        winningCard,
        outcome: won ? "won" : "lost",
      },
    );
  }

  /**
   * Track username set
   */
  trackUsernameSet(username) {
    this.trackEvent(
      EVENT_CATEGORIES.USER,
      EVENT_ACTIONS.USERNAME_SET,
      "username",
      null,
      {
        usernameLength: username.length,
        hasSpecialChars: /[^a-zA-Z0-9]/.test(username),
      },
    );
  }

  /**
   * Track settings change
   */
  trackSettingsChange(settingName, newValue) {
    this.trackEvent(
      EVENT_CATEGORIES.USER,
      EVENT_ACTIONS.SETTINGS_CHANGED,
      settingName,
      null,
      {
        setting: settingName,
        value: newValue,
      },
    );
  }

  /**
   * Track theme toggle
   */
  trackThemeToggle(newTheme) {
    this.trackEvent(
      EVENT_CATEGORIES.UI,
      EVENT_ACTIONS.THEME_TOGGLE,
      newTheme,
      null,
      {
        theme: newTheme,
      },
    );
  }

  /**
   * Track rule set change
   */
  trackRuleSetChange(ruleSetName) {
    this.trackEvent(
      EVENT_CATEGORIES.UI,
      EVENT_ACTIONS.RULE_SET_CHANGED,
      ruleSetName,
      null,
      {
        ruleSet: ruleSetName,
      },
    );
  }

  /**
   * Track card customization
   */
  trackCardCustomization(customizationType, value) {
    this.trackEvent(
      EVENT_CATEGORIES.UI,
      EVENT_ACTIONS.CARD_CUSTOMIZATION,
      customizationType,
      null,
      {
        type: customizationType,
        value,
      },
    );
  }

  /**
   * Track modal interactions
   */
  trackModalOpen(modalName) {
    this.trackEvent(
      EVENT_CATEGORIES.UI,
      EVENT_ACTIONS.MODAL_OPEN,
      modalName,
      null,
      {
        modal: modalName,
      },
    );
  }

  trackModalClose(modalName, duration) {
    this.trackEvent(
      EVENT_CATEGORIES.UI,
      EVENT_ACTIONS.MODAL_CLOSE,
      modalName,
      duration,
      {
        modal: modalName,
        duration,
      },
    );
  }

  /**
   * Track button clicks
   */
  trackButtonClick(buttonName, context = null) {
    this.trackEvent(
      EVENT_CATEGORIES.UI,
      EVENT_ACTIONS.BUTTON_CLICK,
      buttonName,
      null,
      {
        button: buttonName,
        context,
      },
    );
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metricName, value, context = {}) {
    this.trackTiming(
      EVENT_CATEGORIES.PERFORMANCE,
      metricName,
      value,
      context.label,
    );
  }

  /**
   * Track errors
   */
  trackError(errorMessage, errorType, context = {}) {
    this.trackEvent(
      EVENT_CATEGORIES.ERROR,
      EVENT_ACTIONS.ERROR_OCCURRED,
      errorType,
      null,
      {
        message: errorMessage,
        type: errorType,
        ...context,
      },
    );
  }

  /**
   * Cleanup on app close
   */
  cleanup() {
    this.trackSessionEnd();
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

// Setup cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    analyticsService.cleanup();
  });
}

// Export service and utilities
export default analyticsService;

export const {
  init: initAnalytics,
  setUserConsent,
  trackEvent,
  trackPageView,
  trackTiming,
  setUserId,
  setUserProperties,
  trackGameStart,
  trackGameEnd,
  trackCardPlayed,
  trackTrickOutcome,
  trackUsernameSet,
  trackSettingsChange,
  trackThemeToggle,
  trackRuleSetChange,
  trackCardCustomization,
  trackModalOpen,
  trackModalClose,
  trackButtonClick,
  trackPerformance,
  trackError,
} = analyticsService;

/**
 * React hook for analytics
 */
export const useAnalytics = () => ({
  trackEvent: analyticsService.trackEvent.bind(analyticsService),
  trackGameStart: analyticsService.trackGameStart.bind(analyticsService),
  trackGameEnd: analyticsService.trackGameEnd.bind(analyticsService),
  trackCardPlayed: analyticsService.trackCardPlayed.bind(analyticsService),
  trackTrickOutcome: analyticsService.trackTrickOutcome.bind(analyticsService),
  trackSettingsChange:
    analyticsService.trackSettingsChange.bind(analyticsService),
  trackThemeToggle: analyticsService.trackThemeToggle.bind(analyticsService),
  trackButtonClick: analyticsService.trackButtonClick.bind(analyticsService),
});

/**
 * Higher-order component to track component mounts
 */
export const withAnalytics = (Component, componentName) => (props) => {
  React.useEffect(() => {
    analyticsService.trackEvent(
      EVENT_CATEGORIES.UI,
      "component_mount",
      componentName,
    );

    return () => {
      analyticsService.trackEvent(
        EVENT_CATEGORIES.UI,
        "component_unmount",
        componentName,
      );
    };
  }, []);

  return <Component {...props} />;
};
