/**
 * Game rule set configurations
 * Each rule set defines how tricks are evaluated and winners determined
 */

const ruleSets = [
  {
    id: "highest-card",
    name: "Highest Card Wins",
    description: "The highest card value wins the trick",
    /**
     * Evaluates trick winner based on highest card value
     * @param {Object} cards - Object mapping playerId to card
     * @returns {string} The winning player's ID
     */
    evaluateWinner: (cards) => {
      let maxValue = 0;
      let winner = "";
      Object.entries(cards).forEach(([playerId, card]) => {
        if (card.value > maxValue) {
          maxValue = card.value;
          winner = playerId;
        }
      });
      return winner;
    },
  },
  {
    id: "suit-follows",
    name: "Suit Follows",
    description: "Must follow lead suit, highest of lead suit wins",
    /**
     * Evaluates trick winner - must follow lead suit
     * @param {Object} cards - Object mapping playerId to card
     * @returns {string} The winning player's ID
     */
    evaluateWinner: (cards) => {
      const cardEntries = Object.entries(cards);
      const leadCard = cardEntries[0][1];
      const leadSuit = leadCard.suit;
      let maxValue = 0;
      let winner = cardEntries[0][0];
      cardEntries.forEach(([playerId, card]) => {
        if (card.suit === leadSuit && card.value > maxValue) {
          maxValue = card.value;
          winner = playerId;
        }
      });
      return winner;
    },
  },
  {
    id: "spades-trump",
    name: "Spades Trump",
    description: "Spades are trump cards and beat all other suits",
    /**
     * Evaluates trick winner with spades as trump
     * @param {Object} cards - Object mapping playerId to card
     * @returns {string} The winning player's ID
     */
    evaluateWinner: (cards) => {
      const cardEntries = Object.entries(cards);
      const leadCard = cardEntries[0][1];
      const leadSuit = leadCard.suit;

      // Check for spades (trump)
      const spadesCards = cardEntries.filter(
        ([, card]) => card.suit === "spades"
      );

      if (spadesCards.length > 0) {
        let maxSpade = 0;
        let winner = spadesCards[0][0];
        spadesCards.forEach(([playerId, card]) => {
          if (card.value > maxSpade) {
            maxSpade = card.value;
            winner = playerId;
          }
        });
        return winner;
      }

      // No spades, highest of lead suit wins
      let maxValue = 0;
      let winner = cardEntries[0][0];
      cardEntries.forEach(([playerId, card]) => {
        if (card.suit === leadSuit && card.value > maxValue) {
          maxValue = card.value;
          winner = playerId;
        }
      });
      return winner;
    },
  },
];

export default ruleSets;
