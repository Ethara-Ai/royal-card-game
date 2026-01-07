/**
 * Unit tests for PlayedCard component
 * Tests card rendering, positioning, animation, and winner styling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PlayedCard from "../PlayedCard";

describe("PlayedCard", () => {
  const defaultProps = {
    card: {
      id: "hearts-5",
      suit: "hearts",
      rank: 5,
      value: 5,
    },
    position: {
      x: 10,
      y: 20,
      rotation: 5,
      zIndex: 2,
    },
    isWinner: false,
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("should render without crashing", () => {
      render(<PlayedCard {...defaultProps} />);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should display the correct rank for number cards", () => {
      render(<PlayedCard {...defaultProps} />);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should display 'A' for Ace (rank 1)", () => {
      const aceProps = {
        ...defaultProps,
        card: { id: "hearts-1", suit: "hearts", rank: 1, value: 14 },
      };
      render(<PlayedCard {...aceProps} />);
      expect(screen.getByText("A")).toBeInTheDocument();
    });

    it("should display 'J' for Jack (rank 11)", () => {
      const jackProps = {
        ...defaultProps,
        card: { id: "hearts-11", suit: "hearts", rank: 11, value: 11 },
      };
      render(<PlayedCard {...jackProps} />);
      expect(screen.getByText("J")).toBeInTheDocument();
    });

    it("should display 'Q' for Queen (rank 12)", () => {
      const queenProps = {
        ...defaultProps,
        card: { id: "hearts-12", suit: "hearts", rank: 12, value: 12 },
      };
      render(<PlayedCard {...queenProps} />);
      expect(screen.getByText("Q")).toBeInTheDocument();
    });

    it("should display 'K' for King (rank 13)", () => {
      const kingProps = {
        ...defaultProps,
        card: { id: "hearts-13", suit: "hearts", rank: 13, value: 13 },
      };
      render(<PlayedCard {...kingProps} />);
      expect(screen.getByText("K")).toBeInTheDocument();
    });

    it("should display '10' for rank 10", () => {
      const tenProps = {
        ...defaultProps,
        card: { id: "hearts-10", suit: "hearts", rank: 10, value: 10 },
      };
      render(<PlayedCard {...tenProps} />);
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("should render suit icon", () => {
      const { container } = render(<PlayedCard {...defaultProps} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("suits", () => {
    it("should render hearts card", () => {
      const heartsProps = {
        ...defaultProps,
        card: { id: "hearts-5", suit: "hearts", rank: 5, value: 5 },
      };
      const { container } = render(<PlayedCard {...heartsProps} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render diamonds card", () => {
      const diamondsProps = {
        ...defaultProps,
        card: { id: "diamonds-5", suit: "diamonds", rank: 5, value: 5 },
      };
      const { container } = render(<PlayedCard {...diamondsProps} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render clubs card", () => {
      const clubsProps = {
        ...defaultProps,
        card: { id: "clubs-5", suit: "clubs", rank: 5, value: 5 },
      };
      const { container } = render(<PlayedCard {...clubsProps} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render spades card", () => {
      const spadesProps = {
        ...defaultProps,
        card: { id: "spades-5", suit: "spades", rank: 5, value: 5 },
      };
      const { container } = render(<PlayedCard {...spadesProps} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("CSS classes", () => {
    it("should have 'played-card' class", () => {
      const { container } = render(<PlayedCard {...defaultProps} />);
      expect(container.firstChild).toHaveClass("played-card");
    });

    it("should have 'card-enter' class initially (animating)", () => {
      const { container } = render(<PlayedCard {...defaultProps} />);
      expect(container.firstChild).toHaveClass("card-enter");
    });

    it("should transition to 'card-settled' class after animation", async () => {
      const { container, rerender } = render(<PlayedCard {...defaultProps} />);

      // Initially should have card-enter
      expect(container.firstChild).toHaveClass("card-enter");

      // Advance timers past the 400ms animation delay
      vi.advanceTimersByTime(500);

      // Re-render to reflect state changes
      rerender(<PlayedCard {...defaultProps} />);

      // Should now have card-settled
      expect(container.firstChild).toHaveClass("card-settled");
      expect(container.firstChild).not.toHaveClass("card-enter");
    });

    it("should have 'winner-glow' class when isWinner is true", () => {
      const winnerProps = { ...defaultProps, isWinner: true };
      const { container } = render(<PlayedCard {...winnerProps} />);
      expect(container.firstChild).toHaveClass("winner-glow");
    });

    it("should not have 'winner-glow' class when isWinner is false", () => {
      const { container } = render(
        <PlayedCard {...defaultProps} isWinner={false} />,
      );
      expect(container.firstChild).not.toHaveClass("winner-glow");
    });
  });

  describe("positioning", () => {
    it("should set --target-x CSS variable from position.x", () => {
      const { container } = render(<PlayedCard {...defaultProps} />);
      const style = container.firstChild.style;
      expect(style.getPropertyValue("--target-x")).toBe("10px");
    });

    it("should set --target-y CSS variable from position.y", () => {
      const { container } = render(<PlayedCard {...defaultProps} />);
      const style = container.firstChild.style;
      expect(style.getPropertyValue("--target-y")).toBe("20px");
    });

    it("should set --target-rotation CSS variable from position.rotation", () => {
      const { container } = render(<PlayedCard {...defaultProps} />);
      const style = container.firstChild.style;
      expect(style.getPropertyValue("--target-rotation")).toBe("5deg");
    });

    it("should set z-index from position.zIndex", () => {
      const { container } = render(<PlayedCard {...defaultProps} />);
      expect(container.firstChild.style.zIndex).toBe("2");
    });

    it("should handle negative x position", () => {
      const negativeXProps = {
        ...defaultProps,
        position: { ...defaultProps.position, x: -50 },
      };
      const { container } = render(<PlayedCard {...negativeXProps} />);
      expect(container.firstChild.style.getPropertyValue("--target-x")).toBe(
        "-50px",
      );
    });

    it("should handle negative y position", () => {
      const negativeYProps = {
        ...defaultProps,
        position: { ...defaultProps.position, y: -10 },
      };
      const { container } = render(<PlayedCard {...negativeYProps} />);
      expect(container.firstChild.style.getPropertyValue("--target-y")).toBe(
        "-10px",
      );
    });

    it("should handle negative rotation", () => {
      const negativeRotProps = {
        ...defaultProps,
        position: { ...defaultProps.position, rotation: -8 },
      };
      const { container } = render(<PlayedCard {...negativeRotProps} />);
      expect(
        container.firstChild.style.getPropertyValue("--target-rotation"),
      ).toBe("-8deg");
    });

    it("should handle zero values", () => {
      const zeroProps = {
        ...defaultProps,
        position: { x: 0, y: 0, rotation: 0, zIndex: 1 },
      };
      const { container } = render(<PlayedCard {...zeroProps} />);
      expect(container.firstChild.style.getPropertyValue("--target-x")).toBe(
        "0px",
      );
      expect(container.firstChild.style.getPropertyValue("--target-y")).toBe(
        "0px",
      );
      expect(
        container.firstChild.style.getPropertyValue("--target-rotation"),
      ).toBe("0deg");
    });
  });

  describe("card face styling", () => {
    it("should have card-face child element", () => {
      const { container } = render(<PlayedCard {...defaultProps} />);
      expect(container.querySelector(".card-face")).toBeInTheDocument();
    });

    it("should have correct background color", () => {
      const { container } = render(<PlayedCard {...defaultProps} />);
      const cardFace = container.querySelector(".card-face");
      expect(cardFace.style.background).toBe("var(--color-card-white)");
    });

    it("should have flex column layout", () => {
      const { container } = render(<PlayedCard {...defaultProps} />);
      const cardFace = container.querySelector(".card-face");
      expect(cardFace.style.display).toBe("flex");
      expect(cardFace.style.flexDirection).toBe("column");
    });

    it("should have border", () => {
      const { container } = render(<PlayedCard {...defaultProps} />);
      const cardFace = container.querySelector(".card-face");
      expect(cardFace.style.border).toBe("1px solid var(--color-card-border)");
    });

    it("should have border-radius", () => {
      const { container } = render(<PlayedCard {...defaultProps} />);
      const cardFace = container.querySelector(".card-face");
      expect(cardFace.style.borderRadius).toBe("var(--radius-md)");
    });

    it("should have box-shadow", () => {
      const { container } = render(<PlayedCard {...defaultProps} />);
      const cardFace = container.querySelector(".card-face");
      expect(cardFace.style.boxShadow).toBe("var(--shadow-card)");
    });
  });

  describe("animation lifecycle", () => {
    it("should start in animating state", () => {
      const { container } = render(<PlayedCard {...defaultProps} />);
      expect(container.firstChild).toHaveClass("card-enter");
    });

    it("should transition after 400ms", async () => {
      const { container, rerender } = render(<PlayedCard {...defaultProps} />);

      // At 300ms, should still be animating
      vi.advanceTimersByTime(300);
      rerender(<PlayedCard {...defaultProps} />);
      expect(container.firstChild).toHaveClass("card-enter");

      // At 500ms, should be settled
      vi.advanceTimersByTime(200);
      rerender(<PlayedCard {...defaultProps} />);
      expect(container.firstChild).toHaveClass("card-settled");
    });

    it("should clean up timer on unmount", () => {
      const { unmount } = render(<PlayedCard {...defaultProps} />);

      // Unmount before timer fires
      unmount();

      // Advance timers - should not throw
      expect(() => vi.advanceTimersByTime(500)).not.toThrow();
    });
  });

  describe("winner state", () => {
    it("should apply winner-glow class when isWinner is true", () => {
      const winnerProps = { ...defaultProps, isWinner: true };
      const { container } = render(<PlayedCard {...winnerProps} />);
      expect(container.firstChild).toHaveClass("winner-glow");
    });

    it("should not apply winner-glow class when isWinner is false", () => {
      const loserProps = { ...defaultProps, isWinner: false };
      const { container } = render(<PlayedCard {...loserProps} />);
      expect(container.firstChild).not.toHaveClass("winner-glow");
    });

    it("should apply both animation and winner classes when applicable", async () => {
      const winnerProps = { ...defaultProps, isWinner: true };
      const { container, rerender } = render(<PlayedCard {...winnerProps} />);

      // Initially has both card-enter and winner-glow
      expect(container.firstChild).toHaveClass("card-enter");
      expect(container.firstChild).toHaveClass("winner-glow");

      // After animation settles
      vi.advanceTimersByTime(500);
      rerender(<PlayedCard {...winnerProps} />);
      expect(container.firstChild).toHaveClass("card-settled");
      expect(container.firstChild).toHaveClass("winner-glow");
    });
  });

  describe("different card combinations", () => {
    const allSuits = ["hearts", "diamonds", "clubs", "spades"];
    const allRanks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    it("should render all suits correctly", () => {
      allSuits.forEach((suit) => {
        const props = {
          ...defaultProps,
          card: { id: `${suit}-5`, suit, rank: 5, value: 5 },
        };
        const { container, unmount } = render(<PlayedCard {...props} />);
        expect(container.querySelector("svg")).toBeInTheDocument();
        unmount();
      });
    });

    it("should render all ranks correctly", () => {
      allRanks.forEach((rank) => {
        const props = {
          ...defaultProps,
          card: {
            id: `hearts-${rank}`,
            suit: "hearts",
            rank,
            value: rank === 1 ? 14 : rank,
          },
        };
        const { unmount } = render(<PlayedCard {...props} />);
        // Just verify it renders without throwing
        unmount();
      });
    });
  });

  describe("different positions", () => {
    const positions = [
      { x: -50, y: 10, rotation: -8, zIndex: 1 },
      { x: -18, y: -5, rotation: -3, zIndex: 2 },
      { x: 18, y: -5, rotation: 3, zIndex: 3 },
      { x: 50, y: 10, rotation: 8, zIndex: 4 },
    ];

    positions.forEach((position, index) => {
      it(`should render correctly at position ${index + 1}`, () => {
        const props = { ...defaultProps, position };
        const { container } = render(<PlayedCard {...props} />);
        expect(container.firstChild.style.getPropertyValue("--target-x")).toBe(
          `${position.x}px`,
        );
        expect(container.firstChild.style.getPropertyValue("--target-y")).toBe(
          `${position.y}px`,
        );
        expect(
          container.firstChild.style.getPropertyValue("--target-rotation"),
        ).toBe(`${position.rotation}deg`);
        expect(container.firstChild.style.zIndex).toBe(`${position.zIndex}`);
      });
    });
  });

  describe("edge cases", () => {
    it("should handle very large position values", () => {
      const largeProps = {
        ...defaultProps,
        position: { x: 1000, y: 1000, rotation: 180, zIndex: 100 },
      };
      const { container } = render(<PlayedCard {...largeProps} />);
      expect(container.firstChild.style.getPropertyValue("--target-x")).toBe(
        "1000px",
      );
      expect(container.firstChild.style.getPropertyValue("--target-y")).toBe(
        "1000px",
      );
    });

    it("should handle floating point position values", () => {
      const floatProps = {
        ...defaultProps,
        position: { x: 10.5, y: 20.7, rotation: 5.3, zIndex: 2 },
      };
      const { container } = render(<PlayedCard {...floatProps} />);
      expect(container.firstChild.style.getPropertyValue("--target-x")).toBe(
        "10.5px",
      );
      expect(container.firstChild.style.getPropertyValue("--target-y")).toBe(
        "20.7px",
      );
    });
  });
});
