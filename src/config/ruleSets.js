/**
 * Game rule set configurations (REFACTORED)
 * Each rule set defines how tricks are evaluated and winners determined
 * Extracted common logic to reduce duplication and improve maintainability
 */

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gets the lead suit from the cards played
 * @param {Object} cards - Object mapping playerId to card
 * @param {string} leadPlayerId - ID of the player who led the trick
 * @returns {string} The suit of the lead card
 */
const getLeadSuit = (cards, leadPlayerId) => {
  const cardEntries = Object.entries(cards);

  // Use explicit leadPlayerId if provided
  if (leadPlayerId && cards[leadPlayerId]) {
    return cards[leadPlayerId].suit;
  }

  // Fallback to first card for backward compatibility
  if (cardEntries.length > 0) {
    return cardEntries[0][1].suit;
  }

  return null;
};

/**
 * Finds the player with the highest card value in a specific suit
 * @param {Array} cardEntries - Array of [playerId, card] entries
 * @param {string} targetSuit - The suit to filter by
 * @returns {string|null} The winning player's ID or null if no cards match
 */
const findHighestInSuit = (cardEntries, targetSuit) => {
  let maxValue = 0;
  let winner = null;

  cardEntries.forEach(([playerId, card]) => {
    if (card.suit === targetSuit && card.value > maxValue) {
      maxValue = card.value;
      winner = playerId;
    }
  });

  return winner;
};

/**
 * Finds the player with the highest card value overall
 * @param {Array} cardEntries - Array of [playerId, card] entries
 * @returns {string} The winning player's ID
 */
const findHighestCard = (cardEntries) => {
  let maxValue = 0;
  let winner = cardEntries[0][0]; // Default to first player

  cardEntries.forEach(([playerId, card]) => {
    if (card.value > maxValue) {
      maxValue = card.value;
      winner = playerId;
    }
  });

  return winner;
};

/**
 * Filters cards by suit
 * @param {Array} cardEntries - Array of [playerId, card] entries
 * @param {string} suit - Suit to filter by
 * @returns {Array} Filtered card entries
 */
const filterBySuit = (cardEntries, suit) => cardEntries.filter(([, card]) => card.suit === suit);

/**
 * Gets the default winner (first player or leadPlayerId)
 * @param {Object} cards - Object mapping playerId to card
 * @param {string} leadPlayerId - ID of the player who led the trick
 * @returns {string} Default winner player ID
 */
const getDefaultWinner = (cards, leadPlayerId) => {
  if (leadPlayerId && cards[leadPlayerId]) {
    return leadPlayerId;
  }
  const cardEntries = Object.entries(cards);
  return cardEntries.length > 0 ? cardEntries[0][0] : null;
};

// ============================================================================
// RULE SETS
// ============================================================================

const ruleSets = [
  {
    id: "highest-card",
    name: "Highest Card Wins",
    description: "The highest card value wins the trick",
    /**
     * Evaluates trick winner based on highest card value
     * @param {Object} cards - Object mapping playerId to card
     * @param {string} leadPlayerId - The ID of the player who led the trick (unused for this rule)
     * @returns {string} The winning player's ID
     */
    evaluateWinner: (cards, leadPlayerId) => {
      const cardEntries = Object.entries(cards);

      if (cardEntries.length === 0) {
        return getDefaultWinner(cards, leadPlayerId);
      }

      return findHighestCard(cardEntries);
    },
  },

  {
    id: "suit-follows",
    name: "Suit Follows",
    description: "Must follow lead suit, highest of lead suit wins",
    /**
     * Evaluates trick winner - must follow lead suit
     * Only cards matching the lead suit can win
     * @param {Object} cards - Object mapping playerId to card
     * @param {string} leadPlayerId - The ID of the player who led the trick
     * @returns {string} The winning player's ID
     */
    evaluateWinner: (cards, leadPlayerId) => {
      const cardEntries = Object.entries(cards);

      if (cardEntries.length === 0) {
        return getDefaultWinner(cards, leadPlayerId);
      }

      // Get the suit of the card that was led
      const leadSuit = getLeadSuit(cards, leadPlayerId);

      if (!leadSuit) {
        return getDefaultWinner(cards, leadPlayerId);
      }

      // Find highest card in the lead suit
      const winner = findHighestInSuit(cardEntries, leadSuit);

      // Return winner or default to lead player if no valid winner found
      return winner || getDefaultWinner(cards, leadPlayerId);
    },
  },

  {
    id: "spades-trump",
    name: "Spades Trump",
    description: "Spades are trump cards and beat all other suits",
    /**
     * Evaluates trick winner with spades as trump
     * Spades beat all other suits, regardless of value
     * If no spades, highest card of lead suit wins
     * @param {Object} cards - Object mapping playerId to card
     * @param {string} leadPlayerId - The ID of the player who led the trick
     * @returns {string} The winning player's ID
     */
    evaluateWinner: (cards, leadPlayerId) => {
      const cardEntries = Object.entries(cards);

      if (cardEntries.length === 0) {
        return getDefaultWinner(cards, leadPlayerId);
      }

      // Check for spades (trump suit)
      const spadesCards = filterBySuit(cardEntries, "spades");

      // If any spades were played, highest spade wins
      if (spadesCards.length > 0) {
        return findHighestCard(spadesCards);
      }

      // No spades, so highest card of lead suit wins
      const leadSuit = getLeadSuit(cards, leadPlayerId);

      if (!leadSuit) {
        return getDefaultWinner(cards, leadPlayerId);
      }

      const winner = findHighestInSuit(cardEntries, leadSuit);

      // Return winner or default to lead player if no valid winner found
      return winner || getDefaultWinner(cards, leadPlayerId);
    },
  },
];

// ============================================================================
// EXPORTS
// ============================================================================

export default ruleSets;

// Export helper functions for testing
export {
  getLeadSuit,
  findHighestInSuit,
  findHighestCard,
  filterBySuit,
  getDefaultWinner,
};
