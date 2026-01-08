/**
 * Barrel export for custom hooks
 * Provides clean imports from a single entry point
 */

export { default as useGameLogic } from "./useGameLogic";
export { default as useTheme } from "./useTheme";
export { default as useWindowSize } from "./useWindowSize";
export { default as useAppLoading } from "./useAppLoading";
export { default as useDragAndDrop } from "./useDragAndDrop";
export { default as useTimeout } from "./useTimeout";

// Accessibility hooks
export {
  useKeyboardNavigation,
  useFocusTrap,
  useSkipLink,
} from "./accessibility/useKeyboardNavigation";

// Game hooks
export { default as usePlayers } from "./game/usePlayers";
export { default as useCardDeck } from "./game/useCardDeck";
export { default as useTrickEvaluation } from "./game/useTrickEvaluation";
export { useTouchGestures, useCardGestures } from "./game/useTouchGestures";
export {
  default as gameReducer,
  GAME_ACTIONS,
  gameActions,
  selectors,
} from "./game/gameReducer";
