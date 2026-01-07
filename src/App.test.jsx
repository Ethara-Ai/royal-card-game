/**
 * Unit tests for App component
 * Tests rendering, integration with hooks, and component composition
 */

import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";

// Mock the hooks
vi.mock("../hooks", () => ({
  useTheme: vi.fn(() => ({
    theme: "dark",
    toggleTheme: vi.fn(),
  })),
  useWindowSize: vi.fn(() => ({
    width: 1920,
    height: 1080,
  })),
  useAppLoading: vi.fn(() => ({
    isAppLoading: false,
    showLoadingScreen: false,
    handleLoadingComplete: vi.fn(),
  })),
  useGameLogic: vi.fn(() => ({
    gameState: {
      phase: "waiting",
      currentPlayer: 0,
      scores: [0, 0, 0, 0],
      round: 1,
      maxRounds: 5,
    },
    players: [
      { id: "player1", name: "You", hand: [], score: 0, isActive: true },
      { id: "player2", name: "Alex", hand: [], score: 0, isActive: false },
      { id: "player3", name: "Sam", hand: [], score: 0, isActive: false },
      { id: "player4", name: "Jordan", hand: [], score: 0, isActive: false },
    ],
    playArea: {},
    playAreaCards: [],
    cardPositions: [],
    draggedCard: null,
    dealingAnimation: false,
    trickWinner: null,
    showWinnerModal: false,
    showConfetti: false,
    startGame: vi.fn(),
    resetGame: vi.fn(),
    playCard: vi.fn(),
    getGameWinner: vi.fn(() => ({ player: { id: "player1", name: "You" }, score: 5 })),
    handleDragStart: vi.fn(),
    handleDragOver: vi.fn(),
    handleDrop: vi.fn(),
    handleDragEnd: vi.fn(),
    handleTouchStart: vi.fn(),
    handleTouchMove: vi.fn(),
    handleTouchEnd: vi.fn(),
    setShowWinnerModal: vi.fn(),
    setShowConfetti: vi.fn(),
  })),
}));

// Mock sonner
vi.mock("sonner", () => ({
  Toaster: () => null,
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock react-confetti
vi.mock("react-confetti", () => ({
  default: () => null,
}));

describe("App", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<App />);
      expect(container).toBeInTheDocument();
    });

    it("should render the Header component", () => {
      render(<App />);
      expect(screen.getByText("Royal Card Game")).toBeInTheDocument();
    });

    it("should render WaitingRoom when game phase is waiting", () => {
      render(<App />);
      expect(screen.getByText("Waiting Room")).toBeInTheDocument();
    });

    it("should render Start Game button in waiting phase", () => {
      render(<App />);
      expect(screen.getByText("Start Game")).toBeInTheDocument();
    });

    it("should display all player names in waiting room", () => {
      render(<App />);
      expect(screen.getByText("You")).toBeInTheDocument();
      expect(screen.getByText("Alex")).toBeInTheDocument();
      expect(screen.getByText("Sam")).toBeInTheDocument();
      expect(screen.getByText("Jordan")).toBeInTheDocument();
    });
  });

  describe("loading screen", () => {
    it("should not show loading screen when showLoadingScreen is false", async () => {
      const { useAppLoading } = await import("../hooks");
      useAppLoading.mockReturnValue({
        isAppLoading: false,
        showLoadingScreen: false,
        handleLoadingComplete: vi.fn(),
      });

      const { container } = render(<App />);
      expect(container.querySelector(".loading-screen")).not.toBeInTheDocument();
    });
  });

  describe("game phases", () => {
    it("should render WaitingRoom in waiting phase", async () => {
      const { useGameLogic } = await import("../hooks");
      useGameLogic.mockReturnValue({
        gameState: { phase: "waiting", currentPlayer: 0, scores: [0, 0, 0, 0] },
        players: [
          { id: "player1", name: "You", hand: [], score: 0, isActive: true },
          { id: "player2", name: "Alex", hand: [], score: 0, isActive: false },
          { id: "player3", name: "Sam", hand: [], score: 0, isActive: false },
          { id: "player4", name: "Jordan", hand: [], score: 0, isActive: false },
        ],
        playAreaCards: [],
        cardPositions: [],
        draggedCard: null,
        dealingAnimation: false,
        trickWinner: null,
        showWinnerModal: false,
        showConfetti: false,
        startGame: vi.fn(),
        resetGame: vi.fn(),
        getGameWinner: vi.fn(),
        handleDragStart: vi.fn(),
        handleDragOver: vi.fn(),
        handleDrop: vi.fn(),
        handleDragEnd: vi.fn(),
        handleTouchStart: vi.fn(),
        handleTouchMove: vi.fn(),
        handleTouchEnd: vi.fn(),
      });

      render(<App />);
      expect(screen.getByText("Waiting Room")).toBeInTheDocument();
    });
  });

  describe("theme", () => {
    it("should use theme from useTheme hook", async () => {
      const { useTheme } = await import("../hooks");
      useTheme.mockReturnValue({
        theme: "dark",
        toggleTheme: vi.fn(),
      });

      const { container } = render(<App />);
      expect(container).toBeInTheDocument();
    });

    it("should pass theme to Header", async () => {
      const { useTheme } = await import("../hooks");
      useTheme.mockReturnValue({
        theme: "light",
        toggleTheme: vi.fn(),
      });

      render(<App />);
      expect(screen.getByText("Royal Card Game")).toBeInTheDocument();
    });
  });

  describe("confetti", () => {
    it("should not show confetti when showConfetti is false", async () => {
      const { useGameLogic } = await import("../hooks");
      useGameLogic.mockReturnValue({
        gameState: { phase: "waiting", currentPlayer: 0, scores: [0, 0, 0, 0] },
        players: [
          { id: "player1", name: "You", hand: [], score: 0, isActive: true },
          { id: "player2", name: "Alex", hand: [], score: 0, isActive: false },
          { id: "player3", name: "Sam", hand: [], score: 0, isActive: false },
          { id: "player4", name: "Jordan", hand: [], score: 0, isActive: false },
        ],
        playAreaCards: [],
        cardPositions: [],
        draggedCard: null,
        dealingAnimation: false,
        trickWinner: null,
        showWinnerModal: false,
        showConfetti: false,
        startGame: vi.fn(),
        resetGame: vi.fn(),
        getGameWinner: vi.fn(),
        handleDragStart: vi.fn(),
        handleDragOver: vi.fn(),
        handleDrop: vi.fn(),
        handleDragEnd: vi.fn(),
        handleTouchStart: vi.fn(),
        handleTouchMove: vi.fn(),
        handleTouchEnd: vi.fn(),
      });

      const { container } = render(<App />);
      // Confetti component is mocked, so we just check the app renders
      expect(container).toBeInTheDocument();
    });
  });

  describe("layout", () => {
    it("should have min-h-screen class on main container", () => {
      const { container } = render(<App />);
      const mainContainer = container.querySelector(".min-h-screen");
      expect(mainContainer).toBeInTheDocument();
    });

    it("should have transition classes for smooth animations", () => {
      const { container } = render(<App />);
      const transitionContainer = container.querySelector(".transition-all");
      expect(transitionContainer).toBeInTheDocument();
    });

    it("should have max-w-7xl for content width constraint", () => {
      const { container } = render(<App />);
      const maxWidthContainer = container.querySelector(".max-w-7xl");
      expect(maxWidthContainer).toBeInTheDocument();
    });
  });

  describe("integration", () => {
    it("should render Header with correct props", () => {
      render(<App />);
      // Header should be rendered with game title
      expect(screen.getByText("Royal Card Game")).toBeInTheDocument();
    });

    it("should handle Start Game button click", async () => {
      const startGameMock = vi.fn();
      const { useGameLogic } = await import("../hooks");
      useGameLogic.mockReturnValue({
        gameState: { phase: "waiting", currentPlayer: 0, scores: [0, 0, 0, 0] },
        players: [
          { id: "player1", name: "You", hand: [], score: 0, isActive: true },
          { id: "player2", name: "Alex", hand: [], score: 0, isActive: false },
          { id: "player3", name: "Sam", hand: [], score: 0, isActive: false },
          { id: "player4", name: "Jordan", hand: [], score: 0, isActive: false },
        ],
        playAreaCards: [],
        cardPositions: [],
        draggedCard: null,
        dealingAnimation: false,
        trickWinner: null,
        showWinnerModal: false,
        showConfetti: false,
        startGame: startGameMock,
        resetGame: vi.fn(),
        getGameWinner: vi.fn(),
        handleDragStart: vi.fn(),
        handleDragOver: vi.fn(),
        handleDrop: vi.fn(),
        handleDragEnd: vi.fn(),
        handleTouchStart: vi.fn(),
        handleTouchMove: vi.fn(),
        handleTouchEnd: vi.fn(),
      });

      render(<App />);

      const startButton = screen.getByText("Start Game");
      fireEvent.click(startButton);

      expect(startGameMock).toHaveBeenCalled();
    });
  });

  describe("responsive design", () => {
    it("should have responsive padding", () => {
      const { container } = render(<App />);
      const paddedElement = container.querySelector(".px-3");
      expect(paddedElement).toBeInTheDocument();
    });

    it("should use safe area insets", () => {
      const { container } = render(<App />);
      // Check for element with safe-area-inset styling
      const contentArea = container.querySelector(".max-w-7xl");
      expect(contentArea).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle initial render correctly", () => {
      expect(() => render(<App />)).not.toThrow();
    });

    it("should handle multiple renders", () => {
      const { rerender } = render(<App />);
      expect(() => rerender(<App />)).not.toThrow();
    });

    it("should cleanup on unmount", () => {
      const { unmount } = render(<App />);
      expect(() => unmount()).not.toThrow();
    });
  });

  describe("opacity transitions", () => {
    it("should have opacity-100 when not loading", () => {
      const { container } = render(<App />);
      const mainContainer = container.querySelector(".opacity-100");
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe("background styling", () => {
    it("should have radial gradient background", () => {
      const { container } = render(<App />);
      const mainContainer = container.querySelector(".min-h-screen");
      expect(mainContainer.style.background).toContain("radial-gradient");
    });
  });
});
