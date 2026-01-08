/**
 * Game constants and initial state values
 * Centralizes all game configuration for easy maintenance
 */

// Initial game state
export const INITIAL_GAME_STATE = {
  phase: "waiting",
  currentPlayer: 0,
  currentTrick: [],
  playedCards: {},
  scores: [0, 0, 0, 0],
  round: 1,
  maxRounds: 5,
};

// Initial players configuration
export const INITIAL_PLAYERS = [
  { id: "player1", name: "Player", hand: [], score: 0, isActive: true },
  { id: "player2", name: "Alex", hand: [], score: 0, isActive: false },
  { id: "player3", name: "Sam", hand: [], score: 0, isActive: false },
  { id: "player4", name: "Jordan", hand: [], score: 0, isActive: false },
];

// Card suits
export const SUITS = ["hearts", "diamonds", "clubs", "spades"];

// Cards per player when dealing
export const CARDS_PER_PLAYER = 7;

// Number of players in the game
export const PLAYER_COUNT = 4;

// Default card back customization
export const DEFAULT_CARD_BACK_COLOR = "#145a4a";
export const DEFAULT_CARD_BACK_PATTERN = "checker";

// Animation timings (in milliseconds)
export const ANIMATION_TIMINGS = {
  dealingDelay: 500,
  dealingAnimation: 800,
  cardPlayDelay: 1000,
  aiPlayDelay: 1200,
  trickEvaluationDelay: 2000,
  confettiDuration: 5000,
  appLoadDelay: 500,
};

// Card positions for played cards in the center
export const CARD_POSITIONS = [
  { x: -50, y: 10, rotation: -8, zIndex: 1 },
  { x: -18, y: -5, rotation: -3, zIndex: 2 },
  { x: 18, y: -5, rotation: 3, zIndex: 3 },
  { x: 50, y: 10, rotation: 8, zIndex: 4 },
];

// Game phases
export const GAME_PHASES = {
  WAITING: "waiting",
  DEALING: "dealing",
  PLAYING: "playing",
  EVALUATING: "evaluating",
  GAME_OVER: "gameOver",
};

// Confetti colors for winner celebration
export const CONFETTI_COLORS = [
  "#c9a227",
  "#dbb840",
  "#f0d060",
  "#ffffff",
  "#1a7360",
];

// Theme options
export const THEMES = {
  DARK: "dark",
  LIGHT: "light",
};
