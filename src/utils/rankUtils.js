/**
 * Utility functions for player ranking
 */

/**
 * Calculate player rank based on scores
 * @param {Array} players - Array of player objects
 * @param {Array} scores - Array of scores corresponding to players
 * @param {number} playerIndex - Index of the player to get rank for
 * @returns {number|null} - 1-based rank or null if not calculable
 */
export const calculatePlayerRank = (players, scores, playerIndex) => {
  if (!scores?.length || !players?.length) return null;

  const playerScores = players.map((_, idx) => ({
    index: idx,
    score: scores[idx] || 0,
  }));

  // Sort by score descending
  playerScores.sort((a, b) => b.score - a.score);

  // Find rank (1-based), handling ties
  let rank = 1;
  for (let i = 0; i < playerScores.length; i++) {
    if (i > 0 && playerScores[i].score < playerScores[i - 1].score) {
      rank = i + 1;
    }
    if (playerScores[i].index === playerIndex) {
      return rank;
    }
  }
  return null;
};
