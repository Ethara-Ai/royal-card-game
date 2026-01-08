/**
 * Trick Evaluation Hook
 * Handles trick evaluation, winner determination, and play area management
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { GAME_PHASES, ANIMATION_TIMINGS } from '../../constants';
import ruleSets from '../../config/ruleSets';
import { getPlayerDisplayName } from '../../utils/playerUtils';

/**
 * Custom hook for managing trick evaluation
 * @param {Object} options - Configuration options
 * @param {number} options.selectedRuleSet - Index of selected rule set
 * @param {Array} options.players - Array of player objects
 * @param {Function} options.onTrickComplete - Callback when trick completes
 * @param {Function} options.onGameOver - Callback when game ends
 * @param {Function} options.safeSetTimeout - Safe timeout function
 * @returns {Object} Trick evaluation state and functions
 */
export const useTrickEvaluation = ({
  selectedRuleSet = 0,
  players = [],
  onTrickComplete,
  onGameOver,
  safeSetTimeout,
} = {}) => {
  const [playArea, setPlayArea] = useState({});
  const [leadPlayerId, setLeadPlayerId] = useState(null);
  const [trickWinner, setTrickWinner] = useState(null);

  /**
   * Adds a card to the play area
   * @param {string} playerId - ID of the player playing the card
   * @param {Object} card - Card object being played
   */
  const playCardToArea = useCallback((playerId, card) => {
    setPlayArea((prev) => {
      const newPlayArea = { ...prev, [playerId]: card };

      // Set lead player if this is the first card
      if (Object.keys(prev).length === 0) {
        setLeadPlayerId(playerId);
      }

      return newPlayArea;
    });
  }, []);

  /**
   * Clears the play area
   */
  const clearPlayArea = useCallback(() => {
    setPlayArea({});
    setLeadPlayerId(null);
  }, []);

  /**
   * Gets the number of cards in play area
   * @returns {number} Count of cards in play area
   */
  const getPlayAreaCardCount = useCallback(() => Object.keys(playArea).length, [playArea]);

  /**
   * Checks if play area is full (4 cards)
   * @returns {boolean} True if 4 cards are played
   */
  const isPlayAreaFull = useCallback(() => Object.keys(playArea).length === 4, [playArea]);

  /**
   * Gets cards in play area as entries
   * @returns {Array} Array of [playerId, card] pairs
   */
  const getPlayAreaCards = useCallback(() => Object.entries(playArea), [playArea]);

  /**
   * Gets the lead suit for the current trick
   * @returns {string|null} Suit of the lead card or null
   */
  const getLeadSuit = useCallback(() => {
    if (!leadPlayerId || !playArea[leadPlayerId]) return null;
    return playArea[leadPlayerId].suit;
  }, [leadPlayerId, playArea]);

  /**
   * Checks if a player has played a card in current trick
   * @param {string} playerId - Player ID to check
   * @returns {boolean} True if player has played
   */
  const hasPlayerPlayed = useCallback(
    (playerId) => playerId in playArea,
    [playArea],
  );

  /**
   * Gets the card played by a specific player
   * @param {string} playerId - Player ID
   * @returns {Object|null} Card object or null
   */
  const getPlayerCard = useCallback(
    (playerId) => playArea[playerId] || null,
    [playArea],
  );

  /**
   * Evaluates the current trick and determines the winner
   * @param {Object} trickCards - Cards played in the trick (defaults to current playArea)
   * @param {boolean} isLastTrick - Whether this is the final trick
   * @param {Function} setGamePhase - Function to update game phase
   * @param {Function} setCurrentPlayer - Function to set current player
   * @param {Function} updateScores - Function to update player scores
   * @returns {Promise} Promise that resolves when evaluation completes
   */
  const evaluateTrick = useCallback(
    (trickCards, isLastTrick, setGamePhase, setCurrentPlayer, updateScores) => new Promise((resolve) => {
        // Use provided cards or current play area
        const cardsToEvaluate = trickCards || playArea;

        // Set game phase to evaluating
        setGamePhase(GAME_PHASES.EVALUATING);

        // Determine winner using rule set
        const winnerPlayerId = ruleSets[selectedRuleSet].evaluateWinner(
          cardsToEvaluate,
          leadPlayerId,
        );

        const winnerIndex = players.findIndex((p) => p.id === winnerPlayerId);
        const winnerPlayer = players[winnerIndex];
        const winnerDisplayName = getPlayerDisplayName(winnerPlayer);

        // Set trick winner for visual feedback
        setTrickWinner(winnerPlayerId);
        toast.success(`${winnerDisplayName} wins the trick!`);

        // Delay before clearing play area
        safeSetTimeout(() => {
          // Update score
          updateScores(winnerIndex, 1);

          // Set winner as next player
          setCurrentPlayer(winnerIndex);

          // Clear play area and reset
          clearPlayArea();
          setTrickWinner(null);

          // Check if game is over
          if (isLastTrick) {
            setGamePhase(GAME_PHASES.GAME_OVER);
            if (onGameOver) {
              onGameOver(winnerIndex);
            }
          } else {
            setGamePhase(GAME_PHASES.PLAYING);
            if (onTrickComplete) {
              onTrickComplete(winnerIndex, winnerPlayerId);
            }
          }

          resolve(winnerIndex);
        }, ANIMATION_TIMINGS.trickEvaluationDelay);
      }),
    [
      playArea,
      selectedRuleSet,
      leadPlayerId,
      players,
      clearPlayArea,
      onTrickComplete,
      onGameOver,
      safeSetTimeout,
    ],
  );

  /**
   * Quick evaluation without animation delays (for testing)
   * @param {Object} trickCards - Cards played in the trick
   * @returns {string} Winner player ID
   */
  const quickEvaluate = useCallback(
    (trickCards) => {
      const cardsToEvaluate = trickCards || playArea;
      return ruleSets[selectedRuleSet].evaluateWinner(
        cardsToEvaluate,
        leadPlayerId,
      );
    },
    [playArea, selectedRuleSet, leadPlayerId],
  );

  /**
   * Gets the current trick winner preview (before evaluation completes)
   * @returns {string|null} Predicted winner player ID or null
   */
  const predictWinner = useCallback(() => {
    if (Object.keys(playArea).length === 0) return null;
    return ruleSets[selectedRuleSet].evaluateWinner(playArea, leadPlayerId);
  }, [playArea, selectedRuleSet, leadPlayerId]);

  /**
   * Checks if it's the last trick (all players have only 1 card left)
   * @param {string} playerId - Player ID to check
   * @returns {boolean} True if this is the last trick
   */
  const isLastTrickCheck = useCallback(
    (playerId) => {
      const player = players.find((p) => p.id === playerId);
      return player && player.hand.length === 1;
    },
    [players],
  );

  /**
   * Resets trick state
   */
  const resetTrick = useCallback(() => {
    setPlayArea({});
    setLeadPlayerId(null);
    setTrickWinner(null);
  }, []);

  return {
    // State
    playArea,
    leadPlayerId,
    trickWinner,

    // Setters
    setPlayArea,
    setLeadPlayerId,
    setTrickWinner,

    // Play area operations
    playCardToArea,
    clearPlayArea,
    getPlayAreaCardCount,
    isPlayAreaFull,
    getPlayAreaCards,
    hasPlayerPlayed,
    getPlayerCard,
    getLeadSuit,

    // Evaluation
    evaluateTrick,
    quickEvaluate,
    predictWinner,
    isLastTrickCheck,

    // Reset
    resetTrick,
  };
};

export default useTrickEvaluation;
