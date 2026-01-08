/**
 * Utility functions for player-related operations
 */

/**
 * Formats a player's display name with "(You)" indicator if it's the human player
 * @param {Object} player - The player object
 * @param {string} player.id - The player's unique identifier
 * @param {string} player.name - The player's name
 * @returns {string} Formatted display name with "(You)" for human player
 */
export const getPlayerDisplayName = (player) => {
  if (!player || !player.name) {
    return "";
  }

  // player1 is always the human player
  if (player.id === "player1") {
    return `${player.name} (You)`;
  }

  return player.name;
};

/**
 * Checks if a player is the human player
 * @param {Object} player - The player object
 * @param {string} player.id - The player's unique identifier
 * @returns {boolean} True if the player is the human player
 */
export const isHumanPlayer = (player) => player?.id === "player1";

export default { getPlayerDisplayName, isHumanPlayer };
