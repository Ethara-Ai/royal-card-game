/**
 * Card utility functions shared across components
 * Provides consistent card display and styling logic
 */
import { GiSpadeSkull, GiHearts, GiDiamonds, GiClubs } from "react-icons/gi";

/**
 * Returns the appropriate suit icon component for a given suit
 * @param {string} suit - The card suit (hearts, diamonds, clubs, spades)
 * @returns {JSX.Element} The suit icon component
 */
export const getSuitIcon = (suit) => {
  const icons = {
    hearts: <GiHearts style={{ color: "var(--color-card-red)" }} />,
    diamonds: <GiDiamonds style={{ color: "var(--color-card-red)" }} />,
    clubs: <GiClubs style={{ color: "var(--color-card-black)" }} />,
    spades: <GiSpadeSkull style={{ color: "var(--color-card-black)" }} />,
  };
  return icons[suit];
};

/**
 * Converts a numeric rank to its display string
 * @param {number} rank - The card rank (1-13)
 * @returns {string} The display string (A, 2-10, J, Q, K)
 */
export const getRankDisplay = (rank) => {
  const rankNames = { 1: "A", 11: "J", 12: "Q", 13: "K" };
  return rankNames[rank] || rank.toString();
};

/**
 * Returns the appropriate color CSS variable for a given suit
 * @param {string} suit - The card suit
 * @returns {string} The CSS variable for the card color
 */
export const getCardColor = (suit) => suit === "hearts" || suit === "diamonds"
    ? "var(--color-card-red)"
    : "var(--color-card-black)";
