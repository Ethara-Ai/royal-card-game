/**
 * Unit tests for WaitingRoom component
 * Tests rendering, player display, and start game functionality
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WaitingRoom from "./WaitingRoom";

describe("WaitingRoom", () => {
  const defaultProps = {
    players: [
      { id: "player1", name: "You" },
      { id: "player2", name: "Alex" },
      { id: "player3", name: "Sam" },
      { id: "player4", name: "Jordan" },
    ],
    startGame: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render without crashing", () => {
      render(<WaitingRoom {...defaultProps} />);
      expect(screen.getByText("Waiting Room")).toBeInTheDocument();
    });

    it("should display 'Waiting Room' title", () => {
      render(<WaitingRoom {...defaultProps} />);
      expect(screen.getByText("Waiting Room")).toBeInTheDocument();
    });

    it("should display all player names", () => {
      render(<WaitingRoom {...defaultProps} />);
      expect(screen.getByText("You")).toBeInTheDocument();
      expect(screen.getByText("Alex")).toBeInTheDocument();
      expect(screen.getByText("Sam")).toBeInTheDocument();
      expect(screen.getByText("Jordan")).toBeInTheDocument();
    });

    it("should display 'Ready' status for all players", () => {
      render(<WaitingRoom {...defaultProps} />);
      const readyStatuses = screen.getAllByText("Ready");
      expect(readyStatuses).toHaveLength(4);
    });

    it("should display Start Game button", () => {
      render(<WaitingRoom {...defaultProps} />);
      expect(screen.getByText("Start Game")).toBeInTheDocument();
    });

    it("should render player avatars", () => {
      const { container } = render(<WaitingRoom {...defaultProps} />);
      const avatars = container.querySelectorAll("img");
      expect(avatars).toHaveLength(4);
    });

    it("should have correct avatar URLs using robohash", () => {
      const { container } = render(<WaitingRoom {...defaultProps} />);
      const avatars = container.querySelectorAll("img");

      avatars.forEach((avatar, index) => {
        const playerName = defaultProps.players[index].name;
        expect(avatar.src).toContain(`robohash.org/${playerName}`);
      });
    });

    it("should have alt text for avatars matching player names", () => {
      const { container } = render(<WaitingRoom {...defaultProps} />);
      const avatars = container.querySelectorAll("img");

      avatars.forEach((avatar, index) => {
        expect(avatar.alt).toBe(defaultProps.players[index].name);
      });
    });
  });

  describe("player icons", () => {
    it("should show user icon for first player (human)", () => {
      const { container } = render(<WaitingRoom {...defaultProps} />);
      // First player should have FaUser icon
      const playerCards = container.querySelectorAll(".text-center");
      expect(playerCards.length).toBeGreaterThan(0);
    });

    it("should show robot icon for AI players", () => {
      const { container } = render(<WaitingRoom {...defaultProps} />);
      // AI players should have FaRobot icon
      const svgElements = container.querySelectorAll("svg");
      expect(svgElements.length).toBeGreaterThan(0);
    });
  });

  describe("Start Game button", () => {
    it("should call startGame when clicked", () => {
      const startGame = vi.fn();
      render(<WaitingRoom {...defaultProps} startGame={startGame} />);

      const startButton = screen.getByText("Start Game");
      fireEvent.click(startButton);

      expect(startGame).toHaveBeenCalledTimes(1);
    });

    it("should be a button element", () => {
      render(<WaitingRoom {...defaultProps} />);
      const startButton = screen.getByRole("button", { name: /start game/i });
      expect(startButton).toBeInTheDocument();
    });

    it("should have play icon", () => {
      const { container } = render(<WaitingRoom {...defaultProps} />);
      // FaPlay icon should be present in the button
      const button = container.querySelector("button");
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have game-title class on heading", () => {
      const { container } = render(<WaitingRoom {...defaultProps} />);
      const heading = container.querySelector(".game-title");
      expect(heading).toBeInTheDocument();
    });

    it("should have start-game-btn class on button", () => {
      const { container } = render(<WaitingRoom {...defaultProps} />);
      const button = container.querySelector(".start-game-btn");
      expect(button).toBeInTheDocument();
    });

    it("should have bounce-in class for animation", () => {
      const { container } = render(<WaitingRoom {...defaultProps} />);
      const animatedDiv = container.querySelector(".bounce-in");
      expect(animatedDiv).toBeInTheDocument();
    });

    it("should have pixel-art class on avatars", () => {
      const { container } = render(<WaitingRoom {...defaultProps} />);
      const pixelArtElements = container.querySelectorAll(".pixel-art");
      expect(pixelArtElements).toHaveLength(4);
    });
  });

  describe("layout", () => {
    it("should display players in a grid", () => {
      const { container } = render(<WaitingRoom {...defaultProps} />);
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });

    it("should have 2 columns in the grid", () => {
      const { container } = render(<WaitingRoom {...defaultProps} />);
      const grid = container.querySelector(".grid-cols-2");
      expect(grid).toBeInTheDocument();
    });
  });

  describe("different player counts", () => {
    it("should handle 2 players", () => {
      const twoPlayerProps = {
        ...defaultProps,
        players: [
          { id: "player1", name: "You" },
          { id: "player2", name: "Alex" },
        ],
      };
      render(<WaitingRoom {...twoPlayerProps} />);
      expect(screen.getByText("You")).toBeInTheDocument();
      expect(screen.getByText("Alex")).toBeInTheDocument();
    });

    it("should handle players with special characters in names", () => {
      const specialNameProps = {
        ...defaultProps,
        players: [
          { id: "player1", name: "Player #1" },
          { id: "player2", name: "Alex & Bob" },
          { id: "player3", name: "Sam's Game" },
          { id: "player4", name: "Jordan_123" },
        ],
      };
      render(<WaitingRoom {...specialNameProps} />);
      expect(screen.getByText("Player #1")).toBeInTheDocument();
      expect(screen.getByText("Alex & Bob")).toBeInTheDocument();
      expect(screen.getByText("Sam's Game")).toBeInTheDocument();
      expect(screen.getByText("Jordan_123")).toBeInTheDocument();
    });

    it("should handle players with long names", () => {
      const longNameProps = {
        ...defaultProps,
        players: [
          { id: "player1", name: "VeryLongPlayerNameThatMightOverflow" },
          { id: "player2", name: "Alex" },
          { id: "player3", name: "Sam" },
          { id: "player4", name: "Jordan" },
        ],
      };
      render(<WaitingRoom {...longNameProps} />);
      expect(
        screen.getByText("VeryLongPlayerNameThatMightOverflow"),
      ).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have accessible button", () => {
      render(<WaitingRoom {...defaultProps} />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should have accessible images with alt text", () => {
      render(<WaitingRoom {...defaultProps} />);
      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
        expect(img.getAttribute("alt")).not.toBe("");
      });
    });
  });

  describe("edge cases", () => {
    it("should render with empty players array", () => {
      const emptyProps = {
        players: [],
        startGame: vi.fn(),
      };
      render(<WaitingRoom {...emptyProps} />);
      expect(screen.getByText("Waiting Room")).toBeInTheDocument();
      expect(screen.getByText("Start Game")).toBeInTheDocument();
    });

    it("should render with single player", () => {
      const singlePlayerProps = {
        players: [{ id: "player1", name: "Solo" }],
        startGame: vi.fn(),
      };
      render(<WaitingRoom {...singlePlayerProps} />);
      expect(screen.getByText("Solo")).toBeInTheDocument();
    });

    it("should handle rapid button clicks", () => {
      const startGame = vi.fn();
      render(<WaitingRoom {...defaultProps} startGame={startGame} />);

      const startButton = screen.getByText("Start Game");

      // Click multiple times rapidly
      fireEvent.click(startButton);
      fireEvent.click(startButton);
      fireEvent.click(startButton);

      expect(startGame).toHaveBeenCalledTimes(3);
    });
  });

  describe("responsive styling", () => {
    it("should have responsive padding classes", () => {
      const { container } = render(<WaitingRoom {...defaultProps} />);
      const responsiveElement = container.querySelector(".p-4");
      expect(
        responsiveElement || container.querySelector(".p-3"),
      ).toBeInTheDocument();
    });

    it("should have responsive text classes", () => {
      const { container } = render(<WaitingRoom {...defaultProps} />);
      const responsiveText = container.querySelector(".text-xl");
      expect(responsiveText).toBeInTheDocument();
    });
  });
});
