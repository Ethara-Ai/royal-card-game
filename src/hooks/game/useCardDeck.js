/**
 * Card Deck Management Hook
 * Handles deck creation, shuffling, and card operations
 */

import { useCallback } from "react";
import { SUITS } from "../../constants";

/**
 * Custom hook for managing card deck operations
 * @returns {Object} Deck management functions
 */
export const useCardDeck = () => {
  /**
   * Shuffles an array of cards using Fisher-Yates algorithm
   * @param {Array} cards - Array of card objects
   * @returns {Array} Shuffled array of cards
   */
  const shuffleDeck = useCallback((cards) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  /**
   * Creates a standard 52-card deck
   * @returns {Array} Array of card objects
   */
  const createStandardDeck = useCallback(() => {
    const newDeck = [];
    SUITS.forEach((suit) => {
      for (let rank = 1; rank <= 13; rank++) {
        newDeck.push({
          id: `${suit}-${rank}`,
          suit,
          rank,
          value: rank === 1 ? 14 : rank, // Ace is highest
        });
      }
    });
    return newDeck;
  }, []);

  /**
   * Creates and shuffles a new deck of cards
   * @returns {Array} Shuffled deck of cards
   */
  const createDeck = useCallback(() => {
    const deck = createStandardDeck();
    return shuffleDeck(deck);
  }, [createStandardDeck, shuffleDeck]);

  /**
   * Gets a random card from an array of cards
   * @param {Array} cards - Array of card objects
   * @returns {Object|null} Random card or null if array is empty
   */
  const getRandomCard = useCallback((cards) => {
    if (!cards || cards.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex];
  }, []);

  /**
   * Deals cards from a deck to multiple recipients
   * @param {Array} deck - Array of card objects
   * @param {number} numRecipients - Number of recipients
   * @param {number} cardsPerRecipient - Cards per recipient
   * @returns {Array} Array of card arrays for each recipient
   */
  const dealCards = useCallback((deck, numRecipients, cardsPerRecipient) => {
    const dealt = [];
    for (let i = 0; i < numRecipients; i++) {
      const startIndex = i * cardsPerRecipient;
      const endIndex = startIndex + cardsPerRecipient;
      dealt.push(deck.slice(startIndex, endIndex));
    }
    return dealt;
  }, []);

  /**
   * Splits a deck into multiple piles
   * @param {Array} deck - Array of card objects
   * @param {number} numPiles - Number of piles to create
   * @returns {Array} Array of card arrays (piles)
   */
  const splitDeck = useCallback((deck, numPiles) => {
    const pileSize = Math.floor(deck.length / numPiles);
    const piles = [];

    for (let i = 0; i < numPiles; i++) {
      const startIndex = i * pileSize;
      const endIndex = i === numPiles - 1 ? deck.length : startIndex + pileSize;
      piles.push(deck.slice(startIndex, endIndex));
    }

    return piles;
  }, []);

  /**
   * Gets cards by suit from a collection
   * @param {Array} cards - Array of card objects
   * @param {string} suit - Suit to filter by
   * @returns {Array} Cards of the specified suit
   */
  const getCardsBySuit = useCallback(
    (cards, suit) => cards.filter((card) => card.suit === suit),
    [],
  );

  /**
   * Gets cards by rank from a collection
   * @param {Array} cards - Array of card objects
   * @param {number} rank - Rank to filter by
   * @returns {Array} Cards of the specified rank
   */
  const getCardsByRank = useCallback(
    (cards, rank) => cards.filter((card) => card.rank === rank),
    [],
  );

  /**
   * Sorts cards by value (descending)
   * @param {Array} cards - Array of card objects
   * @returns {Array} Sorted cards
   */
  const sortCardsByValue = useCallback(
    (cards) => [...cards].sort((a, b) => b.value - a.value),
    [],
  );

  /**
   * Sorts cards by suit and then by value
   * @param {Array} cards - Array of card objects
   * @returns {Array} Sorted cards
   */
  const sortCardsBySuitAndValue = useCallback(
    (cards) =>
      [...cards].sort((a, b) => {
        if (a.suit !== b.suit) {
          return SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
        }
        return b.value - a.value;
      }),
    [],
  );

  /**
   * Finds a card by its ID
   * @param {Array} cards - Array of card objects
   * @param {string} cardId - Card ID to find
   * @returns {Object|undefined} Found card or undefined
   */
  const findCardById = useCallback(
    (cards, cardId) => cards.find((card) => card.id === cardId),
    [],
  );

  /**
   * Removes a card from a collection
   * @param {Array} cards - Array of card objects
   * @param {string} cardId - Card ID to remove
   * @returns {Array} New array without the card
   */
  const removeCard = useCallback(
    (cards, cardId) => cards.filter((card) => card.id !== cardId),
    [],
  );

  /**
   * Gets the highest card by value
   * @param {Array} cards - Array of card objects
   * @returns {Object|null} Highest card or null if empty
   */
  const getHighestCard = useCallback((cards) => {
    if (!cards || cards.length === 0) return null;
    return cards.reduce((highest, card) =>
      card.value > highest.value ? card : highest,
    );
  }, []);

  /**
   * Gets the lowest card by value
   * @param {Array} cards - Array of card objects
   * @returns {Object|null} Lowest card or null if empty
   */
  const getLowestCard = useCallback((cards) => {
    if (!cards || cards.length === 0) return null;
    return cards.reduce((lowest, card) =>
      card.value < lowest.value ? card : lowest,
    );
  }, []);

  /**
   * Checks if a collection contains a specific card
   * @param {Array} cards - Array of card objects
   * @param {string} cardId - Card ID to check
   * @returns {boolean} True if card exists
   */
  const hasCard = useCallback(
    (cards, cardId) => cards.some((card) => card.id === cardId),
    [],
  );

  /**
   * Gets card display name (e.g., "Ace of Spades")
   * @param {Object} card - Card object
   * @returns {string} Display name
   */
  const getCardName = useCallback((card) => {
    const rankNames = {
      1: "Ace",
      11: "Jack",
      12: "Queen",
      13: "King",
    };

    const rankName = rankNames[card.rank] || card.rank.toString();
    const suitName = card.suit.charAt(0).toUpperCase() + card.suit.slice(1);

    return `${rankName} of ${suitName}`;
  }, []);

  return {
    // Deck operations
    createDeck,
    createStandardDeck,
    shuffleDeck,
    dealCards,
    splitDeck,

    // Card selection
    getRandomCard,
    findCardById,
    getHighestCard,
    getLowestCard,

    // Filtering
    getCardsBySuit,
    getCardsByRank,

    // Sorting
    sortCardsByValue,
    sortCardsBySuitAndValue,

    // Utilities
    removeCard,
    hasCard,
    getCardName,
  };
};

export default useCardDeck;
