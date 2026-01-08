import { useContext } from "react";
import GameContext from "./GameContext";

/**
 * Hook to access game context
 * @returns {Object} Game state, players, and handler functions
 * @throws {Error} If used outside of GameProvider
 */
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export default useGame;
