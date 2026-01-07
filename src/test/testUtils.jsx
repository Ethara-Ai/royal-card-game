/**
 * Test Utilities
 * Custom render wrapper and helper functions for testing React components
 */

import { render } from "@testing-library/react";
import { vi, expect } from "vitest";

/**
 * Custom render wrapper that can include providers if needed
 * Currently a simple wrapper, but can be extended with context providers
 */
const customRender = (ui, options = {}) => {
  const { ...renderOptions } = options;

  const Wrapper = ({ children }) => <>{children}</>;

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything from testing library
export * from "@testing-library/react";

// Override render with custom render
export { customRender as render };

/**
 * Creates a mock card object for testing
 * @param {string} suit - Card suit (hearts, diamonds, clubs, spades)
 * @param {number} rank - Card rank (1-13)
 * @returns {Object} Mock card object
 */
export const createMockCard = (suit = "hearts", rank = 1) => ({
  id: `${suit}-${rank}`,
  suit,
  rank,
  value: rank === 1 ? 14 : rank,
});

/**
 * Creates a mock player object for testing
 * @param {string} id - Player ID
 * @param {string} name - Player name
 * @param {Array} hand - Array of cards in player's hand
 * @param {number} score - Player's score
 * @returns {Object} Mock player object
 */
export const createMockPlayer = (
  id = "player1",
  name = "Test Player",
  hand = [],
  score = 0,
) => ({
  id,
  name,
  hand,
  score,
  isActive: id === "player1",
});

/**
 * Creates a full deck of cards for testing
 * @returns {Array} Array of 52 card objects
 */
export const createMockDeck = () => {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const deck = [];

  suits.forEach((suit) => {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push(createMockCard(suit, rank));
    }
  });

  return deck;
};

/**
 * Creates a mock game state object for testing
 * @param {Object} overrides - Properties to override in the default state
 * @returns {Object} Mock game state object
 */
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

/**
 * Creates a set of mock players for testing
 * @param {Array} hands - Optional array of hands for each player
 * @returns {Array} Array of 4 mock player objects
 */
export const createMockPlayers = (hands = [[], [], [], []]) => [
  createMockPlayer("player1", "You", hands[0], 0),
  createMockPlayer("player2", "Alex", hands[1], 0),
  createMockPlayer("player3", "Sam", hands[2], 0),
  createMockPlayer("player4", "Jordan", hands[3], 0),
];

/**
 * Creates a mock trick (4 cards played by each player) for testing
 * @returns {Object} Mock trick object with player IDs as keys and cards as values
 */
export const createMockTrick = () => ({
  player1: createMockCard("hearts", 5),
  player2: createMockCard("hearts", 10),
  player3: createMockCard("spades", 3),
  player4: createMockCard("hearts", 7),
});

/**
 * Creates mock drag event for testing drag and drop functionality
 * @param {string} type - Event type (dragstart, dragend, drop, etc.)
 * @param {Object} data - Data to include in the event
 * @returns {Object} Mock event object
 */
export const createMockDragEvent = (type, data = {}) => ({
  type,
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  dataTransfer: {
    setData: vi.fn(),
    getData: vi.fn(),
    effectAllowed: "move",
    dropEffect: "move",
  },
  ...data,
});

/**
 * Creates mock touch event for testing touch interactions
 * @param {string} type - Event type (touchstart, touchmove, touchend)
 * @param {Object} touchData - Touch coordinates and data
 * @returns {Object} Mock touch event object
 */
export const createMockTouchEvent = (type, touchData = {}) => {
  const defaultTouch = {
    clientX: 100,
    clientY: 100,
    identifier: 0,
    ...touchData,
  };

  return {
    type,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    touches: type === "touchend" ? [] : [defaultTouch],
    changedTouches: [defaultTouch],
    targetTouches: type === "touchend" ? [] : [defaultTouch],
  };
};

/**
 * Waits for a specified number of milliseconds
 * Useful for testing async operations and timeouts
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after the specified time
 */
export const waitFor = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulates a window resize event
 * @param {number} width - New window width
 * @param {number} height - New window height
 */
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

/**
 * Creates a mock localStorage instance for testing
 * @returns {Object} Mock localStorage object with jest functions
 */
export const createMockLocalStorage = () => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index) => Object.keys(store)[index] || null),
    _getStore: () => store,
  };
};

/**
 * Flushes all pending promises
 * Useful for testing async state updates
 * @returns {Promise} Promise that resolves after all pending promises
 */
export const flushPromises = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Creates a mock function that tracks calls and can be configured to return values
 * @param {*} returnValue - Value to return when called
 * @returns {Function} Mock function
 */
export const createMockFn = (returnValue) => vi.fn(() => returnValue);

/**
 * Assert helper for testing CSS styles
 * @param {HTMLElement} element - DOM element to check
 * @param {Object} styles - Object with style properties to verify
 */
export const expectStyles = (element, styles) => {
  Object.entries(styles).forEach(([property, value]) => {
    expect(element.style[property]).toBe(value);
  });
};

/**
 * Gets all cards of a specific suit from a deck
 * @param {Array} deck - Array of card objects
 * @param {string} suit - Suit to filter by
 * @returns {Array} Cards matching the specified suit
 */
export const getCardsBySuit = (deck, suit) =>
  deck.filter((card) => card.suit === suit);

/**
 * Gets all cards of a specific rank from a deck
 * @param {Array} deck - Array of card objects
 * @param {number} rank - Rank to filter by
 * @returns {Array} Cards matching the specified rank
 */
export const getCardsByRank = (deck, rank) =>
  deck.filter((card) => card.rank === rank);
