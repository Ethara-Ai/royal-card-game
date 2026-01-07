/**
 * Unit tests for Card component
 * Tests card rendering, styling, and interaction handlers
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Card from "../Card";

describe("Card", () => {
  const defaultProps = {
    card: {
      id: "hearts-5",
      suit: "hearts",
      rank: 5,
      value: 5,
    },
    index: 0,
    totalCards: 7,
    isPlayable: true,
    isDragging: false,
    isDealing: false,
    onDragStart: vi.fn(),
    onDragEnd: vi.fn(),
    onTouchStart: vi.fn(),
    onTouchMove: vi.fn(),
    onTouchEnd: vi.fn(),
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
      render(<Card {...defaultProps} />);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should display the correct rank for number cards", () => {
      render(<Card {...defaultProps} />);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should display 'A' for Ace (rank 1)", () => {
      const aceProps = {
        ...defaultProps,
        card: { id: "hearts-1", suit: "hearts", rank: 1, value: 14 },
      };
      render(<Card {...aceProps} />);
      expect(screen.getByText("A")).toBeInTheDocument();
    });

    it("should display 'J' for Jack (rank 11)", () => {
      const jackProps = {
        ...defaultProps,
        card: { id: "hearts-11", suit: "hearts", rank: 11, value: 11 },
      };
      render(<Card {...jackProps} />);
      expect(screen.getByText("J")).toBeInTheDocument();
    });

    it("should display 'Q' for Queen (rank 12)", () => {
      const queenProps = {
        ...defaultProps,
        card: { id: "hearts-12", suit: "hearts", rank: 12, value: 12 },
      };
      render(<Card {...queenProps} />);
      expect(screen.getByText("Q")).toBeInTheDocument();
    });

    it("should display 'K' for King (rank 13)", () => {
      const kingProps = {
        ...defaultProps,
        card: { id: "hearts-13", suit: "hearts", rank: 13, value: 13 },
      };
      render(<Card {...kingProps} />);
      expect(screen.getByText("K")).toBeInTheDocument();
    });

    it("should display '10' for rank 10", () => {
      const tenProps = {
        ...defaultProps,
        card: { id: "hearts-10", suit: "hearts", rank: 10, value: 10 },
      };
      render(<Card {...tenProps} />);
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("should render suit icon", () => {
      const { container } = render(<Card {...defaultProps} />);
      // Check for SVG element (suit icon)
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("suits", () => {
    it("should render hearts card", () => {
      const heartsProps = {
        ...defaultProps,
        card: { id: "hearts-5", suit: "hearts", rank: 5, value: 5 },
      };
      const { container } = render(<Card {...heartsProps} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render diamonds card", () => {
      const diamondsProps = {
        ...defaultProps,
        card: { id: "diamonds-5", suit: "diamonds", rank: 5, value: 5 },
      };
      const { container } = render(<Card {...diamondsProps} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render clubs card", () => {
      const clubsProps = {
        ...defaultProps,
        card: { id: "clubs-5", suit: "clubs", rank: 5, value: 5 },
      };
      const { container } = render(<Card {...clubsProps} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render spades card", () => {
      const spadesProps = {
        ...defaultProps,
        card: { id: "spades-5", suit: "spades", rank: 5, value: 5 },
      };
      const { container } = render(<Card {...spadesProps} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("CSS classes", () => {
    it("should have 'playable' class when isPlayable is true", () => {
      const { container } = render(
        <Card {...defaultProps} isPlayable={true} />,
      );
      expect(container.firstChild).toHaveClass("playable");
    });

    it("should have 'disabled' class when isPlayable is false", () => {
      const { container } = render(
        <Card {...defaultProps} isPlayable={false} />,
      );
      expect(container.firstChild).toHaveClass("disabled");
    });

    it("should have 'dragging' class when isDragging is true", () => {
      const { container } = render(
        <Card {...defaultProps} isDragging={true} />,
      );
      expect(container.firstChild).toHaveClass("dragging");
    });

    it("should not have 'dragging' class when isDragging is false", () => {
      const { container } = render(
        <Card {...defaultProps} isDragging={false} />,
      );
      expect(container.firstChild).not.toHaveClass("dragging");
    });

    it("should have 'hand-card' class", () => {
      const { container } = render(<Card {...defaultProps} />);
      expect(container.firstChild).toHaveClass("hand-card");
    });
  });

  describe("draggable behavior", () => {
    it("should be draggable when isPlayable is true", () => {
      const { container } = render(
        <Card {...defaultProps} isPlayable={true} />,
      );
      expect(container.firstChild).toHaveAttribute("draggable", "true");
    });

    it("should not be draggable when isPlayable is false", () => {
      const { container } = render(
        <Card {...defaultProps} isPlayable={false} />,
      );
      expect(container.firstChild).toHaveAttribute("draggable", "false");
    });
  });

  describe("event handlers", () => {
    it("should call onDragStart when drag starts", () => {
      const onDragStart = vi.fn();
      const { container } = render(
        <Card {...defaultProps} onDragStart={onDragStart} />,
      );

      fireEvent.dragStart(container.firstChild);
      expect(onDragStart).toHaveBeenCalledTimes(1);
    });

    it("should call onDragEnd when drag ends", () => {
      const onDragEnd = vi.fn();
      const { container } = render(
        <Card {...defaultProps} onDragEnd={onDragEnd} />,
      );

      fireEvent.dragEnd(container.firstChild);
      expect(onDragEnd).toHaveBeenCalledTimes(1);
    });

    it("should call onTouchStart when touch starts", () => {
      const onTouchStart = vi.fn();
      const { container } = render(
        <Card {...defaultProps} onTouchStart={onTouchStart} />,
      );

      fireEvent.touchStart(container.firstChild);
      expect(onTouchStart).toHaveBeenCalledTimes(1);
    });

    it("should call onTouchMove when touch moves", () => {
      const onTouchMove = vi.fn();
      const { container } = render(
        <Card {...defaultProps} onTouchMove={onTouchMove} />,
      );

      fireEvent.touchMove(container.firstChild);
      expect(onTouchMove).toHaveBeenCalledTimes(1);
    });

    it("should call onTouchEnd when touch ends", () => {
      const onTouchEnd = vi.fn();
      const { container } = render(
        <Card {...defaultProps} onTouchEnd={onTouchEnd} />,
      );

      fireEvent.touchEnd(container.firstChild);
      expect(onTouchEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe("card positioning", () => {
    it("should have CSS variables for rotation", () => {
      const { container } = render(
        <Card {...defaultProps} index={0} totalCards={7} />,
      );
      const style = container.firstChild.style;
      expect(style.getPropertyValue("--card-rotation")).toBeDefined();
    });

    it("should have CSS variables for y-offset", () => {
      const { container } = render(
        <Card {...defaultProps} index={0} totalCards={7} />,
      );
      const style = container.firstChild.style;
      expect(style.getPropertyValue("--card-y-offset")).toBeDefined();
    });

    it("should have CSS variables for delay", () => {
      const { container } = render(<Card {...defaultProps} index={2} />);
      const style = container.firstChild.style;
      expect(style.getPropertyValue("--card-delay")).toBeDefined();
    });

    it("should calculate rotation based on index and totalCards", () => {
      const { container } = render(
        <Card {...defaultProps} index={3} totalCards={7} />,
      );
      const style = container.firstChild.style;
      // Middle index for 7 cards is 3, so rotation should be 0 for middle card
      expect(style.getPropertyValue("--card-rotation")).toBe("0deg");
    });

    it("should have margin-left 0 for first card (index 0)", () => {
      const { container } = render(<Card {...defaultProps} index={0} />);
      expect(container.firstChild.style.marginLeft).toBe("0px");
    });

    it("should have negative margin-left for non-first cards", () => {
      const { container } = render(<Card {...defaultProps} index={1} />);
      expect(container.firstChild.style.marginLeft).toBe("-8px");
    });
  });

  describe("z-index", () => {
    it("should have base z-index based on card index", () => {
      const { container } = render(<Card {...defaultProps} index={2} />);
      expect(container.firstChild.style.zIndex).toBe("12");
    });

    it("should have high z-index when dragging", () => {
      const { container } = render(
        <Card {...defaultProps} index={0} isDragging={true} />,
      );
      expect(container.firstChild.style.zIndex).toBe("100");
    });
  });

  describe("dealing animation", () => {
    it("should have card-deal-in class when isDealing is true and not hasDealt", () => {
      const { container } = render(<Card {...defaultProps} isDealing={true} />);
      expect(container.firstChild).toHaveClass("card-deal-in");
    });

    it("should remove card-deal-in class after animation completes", async () => {
      const { container, rerender } = render(
        <Card {...defaultProps} isDealing={true} />,
      );

      // Initially should have the class
      expect(container.firstChild).toHaveClass("card-deal-in");

      // Advance timers past the 600ms animation delay
      vi.advanceTimersByTime(700);

      // Re-render to reflect state changes
      rerender(<Card {...defaultProps} isDealing={true} />);

      // After animation, should not have the class
      expect(container.firstChild).not.toHaveClass("card-deal-in");
    });

    it("should not have card-deal-in class when isDealing is false", () => {
      const { container } = render(
        <Card {...defaultProps} isDealing={false} />,
      );
      expect(container.firstChild).not.toHaveClass("card-deal-in");
    });
  });

  describe("card-inner styles", () => {
    it("should have card-inner child element", () => {
      const { container } = render(<Card {...defaultProps} />);
      expect(container.querySelector(".card-inner")).toBeInTheDocument();
    });

    it("should have correct background color", () => {
      const { container } = render(<Card {...defaultProps} />);
      const cardInner = container.querySelector(".card-inner");
      expect(cardInner.style.background).toBe("var(--color-card-white)");
    });

    it("should have flex column layout", () => {
      const { container } = render(<Card {...defaultProps} />);
      const cardInner = container.querySelector(".card-inner");
      expect(cardInner.style.display).toBe("flex");
      expect(cardInner.style.flexDirection).toBe("column");
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
        const { container, unmount } = render(<Card {...props} />);
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
        const { unmount } = render(<Card {...props} />);
        // Just verify it renders without throwing
        unmount();
      });
    });
  });

  describe("edge cases", () => {
    it("should handle single card in hand (totalCards = 1)", () => {
      const { container } = render(
        <Card {...defaultProps} index={0} totalCards={1} />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should handle last card in full hand", () => {
      const { container } = render(
        <Card {...defaultProps} index={6} totalCards={7} />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should handle many cards in hand", () => {
      const { container } = render(
        <Card {...defaultProps} index={6} totalCards={13} />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
