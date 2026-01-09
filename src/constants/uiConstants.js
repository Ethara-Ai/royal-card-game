/**
 * UI Constants for dimensions, sizes, and layout values
 * Centralizes all magic numbers for easier maintenance and consistency
 */

// ============================================================================
// CARD DIMENSIONS
// ============================================================================

export const CARD_DIMENSIONS = {
  // User hand cards (draggable)
  hand: {
    width: { min: 36, ideal: "10vw", max: 54 },
    height: { min: 52, ideal: "14vw", max: 76 },
    get clampWidth() {
      return `clamp(${this.width.min}px, ${this.width.ideal}, ${this.width.max}px)`;
    },
    get clampHeight() {
      return `clamp(${this.height.min}px, ${this.height.ideal}, ${this.height.max}px)`;
    },
  },

  // Opponent card backs
  opponent: {
    width: { min: 14, ideal: "3.5vw", max: 20 },
    height: { min: 20, ideal: "5vw", max: 28 },
    get clampWidth() {
      return `clamp(${this.width.min}px, ${this.width.ideal}, ${this.width.max}px)`;
    },
    get clampHeight() {
      return `clamp(${this.height.min}px, ${this.height.ideal}, ${this.height.max}px)`;
    },
  },

  // Played cards in center
  played: {
    width: { min: 40, ideal: "11vw", max: 60 },
    height: { min: 56, ideal: "15vw", max: 84 },
    get clampWidth() {
      return `clamp(${this.width.min}px, ${this.width.ideal}, ${this.width.max}px)`;
    },
    get clampHeight() {
      return `clamp(${this.height.min}px, ${this.height.ideal}, ${this.height.max}px)`;
    },
  },

  // Card spacing and overlap
  spacing: {
    handOverlap: -10, // Negative margin for card overlap in hand
    opponentGap: 4, // Gap between opponent cards
  },

  // Card rotation angles
  rotation: {
    handSpread: 5, // Degrees per card for fan effect
    playedVariance: 8, // Max rotation for played cards
  },
};

// ============================================================================
// LAYOUT DIMENSIONS
// ============================================================================

export const LAYOUT = {
  // Game table dimensions
  gameTable: {
    minHeight: { min: 320, ideal: "70vh", max: 700 },
    get clampHeight() {
      return `clamp(${this.minHeight.min}px, ${this.minHeight.ideal}, ${this.minHeight.max}px)`;
    },
    widthPercent: {
      min: 88,
      max: 82,
    },
    maxWidth: 900,
    aspectRatio: 1.75, // width / height
    borderRadius: "50%",
  },

  // Play area (center drop zone)
  playArea: {
    width: 300,
    height: 175,
    borderWidth: 2,
    borderStyle: "dashed",
  },

  // Header dimensions
  header: {
    height: 80,
    padding: { top: 16, horizontal: 12 },
  },

  // Content padding
  content: {
    maxWidth: 1280, // 7xl
    padding: {
      vertical: 16,
      horizontal: 12,
      safeAreaMin: 12,
    },
  },

  // Modal dimensions
  modal: {
    maxWidth: 640,
    padding: { vertical: 24, horizontal: 20 },
    borderRadius: 16,
  },

  // Waiting room
  waitingRoom: {
    maxWidth: 448, // 28rem
    padding: { mobile: 16, desktop: 24 },
    minHeight: "calc(100vh - 120px)",
  },
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const TYPOGRAPHY = {
  // Card text sizes
  card: {
    rank: { min: 12, ideal: "3.2vw", max: 18 },
    suit: { min: 16, ideal: "4vw", max: 24 },
    get clampRank() {
      return `clamp(${this.rank.min}px, ${this.rank.ideal}, ${this.rank.max}px)`;
    },
    get clampSuit() {
      return `clamp(${this.suit.min}px, ${this.suit.ideal}, ${this.suit.max}px)`;
    },
  },

  // Player panel text
  playerPanel: {
    name: { min: 10, ideal: "2.8vw", max: 14 },
    status: { min: 8, ideal: "2.2vw", max: 11 },
    cards: { min: 10, ideal: "2.8vw", max: 14 },
    get clampName() {
      return `clamp(${this.name.min}px, ${this.name.ideal}, ${this.name.max}px)`;
    },
    get clampStatus() {
      return `clamp(${this.status.min}px, ${this.status.ideal}, ${this.status.max}px)`;
    },
    get clampCards() {
      return `clamp(${this.cards.min}px, ${this.cards.ideal}, ${this.cards.max}px)`;
    },
  },

  // User hand panel text
  userHand: {
    name: { min: 11, ideal: "3vw", max: 15 },
    status: { min: 9, ideal: "2.4vw", max: 12 },
    cards: { min: 11, ideal: "3vw", max: 15 },
    get clampName() {
      return `clamp(${this.name.min}px, ${this.name.ideal}, ${this.name.max}px)`;
    },
    get clampStatus() {
      return `clamp(${this.status.min}px, ${this.status.ideal}, ${this.status.max}px)`;
    },
    get clampCards() {
      return `clamp(${this.cards.min}px, ${this.cards.ideal}, ${this.cards.max}px)`;
    },
  },

  // Leaderboard text
  leaderboard: {
    title: { min: 10, ideal: "2.6vw", max: 13 },
    playerName: { min: 11, ideal: "2.8vw", max: 14 },
    score: { min: 13, ideal: "3.2vw", max: 16 },
  },
};

// ============================================================================
// SPACING
// ============================================================================

export const SPACING = {
  // Panel padding
  panel: {
    small: { min: 6, ideal: "1.2vw", max: 12 },
    medium: { min: 8, ideal: "1.6vw", max: 16 },
    large: { min: 10, ideal: "2vw", max: 20 },
    get clampSmall() {
      return `clamp(${this.small.min}px, ${this.small.ideal}, ${this.small.max}px)`;
    },
    get clampMedium() {
      return `clamp(${this.medium.min}px, ${this.medium.ideal}, ${this.medium.max}px)`;
    },
    get clampLarge() {
      return `clamp(${this.large.min}px, ${this.large.ideal}, ${this.large.max}px)`;
    },
  },

  // Card spacing
  card: {
    padding: 4,
    gap: 2,
  },

  // Avatar dimensions
  avatar: {
    small: { min: 22, ideal: "5vw", max: 32 },
    medium: { min: 32, ideal: "7vw", max: 48 },
    large: { min: 48, ideal: "10vw", max: 64 },
    get clampSmall() {
      return `clamp(${this.small.min}px, ${this.small.ideal}, ${this.small.max}px)`;
    },
    get clampMedium() {
      return `clamp(${this.medium.min}px, ${this.medium.ideal}, ${this.medium.max}px)`;
    },
    get clampLarge() {
      return `clamp(${this.large.min}px, ${this.large.ideal}, ${this.large.max}px)`;
    },
  },
};

// ============================================================================
// POSITIONING
// ============================================================================

export const POSITIONING = {
  // Opponent positions relative to table
  opponents: {
    top: {
      top: "15%",
      left: "50%",
      transform: "translateX(-50%) translateY(-50%)",
    },
    left: {
      left: "clamp(2%, 3%, 5%)",
      top: "50%",
      transform: "translateY(-50%)",
    },
    right: {
      right: "clamp(2%, 3%, 5%)",
      top: "50%",
      transform: "translateY(-50%)",
    },
  },

  // User hand position
  userHand: {
    bottom: "15%",
    left: "50%",
    transform: "translateX(-50%) translateY(50%)",
  },

  // Play area center
  playArea: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },

  // Leaderboard sidebar
  leaderboard: {
    collapsed: {
      right: "clamp(8px, 1.5vw, 16px)",
      top: "50%",
      transform: "translateY(-50%)",
    },
    expanded: {
      right: "clamp(8px, 1.5vw, 16px)",
      top: "clamp(8px, 1.5vw, 16px)",
    },
  },
};

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

export const Z_INDEX = {
  base: 1,
  card: 10,
  cardDragging: 100,
  playerPanel: 10,
  playArea: 5,
  leaderboard: 20,
  modal: 1000,
  modalBackdrop: 999,
  dropdown: 50,
  dropdownBackdrop: 40,
  toast: 2000,
  loadingScreen: 3000,
};

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  mobile: 640, // sm
  tablet: 768, // md
  desktop: 1024, // lg
  wide: 1280, // xl
  ultraWide: 1536, // 2xl
};

// ============================================================================
// ANIMATION DURATIONS
// ============================================================================

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
  cardFlip: 600,
  cardDeal: 800,
};

// ============================================================================
// INTERACTION
// ============================================================================

export const INTERACTION = {
  // Touch gesture thresholds
  touch: {
    dragThreshold: 10, // Minimum pixels to start drag
    swipeVelocity: 0.5, // Minimum velocity for swipe
    longPressDelay: 500, // ms for long press
  },

  // Click/tap delays
  click: {
    debounceDelay: 300,
    doubleClickDelay: 300,
  },

  // Hover delays
  hover: {
    tooltipDelay: 500,
    menuDelay: 200,
  },
};

// ============================================================================
// INPUT VALIDATION
// ============================================================================

export const INPUT_LIMITS = {
  username: {
    minLength: 1,
    maxLength: 20,
  },
  textInput: {
    maxLength: 1000,
  },
};

// ============================================================================
// CONFETTI SETTINGS
// ============================================================================

export const CONFETTI = {
  numberOfPieces: 200,
  gravity: 0.3,
  recycle: false,
  duration: 5000,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get clamp CSS value from dimension object
 * @param {Object} dimension - Dimension object with min, ideal, max
 * @returns {string} CSS clamp() value
 */
export const getClampValue = (dimension) =>
  `clamp(${dimension.min}px, ${dimension.ideal}, ${dimension.max}px)`;

/**
 * Get responsive value based on breakpoint
 * @param {Object} values - Object with mobile, tablet, desktop values
 * @param {string} breakpoint - Current breakpoint
 * @returns {any} Responsive value
 */
export const getResponsiveValue = (values, breakpoint) => {
  if (breakpoint === "mobile" && values.mobile !== undefined) {
    return values.mobile;
  }
  if (breakpoint === "tablet" && values.tablet !== undefined) {
    return values.tablet;
  }
  if (breakpoint === "desktop" && values.desktop !== undefined) {
    return values.desktop;
  }
  return values.mobile || values.tablet || values.desktop;
};

export default {
  CARD_DIMENSIONS,
  LAYOUT,
  TYPOGRAPHY,
  SPACING,
  POSITIONING,
  Z_INDEX,
  BREAKPOINTS,
  ANIMATION_DURATIONS,
  INTERACTION,
  INPUT_LIMITS,
  CONFETTI,
  getClampValue,
  getResponsiveValue,
};
