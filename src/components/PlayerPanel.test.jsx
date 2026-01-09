/**
 * Unit tests for PlayerPanel component
 * Tests rendering, player display, card deck stack, card count, and current player highlighting
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PlayerPanel from "./PlayerPanel";
import { CardCustomizationProvider } from "../context";

// Helper to render with context
const renderWithContext = (ui, options) =>
  render(<CardCustomizationProvider>{ui}</CardCustomizationProvider>, options);

describe("PlayerPanel", () => {
  const defaultProps = {
    player: {
      id: "player2",
      name: "Alex",
      hand: [
        { id: "hearts-5", suit: "hearts", rank: 5, value: 5 },
        { id: "diamonds-10", suit: "diamonds", rank: 10, value: 10 },
        { id: "clubs-3", suit: "clubs", rank: 3, value: 3 },
      ],
      score: 0,
      isActive: false,
    },
    index: 1,
    currentPlayer: 0,
    isDealing: false,
    players: [
      { id: "player1", name: "You", hand: [], score: 2, isActive: true },
      { id: "player2", name: "Alex", hand: [], score: 1, isActive: false },
      { id: "player3", name: "Bot1", hand: [], score: 3, isActive: false },
      { id: "player4", name: "Bot2", hand: [], score: 0, isActive: false },
    ],
    scores: [2, 1, 3, 0],
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render without crashing", () => {
      renderWithContext(<PlayerPanel {...defaultProps} />);
      expect(screen.getByText("Alex")).toBeInTheDocument();
    });

    it("should display the player name", () => {
      renderWithContext(<PlayerPanel {...defaultProps} />);
      expect(screen.getByText("Alex")).toBeInTheDocument();
    });

    it("should display player score", () => {
      renderWithContext(<PlayerPanel {...defaultProps} />);
      // Alex has score 1 from the scores array
      expect(screen.getByTitle("1 points")).toBeInTheDocument();
    });

    it("should display score with pt suffix", () => {
      renderWithContext(<PlayerPanel {...defaultProps} />);
      expect(screen.getByText(/• 1pt/)).toBeInTheDocument();
    });

    it("should display player rank badge", () => {
      renderWithContext(<PlayerPanel {...defaultProps} />);
      // Alex has score 1, which is rank 3 (Bot1=3pts rank1, You=2pts rank2, Alex=1pt rank3)
      expect(screen.getByText("#3")).toBeInTheDocument();
    });

    it("should display pt label with score", () => {
      renderWithContext(<PlayerPanel {...defaultProps} />);
      expect(screen.getByText(/• 1pt/)).toBeInTheDocument();
    });

    it("should render player avatar", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const avatar = container.querySelector("img");
      expect(avatar).toBeInTheDocument();
    });

    it("should have correct avatar URL using robohash", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const avatar = container.querySelector("img");
      expect(avatar.src).toContain("robohash.org/Alex");
    });

    it("should have alt text for avatar matching player name", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const avatar = container.querySelector("img");
      expect(avatar.alt).toBe("Alex");
    });

    it("should display 'Waiting' status when not current player", () => {
      renderWithContext(<PlayerPanel {...defaultProps} currentPlayer={0} />);
      expect(screen.getByText("Waiting")).toBeInTheDocument();
    });

    it("should display 'Playing' status when current player", () => {
      renderWithContext(<PlayerPanel {...defaultProps} currentPlayer={1} />);
      expect(screen.getByText("Playing")).toBeInTheDocument();
    });
  });

  describe("card deck stack", () => {
    it("should render card stack items for cards in hand", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const cardStackItems = container.querySelectorAll(".card-stack-item");
      // Should show cards in hand (3 cards)
      expect(cardStackItems.length).toBe(3);
    });

    it("should limit card stack items to maximum of 4", () => {
      const manyCardsProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          hand: [
            { id: "h1", suit: "hearts", rank: 1, value: 14 },
            { id: "h2", suit: "hearts", rank: 2, value: 2 },
            { id: "h3", suit: "hearts", rank: 3, value: 3 },
            { id: "h4", suit: "hearts", rank: 4, value: 4 },
            { id: "h5", suit: "hearts", rank: 5, value: 5 },
            { id: "h6", suit: "hearts", rank: 6, value: 6 },
            { id: "h7", suit: "hearts", rank: 7, value: 7 },
          ],
        },
      };
      const { container } = renderWithContext(
        <PlayerPanel {...manyCardsProps} />,
      );
      const cardStackItems = container.querySelectorAll(".card-stack-item");
      expect(cardStackItems.length).toBe(4);
    });

    it("should apply card back color from context", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const cardStackItems = container.querySelectorAll(".card-stack-item");
      // Default color from context is #145a4a = rgb(20, 90, 74)
      cardStackItems.forEach((cardItem) => {
        expect(cardItem.style.backgroundColor).toBe("rgb(20, 90, 74)");
      });
    });

    it("should render no card stack items when hand is empty", () => {
      const emptyHandProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          hand: [],
        },
      };
      const { container } = renderWithContext(
        <PlayerPanel {...emptyHandProps} />,
      );
      const cardStackItems = container.querySelectorAll(".card-stack-item");
      expect(cardStackItems.length).toBe(0);
    });

    it("should have animation delay for each card in stack", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const cardStackItems = container.querySelectorAll(".card-stack-item");
      cardStackItems.forEach((cardItem, index) => {
        expect(cardItem.style.animationDelay).toBe(`${index * 0.1}s`);
      });
    });

    it("should have stacked positioning with offset", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const cardStackItems = container.querySelectorAll(".card-stack-item");
      cardStackItems.forEach((cardItem, index) => {
        const expectedOffset = index * 2;
        expect(cardItem.style.left).toBe(`${expectedOffset}px`);
        expect(cardItem.style.top).toBe(`${expectedOffset}px`);
      });
    });

    it("should have increasing z-index for stacked cards", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const cardStackItems = container.querySelectorAll(".card-stack-item");
      cardStackItems.forEach((cardItem, index) => {
        expect(cardItem.style.zIndex).toBe(String(index));
      });
    });
  });

  describe("card count display", () => {
    it("should display card count when player has cards", () => {
      renderWithContext(<PlayerPanel {...defaultProps} />);
      // Player has 3 cards
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should display 'cards' label", () => {
      renderWithContext(<PlayerPanel {...defaultProps} />);
      expect(screen.getByText("cards")).toBeInTheDocument();
    });

    it("should have card count display container", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const cardCountDisplay = container.querySelector(".card-count-display");
      expect(cardCountDisplay).toBeInTheDocument();
    });

    it("should have tooltip with card count", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const cardCountDisplay = container.querySelector(".card-count-display");
      expect(cardCountDisplay).toHaveAttribute("title", "3 cards in hand");
    });

    it("should not display card count when hand is empty", () => {
      const emptyHandProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          hand: [],
        },
      };
      const { container } = renderWithContext(
        <PlayerPanel {...emptyHandProps} />,
      );
      const cardCountDisplay = container.querySelector(".card-count-display");
      expect(cardCountDisplay).not.toBeInTheDocument();
    });

    it("should show correct count for 7 cards", () => {
      const sevenCardsProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          hand: [
            { id: "h1", suit: "hearts", rank: 1, value: 14 },
            { id: "h2", suit: "hearts", rank: 2, value: 2 },
            { id: "h3", suit: "hearts", rank: 3, value: 3 },
            { id: "h4", suit: "hearts", rank: 4, value: 4 },
            { id: "h5", suit: "hearts", rank: 5, value: 5 },
            { id: "h6", suit: "hearts", rank: 6, value: 6 },
            { id: "h7", suit: "hearts", rank: 7, value: 7 },
          ],
        },
      };
      renderWithContext(<PlayerPanel {...sevenCardsProps} />);
      expect(screen.getByText("7")).toBeInTheDocument();
      expect(screen.getByTitle("7 cards in hand")).toBeInTheDocument();
    });

    it("should show correct count for single card", () => {
      const singleCardProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          hand: [{ id: "h1", suit: "hearts", rank: 5, value: 5 }],
        },
      };
      renderWithContext(<PlayerPanel {...singleCardProps} />);
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  describe("current player highlighting", () => {
    it("should have player-turn-indicator class when current player", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} currentPlayer={1} />,
      );
      const panel = container.querySelector(".opponent-panel");
      expect(panel).toHaveClass("player-turn-indicator");
    });

    it("should not have player-turn-indicator class when not current player", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} currentPlayer={0} />,
      );
      const panel = container.querySelector(".opponent-panel");
      expect(panel).not.toHaveClass("player-turn-indicator");
    });

    it("should highlight player 2 when currentPlayer is 2", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} index={2} currentPlayer={2} />,
      );
      const panel = container.querySelector(".opponent-panel");
      expect(panel).toHaveClass("player-turn-indicator");
    });
  });

  describe("dealing animation", () => {
    it("should have card-deal-in class on card stack items when isDealing is true", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} isDealing={true} />,
      );
      const cardStackItems = container.querySelectorAll(".card-stack-item");
      cardStackItems.forEach((cardItem) => {
        expect(cardItem).toHaveClass("card-deal-in");
      });
    });

    it("should not have card-deal-in class when isDealing is false", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} isDealing={false} />,
      );
      const cardStackItems = container.querySelectorAll(".card-stack-item");
      cardStackItems.forEach((cardItem) => {
        expect(cardItem).not.toHaveClass("card-deal-in");
      });
    });
  });

  describe("styling", () => {
    it("should have opponent-panel class", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const panel = container.querySelector(".opponent-panel");
      expect(panel).toBeInTheDocument();
    });

    it("should have transition-all class for animations", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const panel = container.querySelector(".transition-all");
      expect(panel).toBeInTheDocument();
    });

    it("should have duration-300 class for transition timing", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const panel = container.querySelector(".duration-300");
      expect(panel).toBeInTheDocument();
    });

    it("should have pixel-art class on avatar", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const avatar = container.querySelector(".pixel-art");
      expect(avatar).toBeInTheDocument();
    });

    it("should have card-backs container", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const cardBacksContainer = container.querySelector(".card-backs");
      expect(cardBacksContainer).toBeInTheDocument();
    });

    it("should have card-deck-container", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const deckContainer = container.querySelector(".card-deck-container");
      expect(deckContainer).toBeInTheDocument();
    });
  });

  describe("different players", () => {
    it("should render player1 correctly", () => {
      const player1Props = {
        ...defaultProps,
        player: {
          id: "player1",
          name: "You",
          hand: [{ id: "h1", suit: "hearts", rank: 5, value: 5 }],
          score: 0,
          isActive: true,
        },
        index: 0,
      };
      renderWithContext(<PlayerPanel {...player1Props} />);
      expect(screen.getByText("You (You)")).toBeInTheDocument();
    });

    it("should render player3 correctly", () => {
      const player3Props = {
        ...defaultProps,
        player: {
          id: "player3",
          name: "Sam",
          hand: [
            { id: "h1", suit: "hearts", rank: 5, value: 5 },
            { id: "h2", suit: "diamonds", rank: 10, value: 10 },
          ],
          score: 0,
          isActive: false,
        },
        index: 2,
      };
      renderWithContext(<PlayerPanel {...player3Props} />);
      expect(screen.getByText("Sam")).toBeInTheDocument();
      // Player at index 2 has score 3 from scores array, so rank #1
      expect(screen.getByText("#1")).toBeInTheDocument();
    });

    it("should render player4 correctly", () => {
      const player4Props = {
        ...defaultProps,
        player: {
          id: "player4",
          name: "Jordan",
          hand: [
            { id: "h1", suit: "hearts", rank: 5, value: 5 },
            { id: "h2", suit: "diamonds", rank: 10, value: 10 },
            { id: "h3", suit: "clubs", rank: 3, value: 3 },
            { id: "h4", suit: "spades", rank: 8, value: 8 },
          ],
          score: 0,
          isActive: false,
        },
        index: 3,
      };
      renderWithContext(<PlayerPanel {...player4Props} />);
      expect(screen.getByText("Jordan")).toBeInTheDocument();
      // Player at index 3 has score 0 from scores array, so rank #4
      expect(screen.getByText("#4")).toBeInTheDocument();
    });
  });

  describe("card back patterns", () => {
    it("should render card stack items with pattern from context", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const cardStackItems = container.querySelectorAll(".card-stack-item");
      expect(cardStackItems.length).toBeGreaterThan(0);
    });
  });

  describe("edge cases", () => {
    it("should handle player with special characters in name", () => {
      const specialNameProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          name: "Player #2",
        },
      };
      renderWithContext(<PlayerPanel {...specialNameProps} />);
      expect(screen.getByText("Player #2")).toBeInTheDocument();
    });

    it("should handle player with long name", () => {
      const longNameProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          name: "VeryLongPlayerNameThatMightOverflow",
        },
      };
      const { container } = renderWithContext(
        <PlayerPanel {...longNameProps} />,
      );
      const nameElement = container.querySelector(".truncate");
      expect(nameElement).toBeInTheDocument();
    });

    it("should handle single card in hand", () => {
      const singleCardProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          hand: [{ id: "h1", suit: "hearts", rank: 5, value: 5 }],
        },
      };
      const { container } = renderWithContext(
        <PlayerPanel {...singleCardProps} />,
      );
      const cardStackItems = container.querySelectorAll(".card-stack-item");
      expect(cardStackItems.length).toBe(1);
    });

    it("should display correct card count for many cards while limiting stack visuals", () => {
      const manyCardsProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          hand: [
            { id: "h1", suit: "hearts", rank: 1, value: 14 },
            { id: "h2", suit: "hearts", rank: 2, value: 2 },
            { id: "h3", suit: "hearts", rank: 3, value: 3 },
            { id: "h4", suit: "hearts", rank: 4, value: 4 },
            { id: "h5", suit: "hearts", rank: 5, value: 5 },
            { id: "h6", suit: "hearts", rank: 6, value: 6 },
            { id: "h7", suit: "hearts", rank: 7, value: 7 },
          ],
        },
      };
      const { container } = renderWithContext(
        <PlayerPanel {...manyCardsProps} />,
      );
      // Should render the player panel correctly with many cards
      expect(screen.getByText("Alex")).toBeInTheDocument();
      // Card stack should be limited to 4 max
      const cardStackItems = container.querySelectorAll(".card-stack-item");
      expect(cardStackItems.length).toBe(4);
      // But card count should show actual count of 7
      expect(screen.getByText("7")).toBeInTheDocument();
    });

    it("should display correct card count even when stack is limited", () => {
      const tenCardsProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          hand: Array.from({ length: 10 }, (_, i) => ({
            id: `h${i + 1}`,
            suit: "hearts",
            rank: i + 1,
            value: i + 1,
          })),
        },
      };
      const { container } = renderWithContext(
        <PlayerPanel {...tenCardsProps} />,
      );
      // Card count should show 10
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByTitle("10 cards in hand")).toBeInTheDocument();
      // But stack items should be limited to 4
      const cardStackItems = container.querySelectorAll(".card-stack-item");
      expect(cardStackItems.length).toBe(4);
    });
  });

  describe("accessibility", () => {
    it("should have accessible image with alt text", () => {
      renderWithContext(<PlayerPanel {...defaultProps} />);
      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("alt", "Alex");
    });

    it("should have title attribute on card count for accessibility", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const cardCountDisplay = container.querySelector(".card-count-display");
      expect(cardCountDisplay).toHaveAttribute("title");
    });
  });

  describe("responsive styling", () => {
    it("should have flex layout", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const flexElement = container.querySelector(".flex");
      expect(flexElement).toBeInTheDocument();
    });

    it("should have gap between elements", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const gapElement = container.querySelector('[class*="gap"]');
      expect(gapElement).toBeInTheDocument();
    });

    it("should have min-w-0 for name truncation", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const minWidthElement = container.querySelector(".min-w-0");
      expect(minWidthElement).toBeInTheDocument();
    });
  });

  describe("card deck container structure", () => {
    it("should have proper container hierarchy", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const cardBacks = container.querySelector(".card-backs");
      const deckContainer = cardBacks.querySelector(".card-deck-container");
      expect(deckContainer).toBeInTheDocument();
    });

    it("should contain both card stack and count display", () => {
      const { container } = renderWithContext(
        <PlayerPanel {...defaultProps} />,
      );
      const deckContainer = container.querySelector(".card-deck-container");
      const cardStackItems = deckContainer.querySelectorAll(".card-stack-item");
      const cardCountDisplay = deckContainer.querySelector(
        ".card-count-display",
      );
      expect(cardStackItems.length).toBeGreaterThan(0);
      expect(cardCountDisplay).toBeInTheDocument();
    });
  });
});
