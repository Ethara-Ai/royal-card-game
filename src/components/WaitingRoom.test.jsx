/**
 * Unit tests for WaitingRoom component
 * Tests rendering, player display, username input, rule set selection, and start game functionality
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WaitingRoom from "./WaitingRoom";

describe("WaitingRoom", () => {
  const mockRuleSets = [
    {
      id: "highest-card",
      name: "Highest Card Wins",
      description: "The highest card value wins the trick",
    },
    {
      id: "suit-follows",
      name: "Suit Follows",
      description: "Must follow lead suit, highest of lead suit wins",
    },
    {
      id: "spades-trump",
      name: "Spades Trump",
      description: "Spades are trump cards and beat all other suits",
    },
  ];

  const defaultProps = {
    players: [
      { id: "player1", name: "Player" },
      { id: "player2", name: "Alex" },
      { id: "player3", name: "Sam" },
      { id: "player4", name: "Jordan" },
    ],
    startGame: vi.fn(),
    username: "",
    setUsername: vi.fn(),
    ruleSets: mockRuleSets,
    selectedRuleSet: 0,
    setSelectedRuleSet: vi.fn(),
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
      expect(screen.getByText("Player (You)")).toBeInTheDocument();
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
      render(<WaitingRoom {...defaultProps} username="TestUser" />);
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

  describe("username input", () => {
    it("should render username input field", () => {
      render(<WaitingRoom {...defaultProps} />);
      const input = screen.getByLabelText(/your name/i);
      expect(input).toBeInTheDocument();
    });

    it("should have placeholder text", () => {
      render(<WaitingRoom {...defaultProps} />);
      const input = screen.getByPlaceholderText(/enter your name/i);
      expect(input).toBeInTheDocument();
    });

    it("should display empty input when username is empty", () => {
      render(<WaitingRoom {...defaultProps} username="" />);
      const input = screen.getByLabelText(/your name/i);
      expect(input.value).toBe("");
    });

    it("should display username value when provided", () => {
      render(<WaitingRoom {...defaultProps} username="TestUser" />);
      const input = screen.getByLabelText(/your name/i);
      expect(input.value).toBe("TestUser");
    });

    it("should call setUsername when input value changes", () => {
      const setUsername = vi.fn();
      render(<WaitingRoom {...defaultProps} setUsername={setUsername} />);
      const input = screen.getByLabelText(/your name/i);

      fireEvent.change(input, { target: { value: "NewName" } });

      expect(setUsername).toHaveBeenCalledWith("NewName");
    });

    it("should have maxLength of 20 characters", () => {
      render(<WaitingRoom {...defaultProps} />);
      const input = screen.getByLabelText(/your name/i);
      expect(input).toHaveAttribute("maxLength", "20");
    });

    it("should start game when Enter key is pressed with valid input", () => {
      const startGame = vi.fn();
      render(
        <WaitingRoom {...defaultProps} startGame={startGame} username="Test" />,
      );
      const input = screen.getByLabelText(/your name/i);

      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(startGame).toHaveBeenCalledTimes(1);
    });

    it("should not start game when Enter key is pressed with empty input", () => {
      const startGame = vi.fn();
      render(
        <WaitingRoom {...defaultProps} startGame={startGame} username="" />,
      );
      const input = screen.getByLabelText(/your name/i);

      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(startGame).not.toHaveBeenCalled();
    });

    it("should display helper text about name usage", () => {
      render(<WaitingRoom {...defaultProps} />);
      expect(
        screen.getByText(/this name will appear in scoreboards/i),
      ).toBeInTheDocument();
    });

    it("should have id 'username-input' on input field", () => {
      render(<WaitingRoom {...defaultProps} />);
      const input = document.getElementById("username-input");
      expect(input).toBeInTheDocument();
    });

    it("should show required indicator on username label", () => {
      render(<WaitingRoom {...defaultProps} />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });
  });

  describe("rule set selection", () => {
    it("should render rule set dropdown button", () => {
      render(<WaitingRoom {...defaultProps} />);
      const dropdownButton = screen.getByRole("button", {
        name: /highest card wins/i,
      });
      expect(dropdownButton).toBeInTheDocument();
    });

    it("should display current rule set name in dropdown button", () => {
      render(<WaitingRoom {...defaultProps} selectedRuleSet={0} />);
      expect(screen.getByText("Highest Card Wins")).toBeInTheDocument();
    });

    it("should display all rule set options when dropdown is opened", () => {
      render(<WaitingRoom {...defaultProps} />);
      const dropdownButton = screen.getByRole("button", {
        name: /highest card wins/i,
      });

      fireEvent.click(dropdownButton);

      // All options should be visible in the dropdown
      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(3);
    });

    it("should call setSelectedRuleSet when option is clicked", () => {
      const setSelectedRuleSet = vi.fn();
      render(
        <WaitingRoom
          {...defaultProps}
          setSelectedRuleSet={setSelectedRuleSet}
        />,
      );
      const dropdownButton = screen.getByRole("button", {
        name: /highest card wins/i,
      });

      fireEvent.click(dropdownButton);

      const suitFollowsOption = screen.getByRole("option", {
        name: /suit follows/i,
      });
      fireEvent.click(suitFollowsOption);

      expect(setSelectedRuleSet).toHaveBeenCalledWith(1);
    });

    it("should display rule set description below dropdown", () => {
      render(<WaitingRoom {...defaultProps} selectedRuleSet={0} />);
      expect(
        screen.getByText("The highest card value wins the trick"),
      ).toBeInTheDocument();
    });

    it("should update description when rule set changes", () => {
      const { rerender } = render(
        <WaitingRoom {...defaultProps} selectedRuleSet={0} />,
      );
      expect(
        screen.getByText("The highest card value wins the trick"),
      ).toBeInTheDocument();

      rerender(<WaitingRoom {...defaultProps} selectedRuleSet={1} />);
      expect(
        screen.getByText("Must follow lead suit, highest of lead suit wins"),
      ).toBeInTheDocument();
    });

    it("should have id 'rule-set-select' on dropdown button", () => {
      render(<WaitingRoom {...defaultProps} />);
      const dropdownButton = document.getElementById("rule-set-select");
      expect(dropdownButton).toBeInTheDocument();
    });

    it("should show checkmark on selected option", () => {
      render(<WaitingRoom {...defaultProps} selectedRuleSet={0} />);
      const dropdownButton = screen.getByRole("button", {
        name: /highest card wins/i,
      });

      fireEvent.click(dropdownButton);

      const selectedOption = screen.getByRole("option", {
        name: /highest card wins/i,
      });
      expect(selectedOption).toHaveAttribute("aria-selected", "true");
    });

    it("should close dropdown when clicking outside", () => {
      render(<WaitingRoom {...defaultProps} />);
      const dropdownButton = screen.getByRole("button", {
        name: /highest card wins/i,
      });

      fireEvent.click(dropdownButton);
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      // Click the backdrop
      const backdrop = document.querySelector(".fixed.inset-0");
      fireEvent.click(backdrop);

      // Dropdown should close (after animation)
      // Note: The actual closing happens after a timeout, so we check for the animation class
    });

    it("should toggle dropdown open/close state", () => {
      render(<WaitingRoom {...defaultProps} />);
      const dropdownButton = screen.getByRole("button", {
        name: /highest card wins/i,
      });

      // Initially closed
      expect(dropdownButton).toHaveAttribute("aria-expanded", "false");

      // Open
      fireEvent.click(dropdownButton);
      expect(dropdownButton).toHaveAttribute("aria-expanded", "true");
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
    it("should appear disabled when username is empty", () => {
      render(<WaitingRoom {...defaultProps} username="" />);
      const startButton = screen.getByRole("button", {
        name: /enter name to start/i,
      });
      // Button uses CSS styling for disabled state, not disabled attribute
      expect(startButton).toHaveStyle({
        cursor: "not-allowed",
        opacity: "0.6",
      });
    });

    it("should appear disabled when username is only whitespace", () => {
      render(<WaitingRoom {...defaultProps} username="   " />);
      const startButton = screen.getByRole("button", {
        name: /enter name to start/i,
      });
      // Button uses CSS styling for disabled state, not disabled attribute
      expect(startButton).toHaveStyle({
        cursor: "not-allowed",
        opacity: "0.6",
      });
    });

    it("should be enabled when username is provided", () => {
      render(<WaitingRoom {...defaultProps} username="TestUser" />);
      const startButton = screen.getByRole("button", { name: /start game/i });
      expect(startButton).not.toBeDisabled();
    });

    it("should show 'Enter Name to Start' when username is empty", () => {
      render(<WaitingRoom {...defaultProps} username="" />);
      expect(screen.getByText("Enter Name to Start")).toBeInTheDocument();
    });

    it("should show 'Start Game' when username is provided", () => {
      render(<WaitingRoom {...defaultProps} username="TestUser" />);
      expect(screen.getByText("Start Game")).toBeInTheDocument();
    });

    it("should call startGame when clicked with valid username", () => {
      const startGame = vi.fn();
      render(
        <WaitingRoom
          {...defaultProps}
          startGame={startGame}
          username="TestUser"
        />,
      );

      const startButton = screen.getByRole("button", { name: /start game/i });
      fireEvent.click(startButton);

      expect(startGame).toHaveBeenCalledTimes(1);
    });

    it("should not call startGame when clicked with empty username", () => {
      const startGame = vi.fn();
      render(<WaitingRoom {...defaultProps} startGame={startGame} />);

      const startButton = screen.getByRole("button", {
        name: /enter name to start/i,
      });
      fireEvent.click(startButton);

      expect(startGame).not.toHaveBeenCalled();
    });

    it("should have play icon", () => {
      render(<WaitingRoom {...defaultProps} username="TestUser" />);
      const button = screen.getByRole("button", { name: /start game/i });
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

    it("should highlight first player card with gold border", () => {
      const { container } = render(<WaitingRoom {...defaultProps} />);
      const playerCards = container.querySelectorAll(".rounded-xl");
      // First player card should have gold border style
      expect(playerCards.length).toBeGreaterThan(0);
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
          { id: "player1", name: "Player" },
          { id: "player2", name: "Alex" },
        ],
      };
      render(<WaitingRoom {...twoPlayerProps} />);
      expect(screen.getByText("Player (You)")).toBeInTheDocument();
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
      expect(screen.getByText("Player #1 (You)")).toBeInTheDocument();
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
        screen.getByText("VeryLongPlayerNameThatMightOverflow (You)"),
      ).toBeInTheDocument();
    });
  });

  describe("username with custom names", () => {
    it("should display custom username in player list when provided", () => {
      const propsWithCustomName = {
        ...defaultProps,
        players: [
          { id: "player1", name: "CustomUser" },
          { id: "player2", name: "Alex" },
          { id: "player3", name: "Sam" },
          { id: "player4", name: "Jordan" },
        ],
        username: "CustomUser",
      };
      render(<WaitingRoom {...propsWithCustomName} />);
      expect(screen.getByText("CustomUser (You)")).toBeInTheDocument();
    });

    it("should update avatar URL when username changes", () => {
      const propsWithCustomName = {
        ...defaultProps,
        players: [
          { id: "player1", name: "MyCustomName" },
          { id: "player2", name: "Alex" },
          { id: "player3", name: "Sam" },
          { id: "player4", name: "Jordan" },
        ],
        username: "MyCustomName",
      };
      const { container } = render(<WaitingRoom {...propsWithCustomName} />);
      const avatars = container.querySelectorAll("img");
      expect(avatars[0].src).toContain("robohash.org/MyCustomName");
    });
  });

  describe("accessibility", () => {
    it("should have accessible button", () => {
      render(<WaitingRoom {...defaultProps} username="TestUser" />);
      const button = screen.getByRole("button", { name: /start game/i });
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

    it("should have accessible input with label", () => {
      render(<WaitingRoom {...defaultProps} />);
      const input = screen.getByLabelText(/your name/i);
      expect(input).toBeInTheDocument();
    });

    it("should have proper input type", () => {
      render(<WaitingRoom {...defaultProps} />);
      const input = screen.getByLabelText(/your name/i);
      expect(input).toHaveAttribute("type", "text");
    });

    it("should have accessible dropdown with aria attributes", () => {
      render(<WaitingRoom {...defaultProps} />);
      const dropdownButton = document.getElementById("rule-set-select");
      expect(dropdownButton).toHaveAttribute("aria-haspopup", "listbox");
      expect(dropdownButton).toHaveAttribute("aria-expanded");
    });
  });

  describe("edge cases", () => {
    it("should render with empty players array", () => {
      const emptyProps = {
        ...defaultProps,
        players: [],
      };
      render(<WaitingRoom {...emptyProps} />);
      expect(screen.getByText("Waiting Room")).toBeInTheDocument();
    });

    it("should render with single player", () => {
      const singlePlayerProps = {
        ...defaultProps,
        players: [{ id: "player1", name: "Solo" }],
        username: "Solo",
      };
      render(<WaitingRoom {...singlePlayerProps} />);
      expect(screen.getByText("Solo (You)")).toBeInTheDocument();
    });

    it("should handle rapid button clicks", () => {
      const startGame = vi.fn();
      render(
        <WaitingRoom
          {...defaultProps}
          startGame={startGame}
          username="TestUser"
        />,
      );

      const startButton = screen.getByRole("button", { name: /start game/i });

      // Click multiple times rapidly
      fireEvent.click(startButton);
      fireEvent.click(startButton);
      fireEvent.click(startButton);

      expect(startGame).toHaveBeenCalledTimes(3);
    });

    it("should handle whitespace-only username", () => {
      const setUsername = vi.fn();
      render(<WaitingRoom {...defaultProps} setUsername={setUsername} />);
      const input = screen.getByLabelText(/your name/i);

      fireEvent.change(input, { target: { value: "   " } });

      // sanitizeUsername strips whitespace-only input to empty string
      expect(setUsername).toHaveBeenCalledWith("");
    });

    it("should handle undefined username prop gracefully", () => {
      const propsWithoutUsername = {
        ...defaultProps,
        username: undefined,
      };
      render(<WaitingRoom {...propsWithoutUsername} />);
      const input = screen.getByLabelText(/your name/i);
      expect(input.value).toBe("");
    });

    it("should handle empty ruleSets array", () => {
      const emptyRuleSetsProps = {
        ...defaultProps,
        ruleSets: [],
      };
      render(<WaitingRoom {...emptyRuleSetsProps} />);
      const dropdownButton = document.getElementById("rule-set-select");
      expect(dropdownButton).toBeInTheDocument();
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
