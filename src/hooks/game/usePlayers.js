/**
 * Players Management Hook
 * Handles player state, username, and player-related operations
 */

import { useState, useMemo, useCallback } from 'react';
import { INITIAL_PLAYERS } from '../../constants';

/**
 * Custom hook for managing player state
 * @param {string} initialUsername - Initial username for player1
 * @returns {Object} Player state and management functions
 */
export const usePlayers = (initialUsername = '') => {
  const [username, setUsername] = useState(initialUsername);
  const [basePlayers, setBasePlayers] = useState(INITIAL_PLAYERS);

  // Compute players with username applied to player1
  const players = useMemo(
    () =>
      basePlayers.map((player) =>
        player.id === 'player1' && username.trim()
          ? { ...player, name: username.trim() }
          : player,
      ),
    [basePlayers, username],
  );

  /**
   * Update a specific player with new properties
   */
  const updatePlayer = useCallback((playerId, updates) => {
    setBasePlayers((prev) =>
      prev.map((player) =>
        player.id === playerId ? { ...player, ...updates } : player,
      ),
    );
  }, []);

  /**
   * Update a player's hand
   */
  const updatePlayerHand = useCallback((playerId, newHand) => {
    setBasePlayers((prev) =>
      prev.map((player) =>
        player.id === playerId ? { ...player, hand: newHand } : player,
      ),
    );
  }, []);

  /**
   * Remove a specific card from a player's hand
   */
  const removeCardFromHand = useCallback((playerId, cardId) => {
    setBasePlayers((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? { ...player, hand: player.hand.filter((c) => c.id !== cardId) }
          : player,
      ),
    );
  }, []);

  /**
   * Update a player's score
   */
  const updatePlayerScore = useCallback((playerId, score) => {
    setBasePlayers((prev) =>
      prev.map((player) =>
        player.id === playerId ? { ...player, score } : player,
      ),
    );
  }, []);

  /**
   * Increment a player's score
   */
  const incrementPlayerScore = useCallback((playerId, points = 1) => {
    setBasePlayers((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? { ...player, score: player.score + points }
          : player,
      ),
    );
  }, []);

  /**
   * Reset all players to initial state
   */
  const resetPlayers = useCallback(() => {
    setBasePlayers(INITIAL_PLAYERS.map((p) => ({ ...p, hand: [], score: 0 })));
  }, []);

  /**
   * Deal cards to all players
   */
  const dealCardsToPlayers = useCallback((deck, cardsPerPlayer) => {
    const newPlayers = basePlayers.map((player, index) => ({
      ...player,
      hand: deck.slice(index * cardsPerPlayer, (index + 1) * cardsPerPlayer),
      score: 0,
    }));
    setBasePlayers(newPlayers);
  }, [basePlayers]);

  /**
   * Get player by ID
   */
  const getPlayerById = useCallback(
    (playerId) => players.find((p) => p.id === playerId),
    [players],
  );

  /**
   * Get player by index
   */
  const getPlayerByIndex = useCallback(
    (index) => players[index],
    [players],
  );

  /**
   * Get player index by ID
   */
  const getPlayerIndexById = useCallback(
    (playerId) => players.findIndex((p) => p.id === playerId),
    [players],
  );

  /**
   * Check if a player has any cards left
   */
  const playerHasCards = useCallback(
    (playerId) => {
      const player = getPlayerById(playerId);
      return player && player.hand.length > 0;
    },
    [getPlayerById],
  );

  return {
    // State
    username,
    players,
    basePlayers,

    // Setters
    setUsername,
    setBasePlayers,

    // Actions
    updatePlayer,
    updatePlayerHand,
    removeCardFromHand,
    updatePlayerScore,
    incrementPlayerScore,
    resetPlayers,
    dealCardsToPlayers,

    // Getters
    getPlayerById,
    getPlayerByIndex,
    getPlayerIndexById,
    playerHasCards,
  };
};

export default usePlayers;
