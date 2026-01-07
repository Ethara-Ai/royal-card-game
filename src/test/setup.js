/**
 * Test Setup File
 * Configures the testing environment for Vitest and React Testing Library
 */

import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with React Testing Library matchers
expect.extend(matchers);

// Cleanup after each test to prevent memory leaks
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia for theme and responsive tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.ResizeObserver = ResizeObserverMock;

// Mock IntersectionObserver
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.IntersectionObserver = IntersectionObserverMock;

// Mock document.fonts for useAppLoading hook
Object.defineProperty(document, "fonts", {
  value: {
    ready: Promise.resolve(),
    check: vi.fn(() => true),
    load: vi.fn(() => Promise.resolve([])),
  },
});

// Mock requestAnimationFrame and cancelAnimationFrame
window.requestAnimationFrame = vi.fn((callback) => setTimeout(callback, 0));
window.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id);
});

// Mock scrollTo
window.scrollTo = vi.fn();
Element.prototype.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

// Mock getComputedStyle for CSS variable tests
const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = vi.fn((element) => {
  const style = originalGetComputedStyle(element);
  return {
    ...style,
    getPropertyValue: vi.fn((prop) => {
      // Return mock values for CSS custom properties
      const cssVariables = {
        "--color-card-red": "#dc2626",
        "--color-card-black": "#1f2937",
        "--color-card-white": "#ffffff",
        "--color-card-border": "#e5e7eb",
        "--radius-sm": "4px",
      };
      return cssVariables[prop] || style.getPropertyValue(prop);
    }),
  };
});

// Mock elementFromPoint for touch event tests
document.elementFromPoint = vi.fn(() => null);

// Suppress console errors during tests (optional - can be commented out for debugging)
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out React act() warnings and other expected warnings
  const suppressedWarnings = [
    "Warning: ReactDOM.render is no longer supported",
    "Warning: An update to",
    "act(",
  ];

  const shouldSuppress = suppressedWarnings.some((warning) =>
    args[0]?.toString().includes(warning)
  );

  if (!shouldSuppress) {
    originalConsoleError.apply(console, args);
  }
};

// Helper function to create mock card
export const createMockCard = (suit = "hearts", rank = 1) => ({
  id: `${suit}-${rank}`,
  suit,
  rank,
  value: rank === 1 ? 14 : rank,
});

// Helper function to create mock player
export const createMockPlayer = (
  id = "player1",
  name = "Test Player",
  hand = []
) => ({
  id,
  name,
  hand,
  score: 0,
  isActive: id === "player1",
});

// Helper function to create mock game state
export const createMockGameState = (overrides = {}) => ({
  phase: "waiting",
  currentPlayer: 0,
  currentTrick: [],
  playedCards: {},
  scores: [0, 0, 0, 0],
  round: 1,
  maxRounds: 5,
  ...overrides,
});

// Helper function to wait for async operations
export const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to simulate window resize
export const simulateResize = (width, height) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event("resize"));
};

// Export test utilities
export { vi };
