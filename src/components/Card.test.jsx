import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Card from "./Card";

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
    isSelected: false,
    isDealing: false,
    onSelect: vi.fn(),
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

    it("should have 'selected' class when isSelected is true", () => {
      const { container } = render(
        <Card {...defaultProps} isSelected={true} />,
      );
      expect(container.firstChild).toHaveClass("selected");
    });

    it("should not have 'selected' class when isSelected is false", () => {
      const { container } = render(
        <Card {...defaultProps} isSelected={false} />,
      );
      expect(container.firstChild).not.toHaveClass("selected");
    });

    it("should have 'hand-card' class", () => {
      const { container } = render(<Card {...defaultProps} />);
      expect(container.firstChild).toHaveClass("hand-card");
    });
  });

  describe("click behavior", () => {
    it("should call onSelect when clicked and playable", () => {
      const onSelect = vi.fn();
      const { container } = render(
        <Card {...defaultProps} isPlayable={true} onSelect={onSelect} />,
      );

      fireEvent.click(container.firstChild);
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(defaultProps.card);
    });

    it("should not call onSelect when clicked and not playable", () => {
      const onSelect = vi.fn();
      const { container } = render(
        <Card {...defaultProps} isPlayable={false} onSelect={onSelect} />,
      );

      fireEvent.click(container.firstChild);
      expect(onSelect).not.toHaveBeenCalled();
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
      expect(style.getPropertyValue("--card-rotation")).toBe("0deg");
    });

    it("should have margin-left 0 for first card (index 0)", () => {
      const { container } = render(<Card {...defaultProps} index={0} />);
      expect(container.firstChild.style.marginLeft).toBe("0px");
    });

    it("should have negative margin-left for non-first cards", () => {
      const { container } = render(<Card {...defaultProps} index={1} />);
      expect(container.firstChild.style.marginLeft).toBe("-10px");
    });
  });

  describe("z-index", () => {
    it("should have base z-index based on card index", () => {
      const { container } = render(<Card {...defaultProps} index={2} />);
      expect(container.firstChild.style.zIndex).toBe("12");
    });

    it("should have high z-index when selected", () => {
      const { container } = render(
        <Card {...defaultProps} index={0} isSelected={true} />,
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

      expect(container.firstChild).toHaveClass("card-deal-in");

      vi.advanceTimersByTime(700);

      rerender(<Card {...defaultProps} isDealing={true} />);

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
