/**
 * Game Context
 * Provides centralized game state management to reduce prop drilling
 * Wraps all game logic and makes it available throughout the component tree
 */

import { createContext, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import useGameLogic from "../hooks/useGameLogic";
import ruleSets from "../config/ruleSets";

/**
 * Game Context - holds all game state and actions
 */
const GameContext = createContext(null);

/**
 * Game Provider Component
 * Wraps the application and provides game state to all children
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {number} props.initialRuleSet - Initially selected rule set index
 */
export function GameProvider({ children, initialRuleSet = 1 }) {
  // Rule set selection managed at context level
  const [selectedRuleSet, setSelectedRuleSet] = useState(initialRuleSet);

  // Get all game logic from the custom hook
  const gameLogic = useGameLogic(selectedRuleSet);

  // Get current rule set info
  const currentRuleSet = useMemo(
    () => ruleSets[selectedRuleSet] || ruleSets[0],
    [selectedRuleSet],
  );

  // Safe rule set change handler
  const changeRuleSet = useCallback((newRuleSet) => {
    if (newRuleSet >= 0 && newRuleSet < ruleSets.length) {
      setSelectedRuleSet(newRuleSet);
    }
  }, []);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      // Game state and logic
      ...gameLogic,

      // Rule set management
      selectedRuleSet,
      setSelectedRuleSet: changeRuleSet,
      currentRuleSet,
      ruleSets,

      // Derived state helpers
      isGameActive:
        gameLogic.gameState.phase === "dealing" ||
        gameLogic.gameState.phase === "playing" ||
        gameLogic.gameState.phase === "evaluating",

      isPlayerTurn:
        gameLogic.gameState.phase === "playing" &&
        gameLogic.gameState.currentPlayer === 0 &&
        !gameLogic.dealingAnimation,
    }),
    [gameLogic, selectedRuleSet, changeRuleSet, currentRuleSet],
  );

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
}

GameProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialRuleSet: PropTypes.number,
};

export default GameContext;
