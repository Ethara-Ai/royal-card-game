/**
 * Unit tests for UserHand component
 * Tests rendering, player display, card rendering, and interaction handlers
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import UserHand from "./UserHand";

describe("UserHand", () => {
  const defaultProps = {
    player: {
      id: "player1",
      name: "You",
      hand: [
        { id: "hearts-5", suit: "hearts", rank: 5, value: 5 },
        { id: "diamonds-10", suit: "diamonds", rank: 10, value: 10 },
        { id: "clubs-3", suit: "clubs", rank: 3, value: 3 },
      ],
    },
    playerIndex: 0,
    currentPlayer: 0,
    gamePhase: "playing",
    draggedCard: null,
    dealingAnimation: false,
    onDragStart: vi.fn(),
    onDragEnd: vi.fn(),
    onTouchStart: vi.fn(),
    onTouchMove: vi.fn(),
    onTouchEnd: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render without crashing", () => {
      render(<UserHand {...defaultProps} />);
      expect(screen.getByText("You")).toBeInTheDocument();
    });

    it("should display the player name", () => {
      render(<UserHand {...defaultProps} />);
      expect(screen.getByText("You")).toBeInTheDocument();
    });

    it("should display the number of cards in hand", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const cards = container.querySelectorAll(".hand-card");
      expect(cards.length).toBe(3);
    });

    it("should render player avatar", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const avatar = container.querySelector("img");
      expect(avatar).toBeInTheDocument();
    });

    it("should have correct avatar URL using robohash", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const avatar = container.querySelector("img");
      expect(avatar.src).toContain("robohash.org/You");
    });

    it("should have alt text for avatar matching player name", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const avatar = container.querySelector("img");
      expect(avatar.alt).toBe("You");
    });

    it("should render cards in hand", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const cards = container.querySelectorAll(".hand-card");
      expect(cards.length).toBe(3);
    });
  });

  describe("turn status", () => {
    it("should display 'Your turn' when it is the player's turn", () => {
      render(<UserHand {...defaultProps} currentPlayer={0} playerIndex={0} />);
      expect(screen.getByText("Your turn")).toBeInTheDocument();
    });

    it("should display 'Waiting...' when it is not the player's turn", () => {
      render(<UserHand {...defaultProps} currentPlayer={1} playerIndex={0} />);
      expect(screen.getByText("Waiting...")).toBeInTheDocument();
    });

    it("should display 'Waiting...' when currentPlayer is 2", () => {
      render(<UserHand {...defaultProps} currentPlayer={2} playerIndex={0} />);
      expect(screen.getByText("Waiting...")).toBeInTheDocument();
    });

    it("should display 'Your turn' when playerIndex matches currentPlayer", () => {
      render(<UserHand {...defaultProps} currentPlayer={2} playerIndex={2} />);
      expect(screen.getByText("Your turn")).toBeInTheDocument();
    });
  });

  describe("card rendering", () => {
    it("should render correct number of Card components", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const cards = container.querySelectorAll(".hand-card");
      expect(cards.length).toBe(3);
    });

    it("should render all cards when hand has 7 cards", () => {
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
      const { container } = render(<UserHand {...sevenCardsProps} />);
      const cards = container.querySelectorAll(".hand-card");
      expect(cards.length).toBe(7);
    });

    it("should render no cards when hand is empty", () => {
      const emptyHandProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          hand: [],
        },
      };
      const { container } = render(<UserHand {...emptyHandProps} />);
      const cards = container.querySelectorAll(".hand-card");
      expect(cards.length).toBe(0);
    });

    it("should render single card", () => {
      const singleCardProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          hand: [{ id: "h1", suit: "hearts", rank: 5, value: 5 }],
        },
      };
      const { container } = render(<UserHand {...singleCardProps} />);
      const cards = container.querySelectorAll(".hand-card");
      expect(cards.length).toBe(1);
    });
  });

  describe("card playability", () => {
    it("should make cards playable when it is player's turn and phase is playing", () => {
      const { container } = render(
        <UserHand {...defaultProps} currentPlayer={0} gamePhase="playing" />,
      );
      const cards = container.querySelectorAll(".hand-card.playable");
      expect(cards.length).toBe(3);
    });

    it("should make cards not playable when it is not player's turn", () => {
      const { container } = render(
        <UserHand {...defaultProps} currentPlayer={1} gamePhase="playing" />,
      );
      const cards = container.querySelectorAll(".hand-card.disabled");
      expect(cards.length).toBe(3);
    });

    it("should make cards not playable when phase is not playing", () => {
      const { container } = render(
        <UserHand {...defaultProps} currentPlayer={0} gamePhase="waiting" />,
      );
      const cards = container.querySelectorAll(".hand-card.disabled");
      expect(cards.length).toBe(3);
    });

    it("should make cards not playable during dealing phase", () => {
      const { container } = render(
        <UserHand {...defaultProps} currentPlayer={0} gamePhase="dealing" />,
      );
      const cards = container.querySelectorAll(".hand-card.disabled");
      expect(cards.length).toBe(3);
    });

    it("should make cards not playable during evaluating phase", () => {
      const { container } = render(
        <UserHand {...defaultProps} currentPlayer={0} gamePhase="evaluating" />,
      );
      const cards = container.querySelectorAll(".hand-card.disabled");
      expect(cards.length).toBe(3);
    });
  });

  describe("dragged card state", () => {
    it("should mark correct card as dragging", () => {
      const draggingProps = {
        ...defaultProps,
        draggedCard: { id: "hearts-5", suit: "hearts", rank: 5, value: 5 },
      };
      const { container } = render(<UserHand {...draggingProps} />);
      const draggingCards = container.querySelectorAll(".hand-card.dragging");
      expect(draggingCards.length).toBe(1);
    });

    it("should not mark any card as dragging when draggedCard is null", () => {
      const { container } = render(
        <UserHand {...defaultProps} draggedCard={null} />,
      );
      const draggingCards = container.querySelectorAll(".hand-card.dragging");
      expect(draggingCards.length).toBe(0);
    });

    it("should not mark wrong card as dragging", () => {
      const draggingProps = {
        ...defaultProps,
        draggedCard: { id: "spades-10", suit: "spades", rank: 10, value: 10 },
      };
      const { container } = render(<UserHand {...draggingProps} />);
      const draggingCards = container.querySelectorAll(".hand-card.dragging");
      expect(draggingCards.length).toBe(0);
    });
  });

  describe("dealing animation", () => {
    it("should pass dealingAnimation prop to cards when true", () => {
      const { container } = render(
        <UserHand {...defaultProps} dealingAnimation={true} />,
      );
      const dealingCards = container.querySelectorAll(".card-deal-in");
      expect(dealingCards.length).toBe(3);
    });

    it("should not have dealing animation class when dealingAnimation is false", () => {
      const { container } = render(
        <UserHand {...defaultProps} dealingAnimation={false} />,
      );
      const dealingCards = container.querySelectorAll(".card-deal-in");
      expect(dealingCards.length).toBe(0);
    });
  });

  describe("styling", () => {
    it("should have player-panel class", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const panel = container.querySelector(".player-panel");
      expect(panel).toBeInTheDocument();
    });

    it("should have player-header class", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const header = container.querySelector(".player-header");
      expect(header).toBeInTheDocument();
    });

    it("should have player-avatar class", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const avatar = container.querySelector(".player-avatar");
      expect(avatar).toBeInTheDocument();
    });

    it("should have player-cards class", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const cardsContainer = container.querySelector(".player-cards");
      expect(cardsContainer).toBeInTheDocument();
    });

    it("should have pixel-art class on avatar", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const pixelArtAvatar = container.querySelector(".pixel-art");
      expect(pixelArtAvatar).toBeInTheDocument();
    });
  });

  describe("different players", () => {
    it("should render with different player name", () => {
      const differentPlayerProps = {
        ...defaultProps,
        player: {
          id: "player2",
          name: "Alex",
          hand: [{ id: "h1", suit: "hearts", rank: 5, value: 5 }],
        },
      };
      render(<UserHand {...differentPlayerProps} />);
      expect(screen.getByText("Alex")).toBeInTheDocument();
    });

    it("should render with player index 2", () => {
      const player2Props = {
        ...defaultProps,
        playerIndex: 2,
        currentPlayer: 2,
      };
      render(<UserHand {...player2Props} />);
      expect(screen.getByText("Your turn")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle player with special characters in name", () => {
      const specialNameProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          name: "Player #1",
        },
      };
      render(<UserHand {...specialNameProps} />);
      expect(screen.getByText("Player #1")).toBeInTheDocument();
    });

    it("should handle player with long name", () => {
      const longNameProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          name: "VeryLongPlayerNameThatMightOverflow",
        },
      };
      const { container } = render(<UserHand {...longNameProps} />);
      const nameElement = container.querySelector(".truncate");
      expect(nameElement).toBeInTheDocument();
    });

    it("should display 0 when hand is empty", () => {
      const emptyHandProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          hand: [],
        },
      };
      render(<UserHand {...emptyHandProps} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should display correct count for many cards", () => {
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
            { id: "h8", suit: "hearts", rank: 8, value: 8 },
            { id: "h9", suit: "hearts", rank: 9, value: 9 },
            { id: "h11", suit: "hearts", rank: 11, value: 11 },
          ],
        },
      };
      const { container } = render(<UserHand {...manyCardsProps} />);
      const cards = container.querySelectorAll(".hand-card");
      expect(cards.length).toBe(10);
    });
  });

  describe("accessibility", () => {
    it("should have accessible image with alt text", () => {
      render(<UserHand {...defaultProps} />);
      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("alt", "You");
    });
  });

  describe("responsive styling", () => {
    it("should have flex layout in player-cards", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const cardsContainer = container.querySelector(".player-cards.flex");
      expect(cardsContainer).toBeInTheDocument();
    });

    it("should center cards horizontally", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const cardsContainer = container.querySelector(".justify-center");
      expect(cardsContainer).toBeInTheDocument();
    });

    it("should align cards at bottom", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const cardsContainer = container.querySelector(".items-end");
      expect(cardsContainer).toBeInTheDocument();
    });

    it("should have gap in header", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const gapElement = container.querySelector('[class*="gap"]');
      expect(gapElement).toBeInTheDocument();
    });

    it("should have min-w-0 for name truncation", () => {
      const { container } = render(<UserHand {...defaultProps} />);
      const minWidthElement = container.querySelector(".min-w-0");
      expect(minWidthElement).toBeInTheDocument();
    });
  });

  describe("card suits in hand", () => {
    it("should render hearts cards", () => {
      const heartsProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          hand: [{ id: "hearts-5", suit: "hearts", rank: 5, value: 5 }],
        },
      };
      const { container } = render(<UserHand {...heartsProps} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render mixed suit cards", () => {
      const mixedProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          hand: [
            { id: "hearts-5", suit: "hearts", rank: 5, value: 5 },
            { id: "spades-10", suit: "spades", rank: 10, value: 10 },
            { id: "diamonds-3", suit: "diamonds", rank: 3, value: 3 },
            { id: "clubs-7", suit: "clubs", rank: 7, value: 7 },
          ],
        },
      };
      const { container } = render(<UserHand {...mixedProps} />);
      const cards = container.querySelectorAll(".hand-card");
      expect(cards.length).toBe(4);
    });
  });

  describe("card ranks in hand", () => {
    it("should render face cards", () => {
      const faceCardsProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          hand: [
            { id: "hearts-1", suit: "hearts", rank: 1, value: 14 },
            { id: "hearts-11", suit: "hearts", rank: 11, value: 11 },
            { id: "hearts-12", suit: "hearts", rank: 12, value: 12 },
            { id: "hearts-13", suit: "hearts", rank: 13, value: 13 },
          ],
        },
      };
      render(<UserHand {...faceCardsProps} />);
      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("J")).toBeInTheDocument();
      expect(screen.getByText("Q")).toBeInTheDocument();
      expect(screen.getByText("K")).toBeInTheDocument();
    });

    it("should render number cards", () => {
      const numberCardsProps = {
        ...defaultProps,
        player: {
          ...defaultProps.player,
          hand: [
            { id: "hearts-2", suit: "hearts", rank: 2, value: 2 },
            { id: "hearts-5", suit: "hearts", rank: 5, value: 5 },
            { id: "hearts-9", suit: "hearts", rank: 9, value: 9 },
          ],
        },
      };
      render(<UserHand {...numberCardsProps} />);
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("9")).toBeInTheDocument();
    });
  });
});
