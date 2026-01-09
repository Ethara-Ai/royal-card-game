/**
 * Unit tests for Leaderboard component
 * Tests rendering, player sorting, scores, and current player highlighting
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Leaderboard from "./Leaderboard";

describe("Leaderboard", () => {
  const defaultProps = {
    players: [
      { id: "player1", name: "You", hand: [], score: 0, isActive: true },
      { id: "player2", name: "Alex", hand: [], score: 0, isActive: false },
      { id: "player3", name: "Sam", hand: [], score: 0, isActive: false },
      { id: "player4", name: "Jordan", hand: [], score: 0, isActive: false },
    ],
    scores: [3, 5, 2, 4],
    currentPlayer: 0,
    trickWinner: null,
    ruleSetName: "Highest Card Wins",
  };

  // Helper function to expand the leaderboard
  const expandLeaderboard = () => {
    const expandButton = screen.getByRole("button", {
      name: /show leaderboard/i,
    });
    fireEvent.click(expandButton);
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("collapsed state", () => {
    it("should render in collapsed state by default", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      const collapsed = container.querySelector(".collapsed");
      expect(collapsed).toBeInTheDocument();
    });

    it("should show 'Leaderboard' label when collapsed", () => {
      render(<Leaderboard {...defaultProps} />);
      expect(screen.getByText("Leaderboard")).toBeInTheDocument();
    });

    it("should have expand button when collapsed", () => {
      render(<Leaderboard {...defaultProps} />);
      const expandButton = screen.getByRole("button", {
        name: /show leaderboard/i,
      });
      expect(expandButton).toBeInTheDocument();
    });

    it("should expand when clicking the expand button", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      const expanded = container.querySelector(".expanded");
      expect(expanded).toBeInTheDocument();
    });
  });

  describe("rendering (expanded)", () => {
    it("should render without crashing", () => {
      render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      expect(screen.getByText("Highest Card Wins")).toBeInTheDocument();
    });

    it("should display the rule set name", () => {
      render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      expect(screen.getByText("Highest Card Wins")).toBeInTheDocument();
    });

    it("should display all player names", () => {
      render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      expect(screen.getByText("You (You)")).toBeInTheDocument();
      expect(screen.getByText("Alex")).toBeInTheDocument();
      expect(screen.getByText("Sam")).toBeInTheDocument();
      expect(screen.getByText("Jordan")).toBeInTheDocument();
    });

    it("should display all scores", () => {
      render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("should render player avatars", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      const avatars = container.querySelectorAll("img");
      expect(avatars).toHaveLength(4);
    });

    it("should have correct avatar URLs using robohash", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      const avatars = container.querySelectorAll("img");

      avatars.forEach((avatar) => {
        expect(avatar.src).toContain("robohash.org");
      });
    });

    it("should display position numbers (#1, #2, etc.)", () => {
      render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      expect(screen.getByText("#1")).toBeInTheDocument();
      expect(screen.getByText("#2")).toBeInTheDocument();
      expect(screen.getByText("#3")).toBeInTheDocument();
      expect(screen.getByText("#4")).toBeInTheDocument();
    });
  });

  describe("player sorting", () => {
    it("should sort players by score in descending order", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      const playerNames = container.querySelectorAll(
        ".leaderboard-player-name",
      );
      const names = Array.from(playerNames).map((el) => el.textContent);

      // Alex (5) should be first, then Jordan (4), You (3), Sam (2)
      expect(names[0]).toBe("Alex");
      expect(names[1]).toBe("Jordan");
      expect(names[2]).toBe("You (You)");
      expect(names[3]).toBe("Sam");
    });

    it("should handle tied scores", () => {
      const tiedProps = {
        ...defaultProps,
        scores: [3, 3, 3, 3],
      };
      render(<Leaderboard {...tiedProps} />);
      expandLeaderboard();
      // All players should still be displayed
      expect(screen.getByText("You (You)")).toBeInTheDocument();
      expect(screen.getByText("Alex")).toBeInTheDocument();
      expect(screen.getByText("Sam")).toBeInTheDocument();
      expect(screen.getByText("Jordan")).toBeInTheDocument();
    });

    it("should handle all zero scores", () => {
      const zeroProps = {
        ...defaultProps,
        scores: [0, 0, 0, 0],
      };
      render(<Leaderboard {...zeroProps} />);
      expandLeaderboard();
      // All zeros should be displayed
      const zeros = screen.getAllByText("0");
      expect(zeros.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("current player highlighting", () => {
    it("should highlight current player", () => {
      const { container } = render(
        <Leaderboard {...defaultProps} currentPlayer={0} />,
      );
      expandLeaderboard();
      const turnIndicators = container.querySelectorAll(
        ".player-turn-indicator",
      );
      expect(turnIndicators.length).toBeGreaterThanOrEqual(1);
    });

    it("should show pulse indicator for current player", () => {
      const { container } = render(
        <Leaderboard {...defaultProps} currentPlayer={0} />,
      );
      expandLeaderboard();
      const pulseIndicator = container.querySelector(".animate-pulse");
      expect(pulseIndicator).toBeInTheDocument();
    });

    it("should highlight different current player", () => {
      const { container } = render(
        <Leaderboard {...defaultProps} currentPlayer={2} />,
      );
      expandLeaderboard();
      const turnIndicators = container.querySelectorAll(
        ".player-turn-indicator",
      );
      expect(turnIndicators.length).toBeGreaterThanOrEqual(1);
    });

    it("should only show one pulse indicator", () => {
      const { container } = render(
        <Leaderboard {...defaultProps} currentPlayer={1} />,
      );
      expandLeaderboard();
      const pulseIndicators = container.querySelectorAll(".animate-pulse");
      expect(pulseIndicators).toHaveLength(1);
    });
  });

  describe("trick winner", () => {
    it("should apply score-update class when trickWinner matches player", () => {
      const winnerProps = {
        ...defaultProps,
        trickWinner: "player2",
      };
      const { container } = render(<Leaderboard {...winnerProps} />);
      expandLeaderboard();
      const scoreUpdate = container.querySelector(".score-update");
      expect(scoreUpdate).toBeInTheDocument();
    });

    it("should not apply score-update class when trickWinner is null", () => {
      const { container } = render(
        <Leaderboard {...defaultProps} trickWinner={null} />,
      );
      expandLeaderboard();
      const scoreUpdate = container.querySelector(".score-update");
      expect(scoreUpdate).toBeNull();
    });

    it("should handle trickWinner for player1", () => {
      const winnerProps = {
        ...defaultProps,
        trickWinner: "player1",
      };
      const { container } = render(<Leaderboard {...winnerProps} />);
      expandLeaderboard();
      const scoreUpdate = container.querySelector(".score-update");
      expect(scoreUpdate).toBeInTheDocument();
    });
  });

  describe("different rule sets", () => {
    it("should display 'Suit Follows' rule set name", () => {
      const suitFollowsProps = {
        ...defaultProps,
        ruleSetName: "Suit Follows",
      };
      render(<Leaderboard {...suitFollowsProps} />);
      expandLeaderboard();
      expect(screen.getByText("Suit Follows")).toBeInTheDocument();
    });

    it("should display 'Spades Trump' rule set name", () => {
      const spadesTrumpProps = {
        ...defaultProps,
        ruleSetName: "Spades Trump",
      };
      render(<Leaderboard {...spadesTrumpProps} />);
      expandLeaderboard();
      expect(screen.getByText("Spades Trump")).toBeInTheDocument();
    });

    it("should display custom rule set name", () => {
      const customRuleProps = {
        ...defaultProps,
        ruleSetName: "Custom Game Mode",
      };
      render(<Leaderboard {...customRuleProps} />);
      expandLeaderboard();
      expect(screen.getByText("Custom Game Mode")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have score-sidebar class", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      const sidebar = container.querySelector(".score-sidebar");
      expect(sidebar).toBeInTheDocument();
    });

    it("should have pixel-art class on avatars", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      const pixelArtElements = container.querySelectorAll(".pixel-art");
      expect(pixelArtElements).toHaveLength(4);
    });

    it("should have rounded container", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      const roundedElement = container.querySelector(".leaderboard-panel");
      expect(roundedElement).toBeInTheDocument();
    });

    it("should have rounded player items", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      const roundedElements = container.querySelectorAll(".rounded-lg");
      expect(roundedElements.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("different scores", () => {
    it("should handle high scores", () => {
      const highScoreProps = {
        ...defaultProps,
        scores: [10, 15, 8, 12],
      };
      render(<Leaderboard {...highScoreProps} />);
      expandLeaderboard();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("15")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
    });

    it("should handle single digit scores", () => {
      const singleDigitProps = {
        ...defaultProps,
        scores: [1, 2, 3, 4],
      };
      render(<Leaderboard {...singleDigitProps} />);
      expandLeaderboard();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });
  });

  describe("layout", () => {
    it("should have space between player items", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      const spacedContainer = container.querySelector(".leaderboard-players");
      expect(spacedContainer).toBeInTheDocument();
    });

    it("should have flex layout for player items", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      const flexItems = container.querySelectorAll(".flex.items-center");
      expect(flexItems.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("accessibility", () => {
    it("should have accessible images with alt text", () => {
      render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
        expect(img.getAttribute("alt")).not.toBe("");
      });
    });

    it("should have alt text matching player names", () => {
      render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      const images = screen.getAllByRole("img");
      const playerNames = ["You", "Alex", "Sam", "Jordan"];

      images.forEach((img) => {
        const altText = img.getAttribute("alt");
        expect(playerNames).toContain(altText);
      });
    });

    it("should have aria-label on collapse/expand buttons", () => {
      render(<Leaderboard {...defaultProps} />);
      const expandButton = screen.getByRole("button", {
        name: /show leaderboard/i,
      });
      expect(expandButton).toHaveAttribute("aria-label");

      fireEvent.click(expandButton);

      const collapseButton = screen.getByRole("button", {
        name: /hide leaderboard/i,
      });
      expect(collapseButton).toHaveAttribute("aria-label");
    });

    it("should have aria-expanded attribute on expand button", () => {
      render(<Leaderboard {...defaultProps} />);
      const expandButton = screen.getByRole("button", {
        name: /show leaderboard/i,
      });
      expect(expandButton).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("edge cases", () => {
    it("should handle players with special characters in names", () => {
      const specialNameProps = {
        ...defaultProps,
        players: [
          {
            id: "player1",
            name: "Player #1",
            hand: [],
            score: 0,
            isActive: true,
          },
          {
            id: "player2",
            name: "Alex & Bob",
            hand: [],
            score: 0,
            isActive: false,
          },
          {
            id: "player3",
            name: "Sam's Game",
            hand: [],
            score: 0,
            isActive: false,
          },
          {
            id: "player4",
            name: "Jordan_123",
            hand: [],
            score: 0,
            isActive: false,
          },
        ],
      };
      render(<Leaderboard {...specialNameProps} />);
      expandLeaderboard();
      expect(screen.getByText("Player #1 (You)")).toBeInTheDocument();
      expect(screen.getByText("Alex & Bob")).toBeInTheDocument();
      expect(screen.getByText("Sam's Game")).toBeInTheDocument();
      expect(screen.getByText("Jordan_123")).toBeInTheDocument();
    });

    it("should handle players with long names (truncate)", () => {
      const longNameProps = {
        ...defaultProps,
        players: [
          {
            id: "player1",
            name: "VeryLongPlayerNameThatMightOverflow",
            hand: [],
            score: 0,
            isActive: true,
          },
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
      const { container } = render(<Leaderboard {...longNameProps} />);
      expandLeaderboard();
      // Check that truncate class is applied
      const truncateElements = container.querySelectorAll(".truncate");
      expect(truncateElements.length).toBeGreaterThanOrEqual(4);
    });

    it("should handle empty rule set name", () => {
      const emptyRuleProps = {
        ...defaultProps,
        ruleSetName: "",
      };
      render(<Leaderboard {...emptyRuleProps} />);
      expandLeaderboard();
      // Should still render without crashing
      expect(screen.getByText("You (You)")).toBeInTheDocument();
    });

    it("should handle currentPlayer out of bounds gracefully", () => {
      const outOfBoundsProps = {
        ...defaultProps,
        currentPlayer: 10,
      };
      // Should not throw and should render
      expect(() => render(<Leaderboard {...outOfBoundsProps} />)).not.toThrow();
    });
  });

  describe("responsive styling", () => {
    it("should have leaderboard container", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      const responsiveElement = container.querySelector(
        ".leaderboard-container",
      );
      expect(responsiveElement).toBeInTheDocument();
    });

    it("should have responsive padding", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      const paddedElement = container.querySelector(".leaderboard-panel");
      expect(paddedElement).toBeInTheDocument();
    });

    it("should have leaderboard players container", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      const playersContainer = container.querySelector(".leaderboard-players");
      expect(playersContainer).toBeInTheDocument();
    });
  });

  describe("transition animations", () => {
    it("should have transition classes on player items", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      const transitionElements = container.querySelectorAll(".transition-all");
      expect(transitionElements.length).toBeGreaterThanOrEqual(4);
    });

    it("should have duration classes for transitions", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();
      const durationElements = container.querySelectorAll(".duration-300");
      expect(durationElements.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("collapse/expand toggle", () => {
    it("should collapse when clicking the close button", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);
      expandLeaderboard();

      const collapseButton = screen.getByRole("button", {
        name: /hide leaderboard/i,
      });
      fireEvent.click(collapseButton);

      const collapsed = container.querySelector(".collapsed");
      expect(collapsed).toBeInTheDocument();
    });

    it("should toggle between collapsed and expanded states", () => {
      const { container } = render(<Leaderboard {...defaultProps} />);

      // Initially collapsed
      expect(container.querySelector(".collapsed")).toBeInTheDocument();

      // Expand
      expandLeaderboard();
      expect(container.querySelector(".expanded")).toBeInTheDocument();

      // Collapse again
      const collapseButton = screen.getByRole("button", {
        name: /hide leaderboard/i,
      });
      fireEvent.click(collapseButton);
      expect(container.querySelector(".collapsed")).toBeInTheDocument();
    });
  });
});
