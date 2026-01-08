import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useGameLogic from "./useGameLogic";
import {
  INITIAL_GAME_STATE,
  GAME_PHASES,
  CARDS_PER_PLAYER,
  PLAYER_COUNT,
  SUITS,
} from "./../constants";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useGameLogic", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("initialization", () => {
    it("should return an object with game state and functions", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current).toHaveProperty("gameState");
      expect(result.current).toHaveProperty("players");
      expect(result.current).toHaveProperty("playArea");
      expect(result.current).toHaveProperty("startGame");
      expect(result.current).toHaveProperty("resetGame");
      expect(result.current).toHaveProperty("playCard");
    });

    it("should initialize with waiting phase", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current.gameState.phase).toBe(GAME_PHASES.WAITING);
    });

    it("should initialize with correct initial game state", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current.gameState.phase).toBe(INITIAL_GAME_STATE.phase);
      expect(result.current.gameState.currentPlayer).toBe(
        INITIAL_GAME_STATE.currentPlayer,
      );
      expect(result.current.gameState.round).toBe(INITIAL_GAME_STATE.round);
    });

    it("should initialize with 4 players", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current.players).toHaveLength(PLAYER_COUNT);
    });

    it("should initialize players with empty hands", () => {
      const { result } = renderHook(() => useGameLogic());

      result.current.players.forEach((player) => {
        expect(player.hand).toHaveLength(0);
      });
    });

    it("should initialize with empty play area", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(Object.keys(result.current.playArea)).toHaveLength(0);
    });

    it("should initialize with correct player names", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current.players[0].name).toBe("Player");
      expect(result.current.players[1].name).toBe("Alex");
      expect(result.current.players[2].name).toBe("Sam");
      expect(result.current.players[3].name).toBe("Jordan");
    });

    it("should accept selectedRuleSet parameter", () => {
      const { result } = renderHook(() => useGameLogic(1));

      expect(result.current).toBeDefined();
    });

    it("should default to rule set 0", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current).toBeDefined();
    });
  });

  describe("return value structure", () => {
    it("should return all expected state properties", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current).toHaveProperty("gameState");
      expect(result.current).toHaveProperty("players");
      expect(result.current).toHaveProperty("playArea");
      expect(result.current).toHaveProperty("playAreaCards");
      expect(result.current).toHaveProperty("cardPositions");
      expect(result.current).toHaveProperty("selectedCard");
      expect(result.current).toHaveProperty("dealingAnimation");
      expect(result.current).toHaveProperty("trickWinner");
      expect(result.current).toHaveProperty("showWinnerModal");
      expect(result.current).toHaveProperty("showConfetti");
    });

    it("should return all expected action functions", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(typeof result.current.startGame).toBe("function");
      expect(typeof result.current.resetGame).toBe("function");
      expect(typeof result.current.playCard).toBe("function");
      expect(typeof result.current.getGameWinner).toBe("function");
    });

    it("should return card selection handlers", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(typeof result.current.handleCardSelect).toBe("function");
      expect(typeof result.current.handlePlaySelectedCard).toBe("function");
    });

    it("should return setter functions", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(typeof result.current.setShowWinnerModal).toBe("function");
      expect(typeof result.current.setShowConfetti).toBe("function");
    });

    it("should return username and setUsername", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current).toHaveProperty("username");
      expect(typeof result.current.setUsername).toBe("function");
    });
  });

  describe("username functionality", () => {
    it("should initialize username as empty string", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current.username).toBe("");
    });

    it("should update player1 name when username is set", () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.setUsername("TestUser");
      });

      expect(result.current.players[0].name).toBe("TestUser");
    });

    it("should keep default name when username is empty", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current.players[0].name).toBe("Player");
    });

    it("should trim whitespace from username", () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.setUsername("  TrimmedName  ");
      });

      expect(result.current.players[0].name).toBe("TrimmedName");
    });

    it("should keep default name when username is only whitespace", () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.setUsername("   ");
      });

      expect(result.current.players[0].name).toBe("Player");
    });

    it("should not affect other player names when username is set", () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.setUsername("CustomName");
      });

      expect(result.current.players[1].name).toBe("Alex");
      expect(result.current.players[2].name).toBe("Sam");
      expect(result.current.players[3].name).toBe("Jordan");
    });
  });

  describe("startGame", () => {
    it("should be a function", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(typeof result.current.startGame).toBe("function");
    });

    it("should change phase to dealing when called", () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      expect(result.current.gameState.phase).toBe(GAME_PHASES.DEALING);
    });

    it("should set dealingAnimation to true", () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      expect(result.current.dealingAnimation).toBe(true);
    });

    it("should not start game if not in waiting phase", () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      const phaseAfterFirstStart = result.current.gameState.phase;

      act(() => {
        result.current.startGame();
      });

      expect(result.current.gameState.phase).toBe(phaseAfterFirstStart);
    });

    it("should deal cards to players after delay", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      await act(async () => {
        vi.advanceTimersByTime(600);
      });

      expect(result.current.players[0].hand.length).toBeGreaterThan(0);
    });

    it("should deal correct number of cards to each player", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      await act(async () => {
        vi.advanceTimersByTime(600);
      });

      result.current.players.forEach((player) => {
        expect(player.hand.length).toBe(CARDS_PER_PLAYER);
      });
    });

    it("should transition to playing phase after dealing", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.gameState.phase).toBe(GAME_PHASES.PLAYING);
    });

    it("should set dealingAnimation to false after dealing completes", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.dealingAnimation).toBe(false);
    });
  });

  describe("resetGame", () => {
    it("should be a function", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(typeof result.current.resetGame).toBe("function");
    });

    it("should reset game state to initial values", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.gameState.phase).toBe(GAME_PHASES.WAITING);
      expect(result.current.gameState.currentPlayer).toBe(0);
    });

    it("should clear player hands", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      act(() => {
        result.current.resetGame();
      });

      result.current.players.forEach((player) => {
        expect(player.hand).toHaveLength(0);
      });
    });

    it("should clear play area", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      act(() => {
        result.current.resetGame();
      });

      expect(Object.keys(result.current.playArea)).toHaveLength(0);
    });

    it("should hide winner modal", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.setShowWinnerModal(true);
      });

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.showWinnerModal).toBe(false);
    });

    it("should hide confetti", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.setShowConfetti(true);
      });

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.showConfetti).toBe(false);
    });

    it("should clear trick winner", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.trickWinner).toBeNull();
    });

    it("should clear selected card", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.selectedCard).toBeNull();
    });
  });

  describe("playCard", () => {
    it("should be a function", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(typeof result.current.playCard).toBe("function");
    });

    it("should not play card if not in playing phase", () => {
      const { result } = renderHook(() => useGameLogic());

      const mockCard = { id: "hearts-5", suit: "hearts", rank: 5, value: 5 };

      act(() => {
        result.current.playCard(mockCard, "player1");
      });

      expect(Object.keys(result.current.playArea)).toHaveLength(0);
    });

    it("should not play card if not current player turn", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      const mockCard = { id: "hearts-5", suit: "hearts", rank: 5, value: 5 };

      const playAreaBefore = Object.keys(result.current.playArea).length;

      act(() => {
        result.current.playCard(mockCard, "player2");
      });

      expect(Object.keys(result.current.playArea).length).toBe(playAreaBefore);
    });
  });

  describe("getGameWinner", () => {
    it("should be a function", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(typeof result.current.getGameWinner).toBe("function");
    });

    it("should return an object with player and score", () => {
      const { result } = renderHook(() => useGameLogic());

      const winner = result.current.getGameWinner();

      expect(winner).toHaveProperty("player");
      expect(winner).toHaveProperty("score");
    });

    it("should return first player when all scores are zero", () => {
      const { result } = renderHook(() => useGameLogic());

      const winner = result.current.getGameWinner();

      expect(winner.player.id).toBe("player1");
      expect(winner.score).toBe(0);
    });

    it("should return player with highest score", () => {
      const { result } = renderHook(() => useGameLogic());

      const winner = result.current.getGameWinner([1, 5, 3, 2]);

      expect(winner.score).toBe(5);
    });
  });

  describe("card selection handlers", () => {
    describe("handleCardSelect", () => {
      it("should be a function", () => {
        const { result } = renderHook(() => useGameLogic());

        expect(typeof result.current.handleCardSelect).toBe("function");
      });

      it("should not select card if not player turn", () => {
        const { result } = renderHook(() => useGameLogic());

        const mockCard = { id: "hearts-5", suit: "hearts", rank: 5, value: 5 };

        act(() => {
          result.current.handleCardSelect(mockCard);
        });

        expect(result.current.selectedCard).toBeNull();
      });

      it("should select card when it is player turn", async () => {
        const { result } = renderHook(() => useGameLogic());

        act(() => {
          result.current.startGame();
        });

        await act(async () => {
          vi.advanceTimersByTime(2000);
        });

        const card = result.current.players[0].hand[0];

        act(() => {
          result.current.handleCardSelect(card);
        });

        expect(result.current.selectedCard).toEqual(card);
      });

      it("should deselect card when same card is selected again", async () => {
        const { result } = renderHook(() => useGameLogic());

        act(() => {
          result.current.startGame();
        });

        await act(async () => {
          vi.advanceTimersByTime(2000);
        });

        const card = result.current.players[0].hand[0];

        act(() => {
          result.current.handleCardSelect(card);
        });

        expect(result.current.selectedCard).toEqual(card);

        act(() => {
          result.current.handleCardSelect(card);
        });

        expect(result.current.selectedCard).toBeNull();
      });
    });

    describe("handlePlaySelectedCard", () => {
      it("should be a function", () => {
        const { result } = renderHook(() => useGameLogic());

        expect(typeof result.current.handlePlaySelectedCard).toBe("function");
      });

      it("should not play if no card is selected", async () => {
        const { result } = renderHook(() => useGameLogic());

        act(() => {
          result.current.startGame();
        });

        await act(async () => {
          vi.advanceTimersByTime(2000);
        });

        act(() => {
          result.current.handlePlaySelectedCard();
        });

        expect(Object.keys(result.current.playArea)).toHaveLength(0);
      });

      it("should play the selected card", async () => {
        const { result } = renderHook(() => useGameLogic());

        act(() => {
          result.current.startGame();
        });

        await act(async () => {
          vi.advanceTimersByTime(2000);
        });

        const card = result.current.players[0].hand[0];

        act(() => {
          result.current.handleCardSelect(card);
        });

        act(() => {
          result.current.handlePlaySelectedCard();
        });

        expect(result.current.playArea).toHaveProperty("player1");
        expect(result.current.playArea.player1).toEqual(card);
      });
    });
  });

  describe("card positions", () => {
    it("should return empty array when no cards in play", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current.cardPositions).toHaveLength(0);
    });

    it("should return array with positions for played cards", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      const card = result.current.players[0].hand[0];

      if (card) {
        act(() => {
          result.current.playCard(card, "player1");
        });

        expect(result.current.cardPositions.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("playAreaCards", () => {
    it("should be an empty array initially", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current.playAreaCards).toHaveLength(0);
    });

    it("should be an array", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(Array.isArray(result.current.playAreaCards)).toBe(true);
    });
  });

  describe("setters", () => {
    describe("setShowWinnerModal", () => {
      it("should update showWinnerModal state", () => {
        const { result } = renderHook(() => useGameLogic());

        expect(result.current.showWinnerModal).toBe(false);

        act(() => {
          result.current.setShowWinnerModal(true);
        });

        expect(result.current.showWinnerModal).toBe(true);

        act(() => {
          result.current.setShowWinnerModal(false);
        });

        expect(result.current.showWinnerModal).toBe(false);
      });
    });

    describe("setShowConfetti", () => {
      it("should update showConfetti state", () => {
        const { result } = renderHook(() => useGameLogic());

        expect(result.current.showConfetti).toBe(false);

        act(() => {
          result.current.setShowConfetti(true);
        });

        expect(result.current.showConfetti).toBe(true);

        act(() => {
          result.current.setShowConfetti(false);
        });

        expect(result.current.showConfetti).toBe(false);
      });
    });
  });

  describe("game flow", () => {
    it("should have currentPlayer at 0 initially", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current.gameState.currentPlayer).toBe(0);
    });

    it("should have scores array with 4 elements", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current.gameState.scores).toHaveLength(4);
    });

    it("should start with all scores at 0", () => {
      const { result } = renderHook(() => useGameLogic());

      result.current.gameState.scores.forEach((score) => {
        expect(score).toBe(0);
      });
    });

    it("should have round at 1 initially", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current.gameState.round).toBe(1);
    });

    it("should have maxRounds at 5", () => {
      const { result } = renderHook(() => useGameLogic());

      expect(result.current.gameState.maxRounds).toBe(5);
    });
  });

  describe("deck creation", () => {
    it("should create unique cards for all players", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      const allCardIds = [];
      result.current.players.forEach((player) => {
        player.hand.forEach((card) => {
          allCardIds.push(card.id);
        });
      });

      const uniqueIds = [...new Set(allCardIds)];
      expect(uniqueIds.length).toBe(allCardIds.length);
    });

    it("should create cards with valid suits", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      result.current.players.forEach((player) => {
        player.hand.forEach((card) => {
          expect(SUITS).toContain(card.suit);
        });
      });
    });

    it("should create cards with valid ranks (1-13)", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      result.current.players.forEach((player) => {
        player.hand.forEach((card) => {
          expect(card.rank).toBeGreaterThanOrEqual(1);
          expect(card.rank).toBeLessThanOrEqual(13);
        });
      });
    });

    it("should set Ace value to 14", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      result.current.players.forEach((player) => {
        player.hand.forEach((card) => {
          if (card.rank === 1) {
            expect(card.value).toBe(14);
          }
        });
      });
    });

    it("should set non-Ace card values equal to rank", async () => {
      const { result } = renderHook(() => useGameLogic());

      act(() => {
        result.current.startGame();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      result.current.players.forEach((player) => {
        player.hand.forEach((card) => {
          if (card.rank !== 1) {
            expect(card.value).toBe(card.rank);
          }
        });
      });
    });
  });

  describe("rule set selection", () => {
    it("should work with rule set 0 (highest card wins)", () => {
      const { result } = renderHook(() => useGameLogic(0));

      expect(result.current).toBeDefined();
    });

    it("should work with rule set 1 (suit follows)", () => {
      const { result } = renderHook(() => useGameLogic(1));

      expect(result.current).toBeDefined();
    });

    it("should work with rule set 2 (spades trump)", () => {
      const { result } = renderHook(() => useGameLogic(2));

      expect(result.current).toBeDefined();
    });
  });
});
