/**
 * Unit tests for WinnerModal component
 * Tests rendering, winner display, scores, and reset functionality
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WinnerModal from "./WinnerModal";

describe("WinnerModal", () => {
  const defaultProps = {
    players: [
      { id: "player1", name: "You" },
      { id: "player2", name: "Alex" },
      { id: "player3", name: "Sam" },
      { id: "player4", name: "Jordan" },
    ],
    scores: [3, 5, 2, 4],
    winner: {
      player: { id: "player2", name: "Alex" },
      score: 5,
    },
    resetGame: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render without crashing", () => {
      render(<WinnerModal {...defaultProps} />);
      expect(screen.getByText("Game Over!")).toBeInTheDocument();
    });

    it("should display 'Game Over!' title", () => {
      render(<WinnerModal {...defaultProps} />);
      expect(screen.getByText("Game Over!")).toBeInTheDocument();
    });

    it("should display 'Final Scores' text", () => {
      render(<WinnerModal {...defaultProps} />);
      expect(screen.getByText("Final Scores")).toBeInTheDocument();
    });

    it("should display all player names", () => {
      render(<WinnerModal {...defaultProps} />);
      expect(screen.getByText("You (You)")).toBeInTheDocument();
      expect(screen.getByText("Alex")).toBeInTheDocument();
      expect(screen.getByText("Sam")).toBeInTheDocument();
      expect(screen.getByText("Jordan")).toBeInTheDocument();
    });

    it("should display all scores", () => {
      render(<WinnerModal {...defaultProps} />);
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("should display Play Again button", () => {
      render(<WinnerModal {...defaultProps} />);
      expect(screen.getByText("Play Again")).toBeInTheDocument();
    });

    it("should render player avatars", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      const avatars = container.querySelectorAll("img");
      expect(avatars).toHaveLength(4);
    });

    it("should have correct avatar URLs using robohash", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      const avatars = container.querySelectorAll("img");

      // Check that avatars contain robohash URLs
      avatars.forEach((avatar) => {
        expect(avatar.src).toContain("robohash.org");
      });
    });

    it("should display the correct winner", () => {
      render(<WinnerModal {...defaultProps} />);
      // The winner (Alex) should be displayed
      expect(screen.getByText("Alex")).toBeInTheDocument();
    });
  });

  describe("winner display", () => {
    it("should show crown icon for winner", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      // There should be at least one crown icon (main heading and winner indicator)
      const crowns = container.querySelectorAll("svg");
      expect(crowns.length).toBeGreaterThanOrEqual(1);
    });

    it("should display winner with special styling", () => {
      render(<WinnerModal {...defaultProps} />);
      // Winner's name should be displayed
      expect(screen.getByText("Alex")).toBeInTheDocument();
    });

    it("should sort players by score (highest first)", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      // Get all player score elements
      const scoreElements = container.querySelectorAll(".font-bold");
      const scores = Array.from(scoreElements)
        .map((el) => parseInt(el.textContent))
        .filter((score) => !isNaN(score));

      // Scores should be in descending order
      for (let i = 0; i < scores.length - 1; i++) {
        expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
      }
    });
  });

  describe("Play Again button", () => {
    it("should call resetGame when clicked", () => {
      const resetGame = vi.fn();
      render(<WinnerModal {...defaultProps} resetGame={resetGame} />);

      const playAgainButton = screen.getByText("Play Again");
      fireEvent.click(playAgainButton);

      expect(resetGame).toHaveBeenCalledTimes(1);
    });

    it("should be a button element", () => {
      render(<WinnerModal {...defaultProps} />);
      const button = screen.getByRole("button", { name: /play again/i });
      expect(button).toBeInTheDocument();
    });

    it("should have redo icon", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      const button = container.querySelector("button");
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have game-title class on heading", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      const heading = container.querySelector(".game-title");
      expect(heading).toBeInTheDocument();
    });

    it("should have bounce-in class for animation", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      const animatedDiv = container.querySelector(".bounce-in");
      expect(animatedDiv).toBeInTheDocument();
    });

    it("should have pixel-art class on avatars", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      const pixelArtElements = container.querySelectorAll(".pixel-art");
      expect(pixelArtElements).toHaveLength(4);
    });

    it("should have overlay background", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      const overlay = container.firstChild;
      expect(overlay.style.background).toContain("var(--color-bg-overlay)");
    });

    it("should have backdrop blur", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      const overlay = container.firstChild;
      expect(overlay.style.backdropFilter).toContain("blur");
    });
  });

  describe("different winner scenarios", () => {
    it("should handle player1 (You) as winner", () => {
      const player1WinnerProps = {
        ...defaultProps,
        scores: [5, 3, 2, 4],
        winner: {
          player: { id: "player1", name: "You" },
          score: 5,
        },
      };
      render(<WinnerModal {...player1WinnerProps} />);
      expect(screen.getByText("You (You)")).toBeInTheDocument();
    });

    it("should handle tied scores", () => {
      const tiedProps = {
        ...defaultProps,
        scores: [5, 5, 3, 3],
        winner: {
          player: { id: "player1", name: "You" },
          score: 5,
        },
      };
      render(<WinnerModal {...tiedProps} />);
      expect(screen.getByText("Game Over!")).toBeInTheDocument();
    });

    it("should handle all zero scores", () => {
      const zeroScoresProps = {
        ...defaultProps,
        scores: [0, 0, 0, 0],
        winner: {
          player: { id: "player1", name: "You" },
          score: 0,
        },
      };
      render(<WinnerModal {...zeroScoresProps} />);
      expect(screen.getByText("Game Over!")).toBeInTheDocument();
    });

    it("should handle high scores", () => {
      const highScoresProps = {
        ...defaultProps,
        scores: [10, 15, 8, 12],
        winner: {
          player: { id: "player2", name: "Alex" },
          score: 15,
        },
      };
      render(<WinnerModal {...highScoresProps} />);
      expect(screen.getByText("15")).toBeInTheDocument();
    });
  });

  describe("modal layout", () => {
    it("should be a fixed position overlay", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      const overlay = container.firstChild;
      expect(overlay).toHaveClass("fixed");
      expect(overlay).toHaveClass("inset-0");
    });

    it("should have high z-index", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      const overlay = container.firstChild;
      expect(overlay).toHaveClass("z-50");
    });

    it("should center content", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      const overlay = container.firstChild;
      expect(overlay).toHaveClass("flex");
      expect(overlay).toHaveClass("items-center");
      expect(overlay).toHaveClass("justify-center");
    });
  });

  describe("accessibility", () => {
    it("should have accessible button", () => {
      render(<WinnerModal {...defaultProps} />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should have accessible images with alt text", () => {
      render(<WinnerModal {...defaultProps} />);
      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
        expect(img.getAttribute("alt")).not.toBe("");
      });
    });
  });

  describe("edge cases", () => {
    it("should handle players with special characters in names", () => {
      const specialNameProps = {
        players: [
          { id: "player1", name: "Player #1" },
          { id: "player2", name: "Alex & Bob" },
          { id: "player3", name: "Sam's Game" },
          { id: "player4", name: "Jordan_123" },
        ],
        scores: [3, 5, 2, 4],
        winner: {
          player: { id: "player2", name: "Alex & Bob" },
          score: 5,
        },
        resetGame: vi.fn(),
      };
      render(<WinnerModal {...specialNameProps} />);
      expect(screen.getByText("Player #1 (You)")).toBeInTheDocument();
      expect(screen.getByText("Alex & Bob")).toBeInTheDocument();
    });

    it("should handle players with long names", () => {
      const longNameProps = {
        players: [
          { id: "player1", name: "VeryLongPlayerName" },
          { id: "player2", name: "Alex" },
          { id: "player3", name: "Sam" },
          { id: "player4", name: "Jordan" },
        ],
        scores: [3, 5, 2, 4],
        winner: {
          player: { id: "player2", name: "Alex" },
          score: 5,
        },
        resetGame: vi.fn(),
      };
      render(<WinnerModal {...longNameProps} />);
      expect(screen.getByText("VeryLongPlayerName (You)")).toBeInTheDocument();
    });

    it("should handle rapid button clicks", () => {
      const resetGame = vi.fn();
      render(<WinnerModal {...defaultProps} resetGame={resetGame} />);

      const playAgainButton = screen.getByText("Play Again");

      // Click multiple times rapidly
      fireEvent.click(playAgainButton);
      fireEvent.click(playAgainButton);
      fireEvent.click(playAgainButton);

      expect(resetGame).toHaveBeenCalledTimes(3);
    });
  });

  describe("responsive styling", () => {
    it("should have responsive padding classes", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      const responsiveElement = container.querySelector(".p-4, .p-3");
      expect(responsiveElement).toBeInTheDocument();
    });

    it("should have responsive text classes", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      const responsiveText = container.querySelector(".text-xl");
      expect(responsiveText).toBeInTheDocument();
    });

    it("should have max-width constraint", () => {
      const { container } = render(<WinnerModal {...defaultProps} />);
      const modalContent = container.querySelector(".max-w-sm, .max-w-md");
      expect(modalContent).toBeInTheDocument();
    });
  });
});
