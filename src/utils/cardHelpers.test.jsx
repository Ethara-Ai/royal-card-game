/**
 * Unit tests for cardHelpers utility functions
 * Tests getSuitIcon, getRankDisplay, and getCardColor functions
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { getSuitIcon, getRankDisplay, getCardColor } from "./cardHelpers";

describe("cardHelpers", () => {
  describe("getSuitIcon", () => {
    it("should return a hearts icon for hearts suit", () => {
      const icon = getSuitIcon("hearts");
      const { container } = render(icon);
      expect(container.querySelector("svg")).toBeInTheDocument();
      expect(container.firstChild).toHaveStyle({
        color: "var(--color-card-red)",
      });
    });

    it("should return a diamonds icon for diamonds suit", () => {
      const icon = getSuitIcon("diamonds");
      const { container } = render(icon);
      expect(container.querySelector("svg")).toBeInTheDocument();
      expect(container.firstChild).toHaveStyle({
        color: "var(--color-card-red)",
      });
    });

    it("should return a clubs icon for clubs suit", () => {
      const icon = getSuitIcon("clubs");
      const { container } = render(icon);
      expect(container.querySelector("svg")).toBeInTheDocument();
      expect(container.firstChild).toHaveStyle({
        color: "var(--color-card-black)",
      });
    });

    it("should return a spades icon for spades suit", () => {
      const icon = getSuitIcon("spades");
      const { container } = render(icon);
      expect(container.querySelector("svg")).toBeInTheDocument();
      expect(container.firstChild).toHaveStyle({
        color: "var(--color-card-black)",
      });
    });

    it("should return undefined for invalid suit", () => {
      const icon = getSuitIcon("invalid");
      expect(icon).toBeUndefined();
    });

    it("should return undefined for empty string", () => {
      const icon = getSuitIcon("");
      expect(icon).toBeUndefined();
    });

    it("should return undefined for null", () => {
      const icon = getSuitIcon(null);
      expect(icon).toBeUndefined();
    });

    it("should return undefined for undefined", () => {
      const icon = getSuitIcon(undefined);
      expect(icon).toBeUndefined();
    });

    it("should be case sensitive - uppercase should not work", () => {
      const icon = getSuitIcon("HEARTS");
      expect(icon).toBeUndefined();
    });

    it("should use correct red color variable for hearts", () => {
      const icon = getSuitIcon("hearts");
      const { container } = render(icon);
      expect(container.firstChild).toHaveStyle({
        color: "var(--color-card-red)",
      });
    });

    it("should use correct black color variable for spades", () => {
      const icon = getSuitIcon("spades");
      const { container } = render(icon);
      expect(container.firstChild).toHaveStyle({
        color: "var(--color-card-black)",
      });
    });
  });

  describe("getRankDisplay", () => {
    it("should return 'A' for rank 1 (Ace)", () => {
      expect(getRankDisplay(1)).toBe("A");
    });

    it("should return '2' for rank 2", () => {
      expect(getRankDisplay(2)).toBe("2");
    });

    it("should return '3' for rank 3", () => {
      expect(getRankDisplay(3)).toBe("3");
    });

    it("should return '4' for rank 4", () => {
      expect(getRankDisplay(4)).toBe("4");
    });

    it("should return '5' for rank 5", () => {
      expect(getRankDisplay(5)).toBe("5");
    });

    it("should return '6' for rank 6", () => {
      expect(getRankDisplay(6)).toBe("6");
    });

    it("should return '7' for rank 7", () => {
      expect(getRankDisplay(7)).toBe("7");
    });

    it("should return '8' for rank 8", () => {
      expect(getRankDisplay(8)).toBe("8");
    });

    it("should return '9' for rank 9", () => {
      expect(getRankDisplay(9)).toBe("9");
    });

    it("should return '10' for rank 10", () => {
      expect(getRankDisplay(10)).toBe("10");
    });

    it("should return 'J' for rank 11 (Jack)", () => {
      expect(getRankDisplay(11)).toBe("J");
    });

    it("should return 'Q' for rank 12 (Queen)", () => {
      expect(getRankDisplay(12)).toBe("Q");
    });

    it("should return 'K' for rank 13 (King)", () => {
      expect(getRankDisplay(13)).toBe("K");
    });

    it("should return string representation for invalid positive numbers", () => {
      expect(getRankDisplay(14)).toBe("14");
      expect(getRankDisplay(0)).toBe("0");
      expect(getRankDisplay(-1)).toBe("-1");
    });

    it("should handle all face cards correctly", () => {
      const faceCards = [
        { rank: 1, expected: "A" },
        { rank: 11, expected: "J" },
        { rank: 12, expected: "Q" },
        { rank: 13, expected: "K" },
      ];

      faceCards.forEach(({ rank, expected }) => {
        expect(getRankDisplay(rank)).toBe(expected);
      });
    });

    it("should handle all number cards correctly", () => {
      for (let rank = 2; rank <= 10; rank++) {
        expect(getRankDisplay(rank)).toBe(rank.toString());
      }
    });

    it("should convert number to string for non-face cards", () => {
      const result = getRankDisplay(5);
      expect(typeof result).toBe("string");
    });
  });

  describe("getCardColor", () => {
    it("should return red color for hearts", () => {
      expect(getCardColor("hearts")).toBe("var(--color-card-red)");
    });

    it("should return red color for diamonds", () => {
      expect(getCardColor("diamonds")).toBe("var(--color-card-red)");
    });

    it("should return black color for clubs", () => {
      expect(getCardColor("clubs")).toBe("var(--color-card-black)");
    });

    it("should return black color for spades", () => {
      expect(getCardColor("spades")).toBe("var(--color-card-black)");
    });

    it("should return black color for invalid suit", () => {
      expect(getCardColor("invalid")).toBe("var(--color-card-black)");
    });

    it("should return black color for empty string", () => {
      expect(getCardColor("")).toBe("var(--color-card-black)");
    });

    it("should return black color for null", () => {
      expect(getCardColor(null)).toBe("var(--color-card-black)");
    });

    it("should return black color for undefined", () => {
      expect(getCardColor(undefined)).toBe("var(--color-card-black)");
    });

    it("should be case sensitive", () => {
      expect(getCardColor("HEARTS")).toBe("var(--color-card-black)");
      expect(getCardColor("Hearts")).toBe("var(--color-card-black)");
    });

    it("should consistently return CSS variable format", () => {
      const suits = ["hearts", "diamonds", "clubs", "spades"];
      suits.forEach((suit) => {
        const color = getCardColor(suit);
        expect(color).toMatch(/^var\(--color-card-(red|black)\)$/);
      });
    });

    it("should return correct colors for red suits", () => {
      const redSuits = ["hearts", "diamonds"];
      redSuits.forEach((suit) => {
        expect(getCardColor(suit)).toBe("var(--color-card-red)");
      });
    });

    it("should return correct colors for black suits", () => {
      const blackSuits = ["clubs", "spades"];
      blackSuits.forEach((suit) => {
        expect(getCardColor(suit)).toBe("var(--color-card-black)");
      });
    });
  });

  describe("integration tests", () => {
    it("should correctly style a hearts card", () => {
      const suit = "hearts";
      const rank = 1;

      const icon = getSuitIcon(suit);
      const displayRank = getRankDisplay(rank);
      const color = getCardColor(suit);

      expect(displayRank).toBe("A");
      expect(color).toBe("var(--color-card-red)");
      expect(icon).toBeDefined();
    });

    it("should correctly style a spades card", () => {
      const suit = "spades";
      const rank = 13;

      const icon = getSuitIcon(suit);
      const displayRank = getRankDisplay(rank);
      const color = getCardColor(suit);

      expect(displayRank).toBe("K");
      expect(color).toBe("var(--color-card-black)");
      expect(icon).toBeDefined();
    });

    it("should correctly style a diamonds card", () => {
      const suit = "diamonds";
      const rank = 12;

      const icon = getSuitIcon(suit);
      const displayRank = getRankDisplay(rank);
      const color = getCardColor(suit);

      expect(displayRank).toBe("Q");
      expect(color).toBe("var(--color-card-red)");
      expect(icon).toBeDefined();
    });

    it("should correctly style a clubs card", () => {
      const suit = "clubs";
      const rank = 11;

      const icon = getSuitIcon(suit);
      const displayRank = getRankDisplay(rank);
      const color = getCardColor(suit);

      expect(displayRank).toBe("J");
      expect(color).toBe("var(--color-card-black)");
      expect(icon).toBeDefined();
    });

    it("should handle a complete deck of cards", () => {
      const suits = ["hearts", "diamonds", "clubs", "spades"];

      suits.forEach((suit) => {
        for (let rank = 1; rank <= 13; rank++) {
          const icon = getSuitIcon(suit);
          const displayRank = getRankDisplay(rank);
          const color = getCardColor(suit);

          expect(icon).toBeDefined();
          expect(displayRank).toBeDefined();
          expect(color).toMatch(/^var\(--color-card-(red|black)\)$/);
        }
      });
    });
  });
});
