/**
 * Game Context
 * Provides centralized game state management to reduce prop drilling
 * Wraps all game logic and makes it available throughout the component tree
 */

import { createContext } from "react";
import PropTypes from "prop-types";
import useGameLogic from "../hooks/useGameLogic";

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
 * @param {number} props.selectedRuleSet - Currently selected rule set index
 */
export function GameProvider({ children, selectedRuleSet = 0 }) {
  // Get all game logic from the custom hook
  const gameLogic = useGameLogic(selectedRuleSet);

  return (
    <GameContext.Provider value={gameLogic}>{children}</GameContext.Provider>
  );
}

GameProvider.propTypes = {
  children: PropTypes.node.isRequired,
  selectedRuleSet: PropTypes.number,
};

export default GameContext;
