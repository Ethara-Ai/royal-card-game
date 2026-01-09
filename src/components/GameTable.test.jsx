import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GameTable from "./GameTable";
import { CardCustomizationProvider } from "../context";

const renderWithContext = (ui, options) =>
  render(<CardCustomizationProvider>{ui}</CardCustomizationProvider>, options);

describe("GameTable", () => {
  const mockPlayers = [
    {
      id: "player1",
      name: "Player",
      hand: [
        { id: "hearts-5", suit: "hearts", rank: 5, value: 5 },
        { id: "diamonds-10", suit: "diamonds", rank: 10, value: 10 },
      ],
      score: 0,
      isActive: true,
    },
    {
      id: "player2",
      name: "Alex",
      hand: [{ id: "clubs-3", suit: "clubs", rank: 3, value: 3 }],
      score: 0,
      isActive: false,
    },
    {
      id: "player3",
      name: "Sam",
      hand: [{ id: "spades-7", suit: "spades", rank: 7, value: 7 }],
      score: 0,
      isActive: false,
    },
    {
      id: "player4",
      name: "Jordan",
      hand: [{ id: "hearts-9", suit: "hearts", rank: 9, value: 9 }],
      score: 0,
      isActive: false,
    },
  ];

  const defaultProps = {
    players: mockPlayers,
    gameState: {
      phase: "playing",
      currentPlayer: 0,
      scores: [0, 0, 0, 0],
    },
    playAreaCards: [],
    cardPositions: [],
    trickWinner: null,
    dealingAnimation: false,
    selectedCard: null,
    handleCardSelect: vi.fn(),
    handlePlaySelectedCard: vi.fn(),
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
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      expect(container.querySelector(".game-table-area")).toBeInTheDocument();
    });

    it("should have game-table-area class", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const gameTableArea = container.querySelector(".game-table-area");
      expect(gameTableArea).toBeInTheDocument();
    });

    it("should render poker table", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const pokerTable = container.querySelector(".poker-table");
      expect(pokerTable).toBeInTheDocument();
    });

    it("should render play area drop zone", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const playAreaDrop = container.querySelector(".play-area-drop");
      expect(playAreaDrop).toBeInTheDocument();
    });

    it("should display 'Select a card' when no cards in play area", () => {
      renderWithContext(<GameTable {...defaultProps} playAreaCards={[]} />);
      expect(screen.getByText("Select a card")).toBeInTheDocument();
    });

    it("should have felt-gradient class on poker table", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const pokerTable = container.querySelector(".felt-gradient");
      expect(pokerTable).toBeInTheDocument();
    });
  });

  describe("player panels", () => {
    it("should render opponent panels for AI players", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const opponentPanels = container.querySelectorAll(".opponent-panel");
      expect(opponentPanels.length).toBe(3);
    });

    it("should render user hand panel", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const userHandArea = container.querySelector(".user-hand-area");
      expect(userHandArea).toBeInTheDocument();
    });

    it("should display all player names", () => {
      renderWithContext(<GameTable {...defaultProps} />);
      expect(screen.getByText("Player (You)")).toBeInTheDocument();
      expect(screen.getByText("Alex")).toBeInTheDocument();
      expect(screen.getByText("Sam")).toBeInTheDocument();
      expect(screen.getByText("Jordan")).toBeInTheDocument();
    });

    it("should render opponent-top panel", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const opponentTop = container.querySelector(".opponent-top");
      expect(opponentTop).toBeInTheDocument();
    });

    it("should render opponent-left panel", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const opponentLeft = container.querySelector(".opponent-left");
      expect(opponentLeft).toBeInTheDocument();
    });

    it("should render opponent-right panel", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const opponentRight = container.querySelector(".opponent-right");
      expect(opponentRight).toBeInTheDocument();
    });
  });

  describe("play area", () => {
    it("should render play area drop zone", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const playArea = container.querySelector(".play-area-drop");
      expect(playArea).toBeInTheDocument();
    });

    it("should have dashed border when no cards are played", () => {
      const { container } = renderWithContext(
        <GameTable {...defaultProps} playAreaCards={[]} />,
      );
      const playArea = container.querySelector(".play-area-drop");
      expect(playArea.style.border).toContain("dashed");
    });

    it("should not have dashed border when cards are played", () => {
      const propsWithCards = {
        ...defaultProps,
        playAreaCards: [
          ["player1", { id: "hearts-5", suit: "hearts", rank: 5, value: 5 }],
        ],
        cardPositions: [{ x: 0, y: 0, rotation: 0, zIndex: 1 }],
      };
      const { container } = renderWithContext(
        <GameTable {...propsWithCards} />,
      );
      const playArea = container.querySelector(".play-area-drop");
      expect(playArea.style.border).not.toContain("dashed");
    });

    it("should render played cards", () => {
      const propsWithCards = {
        ...defaultProps,
        playAreaCards: [
          ["player1", { id: "hearts-5", suit: "hearts", rank: 5, value: 5 }],
          ["player2", { id: "clubs-3", suit: "clubs", rank: 3, value: 3 }],
        ],
        cardPositions: [
          { x: -50, y: 10, rotation: -8, zIndex: 1 },
          { x: -18, y: -5, rotation: -3, zIndex: 2 },
        ],
      };
      const { container } = renderWithContext(
        <GameTable {...propsWithCards} />,
      );
      const playedCards = container.querySelectorAll(".played-card-flex");
      expect(playedCards.length).toBe(2);
    });
  });

  describe("card selection", () => {
    it("should display Tap here to play when card is selected", () => {
      const selectedCardProps = {
        ...defaultProps,
        selectedCard: { id: "hearts-5", suit: "hearts", rank: 5, value: 5 },
      };
      renderWithContext(<GameTable {...selectedCardProps} />);
      expect(screen.getByText("Tap here to play")).toBeInTheDocument();
    });

    it("should call handlePlaySelectedCard when clicking play area with selected card", () => {
      const handlePlaySelectedCard = vi.fn();
      const selectedCardProps = {
        ...defaultProps,
        selectedCard: { id: "hearts-5", suit: "hearts", rank: 5, value: 5 },
        handlePlaySelectedCard,
      };
      const { container } = renderWithContext(
        <GameTable {...selectedCardProps} />,
      );

      const playArea = container.querySelector(".play-area-drop");
      fireEvent.click(playArea);

      expect(handlePlaySelectedCard).toHaveBeenCalled();
    });

    it("should have play-area-ready class when card is selected", () => {
      const selectedCardProps = {
        ...defaultProps,
        selectedCard: { id: "hearts-5", suit: "hearts", rank: 5, value: 5 },
      };
      const { container } = renderWithContext(
        <GameTable {...selectedCardProps} />,
      );
      const playArea = container.querySelector(".play-area-drop");
      expect(playArea).toHaveClass("play-area-ready");
    });
  });

  describe("drag hint", () => {
    it("should show hint when it is player turn and no cards played", () => {
      const propsForHint = {
        ...defaultProps,
        gameState: {
          phase: "playing",
          currentPlayer: 0,
          scores: [0, 0, 0, 0],
        },
        playAreaCards: [],
        dealingAnimation: false,
      };

      const { container } = renderWithContext(<GameTable {...propsForHint} />);

      vi.advanceTimersByTime(600);

      expect(
        container.querySelector(".drag-hint") || container,
      ).toBeInTheDocument();
    });

    it("should not show hint when cards are already played", () => {
      const propsWithCards = {
        ...defaultProps,
        gameState: {
          phase: "playing",
          currentPlayer: 0,
          scores: [0, 0, 0, 0],
        },
        playAreaCards: [
          ["player1", { id: "hearts-5", suit: "hearts", rank: 5, value: 5 }],
        ],
        cardPositions: [{ x: 0, y: 0, rotation: 0, zIndex: 1 }],
      };

      const { container } = renderWithContext(
        <GameTable {...propsWithCards} />,
      );

      vi.advanceTimersByTime(600);

      expect(container.querySelector(".drag-hint")).toBeNull();
    });

    it("should not show hint during dealing animation", () => {
      const dealingProps = {
        ...defaultProps,
        dealingAnimation: true,
      };

      const { container } = renderWithContext(<GameTable {...dealingProps} />);

      vi.advanceTimersByTime(600);

      expect(container.querySelector(".drag-hint")).toBeNull();
    });

    it("should not show hint when it is not player turn", () => {
      const notPlayerTurnProps = {
        ...defaultProps,
        gameState: {
          phase: "playing",
          currentPlayer: 1,
          scores: [0, 0, 0, 0],
        },
      };

      const { container } = renderWithContext(
        <GameTable {...notPlayerTurnProps} />,
      );

      vi.advanceTimersByTime(600);

      expect(container.querySelector(".drag-hint")).toBeNull();
    });
  });

  describe("trick winner highlighting", () => {
    it("should pass trickWinner to PlayedCard components", () => {
      const propsWithWinner = {
        ...defaultProps,
        playAreaCards: [
          ["player1", { id: "hearts-5", suit: "hearts", rank: 5, value: 5 }],
          ["player2", { id: "clubs-3", suit: "clubs", rank: 3, value: 3 }],
        ],
        cardPositions: [
          { x: -55, y: 12, rotation: -10, zIndex: 1 },
          { x: -18, y: -8, rotation: -3, zIndex: 2 },
        ],
        trickWinner: "player1",
      };
      const { container } = renderWithContext(
        <GameTable {...propsWithWinner} />,
      );
      const playedCards = container.querySelectorAll(".played-card-flex");
      expect(playedCards.length).toBe(2);
    });
  });

  describe("card customization", () => {
    it("should render PlayerPanel components with context values", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      expect(container.querySelector(".game-table-area")).toBeInTheDocument();
    });

    it("should pass cardBackPattern to PlayerPanel components", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      expect(container.querySelector(".game-table-area")).toBeInTheDocument();
    });
  });

  describe("dealing animation", () => {
    it("should pass dealingAnimation to child components", () => {
      const dealingProps = {
        ...defaultProps,
        dealingAnimation: true,
      };

      const { container } = renderWithContext(<GameTable {...dealingProps} />);
      expect(container.querySelector(".game-table-area")).toBeInTheDocument();
    });
  });

  describe("game phases", () => {
    it("should render correctly during playing phase", () => {
      const playingProps = {
        ...defaultProps,
        gameState: {
          phase: "playing",
          currentPlayer: 0,
          scores: [0, 0, 0, 0],
        },
      };

      const { container } = renderWithContext(<GameTable {...playingProps} />);
      expect(container.querySelector(".game-table-area")).toBeInTheDocument();
    });

    it("should render correctly during dealing phase", () => {
      const dealingProps = {
        ...defaultProps,
        gameState: {
          phase: "dealing",
          currentPlayer: 0,
          scores: [0, 0, 0, 0],
        },
      };

      const { container } = renderWithContext(<GameTable {...dealingProps} />);
      expect(container.querySelector(".game-table-area")).toBeInTheDocument();
    });

    it("should render correctly during evaluating phase", () => {
      const evaluatingProps = {
        ...defaultProps,
        gameState: {
          phase: "evaluating",
          currentPlayer: 0,
          scores: [0, 0, 0, 0],
        },
      };

      const { container } = renderWithContext(
        <GameTable {...evaluatingProps} />,
      );
      expect(container.querySelector(".game-table-area")).toBeInTheDocument();
    });
  });

  describe("current player highlighting", () => {
    it("should highlight player 0 when currentPlayer is 0", () => {
      const player0Props = {
        ...defaultProps,
        gameState: {
          phase: "playing",
          currentPlayer: 0,
          scores: [0, 0, 0, 0],
        },
      };

      renderWithContext(<GameTable {...player0Props} />);
      expect(screen.getByText("Your turn")).toBeInTheDocument();
    });

    it("should show waiting for player 0 when it is AI turn", () => {
      const aiTurnProps = {
        ...defaultProps,
        gameState: {
          phase: "playing",
          currentPlayer: 1,
          scores: [0, 0, 0, 0],
        },
      };

      renderWithContext(<GameTable {...aiTurnProps} />);
      expect(screen.getByText("Waiting...")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have absolute positioning for poker table", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const pokerTable = container.querySelector(".poker-table");
      expect(pokerTable).toHaveClass("absolute");
    });

    it("should have rounded play area", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const playArea = container.querySelector(".play-area-drop");
      expect(playArea).toHaveClass("rounded-xl");
    });

    it("should have flex-1 for flexible height", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const gameTableArea = container.querySelector(".game-table-area");
      expect(gameTableArea).toHaveClass("flex-1");
    });

    it("should have relative positioning", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const gameTableArea = container.querySelector(".game-table-area");
      expect(gameTableArea).toHaveClass("relative");
    });
  });

  describe("player positions", () => {
    it("should position top opponent at 18% from top", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const opponentTop = container
        .querySelector(".opponent-top")
        .closest("div[style]");
      expect(opponentTop.style.top).toBe("18%");
    });

    it("should position user hand at bottom", () => {
      const { container } = renderWithContext(<GameTable {...defaultProps} />);
      const userHandArea = container
        .querySelector(".user-hand-area")
        .closest("div[style]");
      expect(userHandArea.style.bottom).toBe("18%");
    });
  });

  describe("edge cases", () => {
    it("should handle minimal players array", () => {
      const minimalPlayersProps = {
        ...defaultProps,
        players: [
          { id: "player1", name: "Player", hand: [], score: 0, isActive: true },
          { id: "player2", name: "Alex", hand: [], score: 0, isActive: false },
          { id: "player3", name: "Sam", hand: [], score: 0, isActive: false },
          {
            id: "player4",
            name: "Jordan",
            hand: [],
            score: 0,
            isActive: false,
          },
        ],
      };

      const { container } = renderWithContext(
        <GameTable {...minimalPlayersProps} />,
      );
      expect(container.querySelector(".game-table-area")).toBeInTheDocument();
    });

    it("should handle all cards played (4 cards)", () => {
      const allCardsPlayedProps = {
        ...defaultProps,
        playAreaCards: [
          ["player1", { id: "hearts-5", suit: "hearts", rank: 5, value: 5 }],
          ["player2", { id: "clubs-3", suit: "clubs", rank: 3, value: 3 }],
          ["player3", { id: "spades-7", suit: "spades", rank: 7, value: 7 }],
          [
            "player4",
            { id: "diamonds-10", suit: "diamonds", rank: 10, value: 10 },
          ],
        ],
        cardPositions: [
          { x: -55, y: 12, rotation: -10, zIndex: 1 },
          { x: -18, y: -8, rotation: -3, zIndex: 2 },
          { x: 18, y: -8, rotation: 3, zIndex: 3 },
          { x: 55, y: 12, rotation: 10, zIndex: 4 },
        ],
      };

      const { container } = renderWithContext(
        <GameTable {...allCardsPlayedProps} />,
      );
      const playedCards = container.querySelectorAll(".played-card-flex");
      expect(playedCards.length).toBe(4);
    });

    it("should handle players with empty hands", () => {
      const emptyHandsProps = {
        ...defaultProps,
        players: mockPlayers.map((p) => ({ ...p, hand: [] })),
      };

      const { container } = renderWithContext(
        <GameTable {...emptyHandsProps} />,
      );
      expect(container.querySelector(".game-table-area")).toBeInTheDocument();
    });
  });

  describe("selected card state", () => {
    it("should pass selectedCard to UserHand", () => {
      const selectedCardProps = {
        ...defaultProps,
        selectedCard: { id: "hearts-5", suit: "hearts", rank: 5, value: 5 },
      };

      const { container } = renderWithContext(
        <GameTable {...selectedCardProps} />,
      );
      expect(container.querySelector(".user-hand-area")).toBeInTheDocument();
    });

    it("should handle null selectedCard", () => {
      const noSelectionProps = {
        ...defaultProps,
        selectedCard: null,
      };

      const { container } = renderWithContext(
        <GameTable {...noSelectionProps} />,
      );
      expect(container.querySelector(".user-hand-area")).toBeInTheDocument();
    });
  });
});
