import { createContext } from "react";
import PropTypes from "prop-types";
import useGameLogic from "../hooks/useGameLogic";

/**
 * Context for game state and actions
 * Provides game state, players, and handlers to all components
 */
const GameContext = createContext(null);

/**
 * Provider component for game context
 * Wraps application to provide game state and actions
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {number} props.selectedRuleSet - Index of the selected rule set
 */
export const GameProvider = ({ children, selectedRuleSet }) => {
  const gameLogic = useGameLogic(selectedRuleSet);

  return (
    <GameContext.Provider value={gameLogic}>{children}</GameContext.Provider>
  );
};

GameProvider.propTypes = {
  children: PropTypes.node.isRequired,
  selectedRuleSet: PropTypes.number,
};

GameProvider.defaultProps = {
  selectedRuleSet: 0,
};

export default GameContext;
