/**
 * Game State Reducer
 * Manages all game state transitions in a predictable, centralized way
 * Uses the reducer pattern for complex state management
 */

import { INITIAL_GAME_STATE, GAME_PHASES } from "../../constants";

// ============================================================================
// ACTION TYPES
// ============================================================================

export const GAME_ACTIONS = {
  // Game lifecycle
  START_GAME: "START_GAME",
  RESET_GAME: "RESET_GAME",

  // Phase transitions
  SET_PHASE: "SET_PHASE",
  START_DEALING: "START_DEALING",
  FINISH_DEALING: "FINISH_DEALING",
  START_PLAYING: "START_PLAYING",
  START_EVALUATING: "START_EVALUATING",
  END_GAME: "END_GAME",

  // Player actions
  SET_CURRENT_PLAYER: "SET_CURRENT_PLAYER",
  NEXT_PLAYER: "NEXT_PLAYER",

  // Card actions
  PLAY_CARD: "PLAY_CARD",
  CLEAR_PLAY_AREA: "CLEAR_PLAY_AREA",
  SET_LEAD_PLAYER: "SET_LEAD_PLAYER",

  // Score management
  UPDATE_SCORE: "UPDATE_SCORE",
  UPDATE_SCORES: "UPDATE_SCORES",

  // Trick management
  SET_TRICK_WINNER: "SET_TRICK_WINNER",
  CLEAR_TRICK_WINNER: "CLEAR_TRICK_WINNER",

  // UI state
  SET_DEALING_ANIMATION: "SET_DEALING_ANIMATION",
  SET_DRAGGED_CARD: "SET_DRAGGED_CARD",
  CLEAR_DRAGGED_CARD: "CLEAR_DRAGGED_CARD",
  SET_SHOW_WINNER_MODAL: "SET_SHOW_WINNER_MODAL",
  SET_SHOW_CONFETTI: "SET_SHOW_CONFETTI",

  // Touch interaction
  SET_TOUCH_START_POS: "SET_TOUCH_START_POS",
  CLEAR_TOUCH_START_POS: "CLEAR_TOUCH_START_POS",
  SET_IS_DRAGGING: "SET_IS_DRAGGING",
};

// ============================================================================
// INITIAL STATE
// ============================================================================

export const createInitialState = () => ({
  // Core game state
  gameState: { ...INITIAL_GAME_STATE },

  // Play area
  playArea: {},
  leadPlayerId: null,

  // UI state
  dealingAnimation: false,
  draggedCard: null,
  trickWinner: null,
  showWinnerModal: false,
  showConfetti: false,

  // Touch interaction
  touchStartPos: null,
  isDragging: false,
});

// ============================================================================
// REDUCER FUNCTION
// ============================================================================

/**
 * Game state reducer
 * @param {Object} state - Current state
 * @param {Object} action - Action with type and payload
 * @returns {Object} New state
 */
export const gameReducer = (state, action) => {
  switch (action.type) {
    // ------------------------------------------------------------------------
    // GAME LIFECYCLE
    // ------------------------------------------------------------------------

    case GAME_ACTIONS.START_GAME:
      return {
        ...state,
        gameState: {
          ...state.gameState,
          phase: GAME_PHASES.DEALING,
        },
        dealingAnimation: true,
        playArea: {},
        leadPlayerId: null,
        trickWinner: null,
      };

    case GAME_ACTIONS.RESET_GAME:
      return createInitialState();

    // ------------------------------------------------------------------------
    // PHASE TRANSITIONS
    // ------------------------------------------------------------------------

    case GAME_ACTIONS.SET_PHASE:
      return {
        ...state,
        gameState: {
          ...state.gameState,
          phase: action.payload,
        },
      };

    case GAME_ACTIONS.START_DEALING:
      return {
        ...state,
        gameState: {
          ...state.gameState,
          phase: GAME_PHASES.DEALING,
        },
        dealingAnimation: true,
      };

    case GAME_ACTIONS.FINISH_DEALING:
      return {
        ...state,
        dealingAnimation: false,
      };

    case GAME_ACTIONS.START_PLAYING:
      return {
        ...state,
        gameState: {
          ...state.gameState,
          phase: GAME_PHASES.PLAYING,
        },
        dealingAnimation: false,
      };

    case GAME_ACTIONS.START_EVALUATING:
      return {
        ...state,
        gameState: {
          ...state.gameState,
          phase: GAME_PHASES.EVALUATING,
        },
      };

    case GAME_ACTIONS.END_GAME:
      return {
        ...state,
        gameState: {
          ...state.gameState,
          phase: GAME_PHASES.GAME_OVER,
        },
      };

    // ------------------------------------------------------------------------
    // PLAYER ACTIONS
    // ------------------------------------------------------------------------

    case GAME_ACTIONS.SET_CURRENT_PLAYER:
      return {
        ...state,
        gameState: {
          ...state.gameState,
          currentPlayer: action.payload,
        },
      };

    case GAME_ACTIONS.NEXT_PLAYER:
      return {
        ...state,
        gameState: {
          ...state.gameState,
          currentPlayer: (state.gameState.currentPlayer + 1) % 4,
        },
      };

    // ------------------------------------------------------------------------
    // CARD ACTIONS
    // ------------------------------------------------------------------------

    case GAME_ACTIONS.PLAY_CARD:
      return {
        ...state,
        playArea: {
          ...state.playArea,
          [action.payload.playerId]: action.payload.card,
        },
        leadPlayerId: Object.keys(state.playArea).length === 0
          ? action.payload.playerId
          : state.leadPlayerId,
      };

    case GAME_ACTIONS.CLEAR_PLAY_AREA:
      return {
        ...state,
        playArea: {},
        leadPlayerId: null,
      };

    case GAME_ACTIONS.SET_LEAD_PLAYER:
      return {
        ...state,
        leadPlayerId: action.payload,
      };

    // ------------------------------------------------------------------------
    // SCORE MANAGEMENT
    // ------------------------------------------------------------------------

    case GAME_ACTIONS.UPDATE_SCORE:
      return {
        ...state,
        gameState: {
          ...state.gameState,
          scores: state.gameState.scores.map((score, idx) =>
            idx === action.payload.playerIndex
              ? score + action.payload.points
              : score
          ),
        },
      };

    case GAME_ACTIONS.UPDATE_SCORES:
      return {
        ...state,
        gameState: {
          ...state.gameState,
          scores: action.payload,
        },
      };

    // ------------------------------------------------------------------------
    // TRICK MANAGEMENT
    // ------------------------------------------------------------------------

    case GAME_ACTIONS.SET_TRICK_WINNER:
      return {
        ...state,
        trickWinner: action.payload,
      };

    case GAME_ACTIONS.CLEAR_TRICK_WINNER:
      return {
        ...state,
        trickWinner: null,
      };

    // ------------------------------------------------------------------------
    // UI STATE
    // ------------------------------------------------------------------------

    case GAME_ACTIONS.SET_DEALING_ANIMATION:
      return {
        ...state,
        dealingAnimation: action.payload,
      };

    case GAME_ACTIONS.SET_DRAGGED_CARD:
      return {
        ...state,
        draggedCard: action.payload,
      };

    case GAME_ACTIONS.CLEAR_DRAGGED_CARD:
      return {
        ...state,
        draggedCard: null,
      };

    case GAME_ACTIONS.SET_SHOW_WINNER_MODAL:
      return {
        ...state,
        showWinnerModal: action.payload,
      };

    case GAME_ACTIONS.SET_SHOW_CONFETTI:
      return {
        ...state,
        showConfetti: action.payload,
      };

    // ------------------------------------------------------------------------
    // TOUCH INTERACTION
    // ------------------------------------------------------------------------

    case GAME_ACTIONS.SET_TOUCH_START_POS:
      return {
        ...state,
        touchStartPos: action.payload,
        isDragging: true,
      };

    case GAME_ACTIONS.CLEAR_TOUCH_START_POS:
      return {
        ...state,
        touchStartPos: null,
        isDragging: false,
      };

    case GAME_ACTIONS.SET_IS_DRAGGING:
      return {
        ...state,
        isDragging: action.payload,
      };

    // ------------------------------------------------------------------------
    // DEFAULT
    // ------------------------------------------------------------------------

    default:
      console.warn(`Unknown action type: ${action.type}`);
      return state;
  }
};

// ============================================================================
// ACTION CREATORS
// ============================================================================

export const gameActions = {
  startGame: () => ({ type: GAME_ACTIONS.START_GAME }),
  resetGame: () => ({ type: GAME_ACTIONS.RESET_GAME }),

  setPhase: (phase) => ({ type: GAME_ACTIONS.SET_PHASE, payload: phase }),
  startDealing: () => ({ type: GAME_ACTIONS.START_DEALING }),
  finishDealing: () => ({ type: GAME_ACTIONS.FINISH_DEALING }),
  startPlaying: () => ({ type: GAME_ACTIONS.START_PLAYING }),
  startEvaluating: () => ({ type: GAME_ACTIONS.START_EVALUATING }),
  endGame: () => ({ type: GAME_ACTIONS.END_GAME }),

  setCurrentPlayer: (playerIndex) => ({
    type: GAME_ACTIONS.SET_CURRENT_PLAYER,
    payload: playerIndex
  }),
  nextPlayer: () => ({ type: GAME_ACTIONS.NEXT_PLAYER }),

  playCard: (playerId, card) => ({
    type: GAME_ACTIONS.PLAY_CARD,
    payload: { playerId, card }
  }),
  clearPlayArea: () => ({ type: GAME_ACTIONS.CLEAR_PLAY_AREA }),
  setLeadPlayer: (playerId) => ({
    type: GAME_ACTIONS.SET_LEAD_PLAYER,
    payload: playerId
  }),

  updateScore: (playerIndex, points) => ({
    type: GAME_ACTIONS.UPDATE_SCORE,
    payload: { playerIndex, points }
  }),
  updateScores: (scores) => ({
    type: GAME_ACTIONS.UPDATE_SCORES,
    payload: scores
  }),

  setTrickWinner: (playerId) => ({
    type: GAME_ACTIONS.SET_TRICK_WINNER,
    payload: playerId
  }),
  clearTrickWinner: () => ({ type: GAME_ACTIONS.CLEAR_TRICK_WINNER }),

  setDealingAnimation: (isDealing) => ({
    type: GAME_ACTIONS.SET_DEALING_ANIMATION,
    payload: isDealing
  }),
  setDraggedCard: (card) => ({
    type: GAME_ACTIONS.SET_DRAGGED_CARD,
    payload: card
  }),
  clearDraggedCard: () => ({ type: GAME_ACTIONS.CLEAR_DRAGGED_CARD }),
  setShowWinnerModal: (show) => ({
    type: GAME_ACTIONS.SET_SHOW_WINNER_MODAL,
    payload: show
  }),
  setShowConfetti: (show) => ({
    type: GAME_ACTIONS.SET_SHOW_CONFETTI,
    payload: show
  }),

  setTouchStartPos: (pos) => ({
    type: GAME_ACTIONS.SET_TOUCH_START_POS,
    payload: pos
  }),
  clearTouchStartPos: () => ({ type: GAME_ACTIONS.CLEAR_TOUCH_START_POS }),
  setIsDragging: (isDragging) => ({
    type: GAME_ACTIONS.SET_IS_DRAGGING,
    payload: isDragging
  }),
};

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Selector functions for accessing state
 */
export const selectors = {
  isWaiting: (state) => state.gameState.phase === GAME_PHASES.WAITING,
  isDealing: (state) => state.gameState.phase === GAME_PHASES.DEALING,
  isPlaying: (state) => state.gameState.phase === GAME_PHASES.PLAYING,
  isEvaluating: (state) => state.gameState.phase === GAME_PHASES.EVALUATING,
  isGameOver: (state) => state.gameState.phase === GAME_PHASES.GAME_OVER,

  currentPlayer: (state) => state.gameState.currentPlayer,
  scores: (state) => state.gameState.scores,

  playAreaCards: (state) => Object.entries(state.playArea),
  playAreaCardCount: (state) => Object.keys(state.playArea).length,
  isPlayAreaFull: (state) => Object.keys(state.playArea).length === 4,

  isPlayerTurn: (state, playerIndex) =>
    state.gameState.currentPlayer === playerIndex,

  canPlayCard: (state, playerIndex) =>
    state.gameState.phase === GAME_PHASES.PLAYING &&
    state.gameState.currentPlayer === playerIndex,
};

export default gameReducer;
