/**
 * Unit tests for LandscapeMenu component
 * Tests rendering, menu toggle, navigation items, and accessibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LandscapeMenu from "./LandscapeMenu";
import { CardCustomizationProvider } from "../context";

// Mock the patterns utility
vi.mock("../utils/patterns", () => ({
  cardPatterns: [
    { id: "solid", name: "Solid" },
    { id: "stripes", name: "Stripes" },
    { id: "dots", name: "Dots" },
  ],
  getPatternStyle: vi.fn((patternId, _color) => ({
    backgroundImage:
      patternId === "solid"
        ? "none"
        : `url("data:image/svg+xml,<svg>mock</svg>")`,
    backgroundSize: "10px 10px",
  })),
}));

// Helper to render with context
const renderWithContext = (ui, options) =>
  render(<CardCustomizationProvider>{ui}</CardCustomizationProvider>, options);

describe("LandscapeMenu", () => {
  const mockRuleSets = [
    {
      id: "highest-card",
      name: "Highest Card Wins",
      description: "The highest card value wins the trick",
    },
    {
      id: "suit-follows",
      name: "Suit Follows",
      description: "Must follow lead suit",
    },
    {
      id: "spades-trump",
      name: "Spades Trump",
      description: "Spades are trump cards",
    },
  ];

  const defaultProps = {
    theme: "dark",
    toggleTheme: vi.fn(),
    ruleSets: mockRuleSets,
    selectedRuleSet: 0,
    setSelectedRuleSet: vi.fn(),
    resetGame: vi.fn(),
    onHelpClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );
      expect(container).toBeInTheDocument();
    });

    it("should render toggle button", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);
      const button = screen.getByRole("button", { name: /open menu/i });
      expect(button).toBeInTheDocument();
    });

    it("should have hamburger icon when closed", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );
      const svg = container.querySelector("button svg");
      expect(svg).toBeInTheDocument();
    });

    it("should have landscape-menu-container class", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );
      const menuContainer = container.querySelector(
        ".landscape-menu-container",
      );
      expect(menuContainer).toBeInTheDocument();
    });

    it("should not show menu panel initially", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );
      const panel = container.querySelector(".landscape-menu-panel");
      expect(panel).not.toBeInTheDocument();
    });
  });

  describe("toggle behavior", () => {
    it("should open menu when toggle button is clicked", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const panel = container.querySelector(".landscape-menu-panel");
      expect(panel).toBeInTheDocument();
    });

    it("should close menu when toggle button is clicked again", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton); // Open
      fireEvent.click(toggleButton); // Close

      const panel = container.querySelector(".landscape-menu-panel");
      expect(panel).not.toBeInTheDocument();
    });

    it("should show X icon when menu is open", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      expect(
        screen.getByRole("button", { name: /close menu/i }),
      ).toBeInTheDocument();
    });

    it("should update aria-expanded when toggling", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      expect(toggleButton).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("menu content", () => {
    it("should display Menu title in header", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      expect(screen.getByText("Menu")).toBeInTheDocument();
    });

    it("should display crown icon in header", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const crown = container.querySelector(".landscape-menu-crown");
      expect(crown).toBeInTheDocument();
    });

    it("should display How to Play button", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      expect(screen.getByText("How to Play")).toBeInTheDocument();
    });

    it("should display theme toggle button", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      // Should show "Light Mode" when in dark theme
      expect(screen.getByText("Light Mode")).toBeInTheDocument();
    });

    it("should display Dark Mode when in light theme", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} theme="light" />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      expect(screen.getByText("Dark Mode")).toBeInTheDocument();
    });

    it("should display Game Rules section", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      expect(screen.getByText("Game Rules")).toBeInTheDocument();
    });

    it("should display Card Back section", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      expect(screen.getByText("Card Back")).toBeInTheDocument();
    });

    it("should display Reset Game button", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      expect(screen.getByText("Reset Game")).toBeInTheDocument();
    });

    it("should display all rule set options", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      expect(screen.getByText("Highest Card Wins")).toBeInTheDocument();
      expect(screen.getByText("Suit Follows")).toBeInTheDocument();
      expect(screen.getByText("Spades Trump")).toBeInTheDocument();
    });
  });

  describe("How to Play button", () => {
    it("should call onHelpClick when clicked", () => {
      const onHelpClick = vi.fn();
      renderWithContext(
        <LandscapeMenu {...defaultProps} onHelpClick={onHelpClick} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const helpButton = screen.getByText("How to Play").closest("button");
      fireEvent.click(helpButton);

      expect(onHelpClick).toHaveBeenCalledTimes(1);
    });

    it("should close menu after clicking How to Play", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const helpButton = screen.getByText("How to Play").closest("button");
      fireEvent.click(helpButton);

      const panel = container.querySelector(".landscape-menu-panel");
      expect(panel).not.toBeInTheDocument();
    });
  });

  describe("theme toggle", () => {
    it("should call toggleTheme when theme button is clicked", () => {
      const toggleTheme = vi.fn();
      renderWithContext(
        <LandscapeMenu {...defaultProps} toggleTheme={toggleTheme} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const themeButton = screen.getByText("Light Mode").closest("button");
      fireEvent.click(themeButton);

      expect(toggleTheme).toHaveBeenCalledTimes(1);
    });

    it("should close menu after toggling theme", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const themeButton = screen.getByText("Light Mode").closest("button");
      fireEvent.click(themeButton);

      const panel = container.querySelector(".landscape-menu-panel");
      expect(panel).not.toBeInTheDocument();
    });

    it("should show sun icon in dark mode", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} theme="dark" />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const themeButton = screen.getByText("Light Mode").closest("button");
      const svg = themeButton.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should show moon icon in light mode", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} theme="light" />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const themeButton = screen.getByText("Dark Mode").closest("button");
      const svg = themeButton.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("rule selection", () => {
    it("should call setSelectedRuleSet when a rule is clicked", () => {
      const setSelectedRuleSet = vi.fn();
      renderWithContext(
        <LandscapeMenu
          {...defaultProps}
          setSelectedRuleSet={setSelectedRuleSet}
        />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const suitFollowsButton = screen
        .getByText("Suit Follows")
        .closest("button");
      fireEvent.click(suitFollowsButton);

      expect(setSelectedRuleSet).toHaveBeenCalledWith(1);
    });

    it("should highlight the selected rule", () => {
      renderWithContext(
        <LandscapeMenu {...defaultProps} selectedRuleSet={1} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const suitFollowsButton = screen
        .getByText("Suit Follows")
        .closest("button");
      expect(suitFollowsButton).toHaveClass("active");
    });

    it("should not highlight unselected rules", () => {
      renderWithContext(
        <LandscapeMenu {...defaultProps} selectedRuleSet={0} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const suitFollowsButton = screen
        .getByText("Suit Follows")
        .closest("button");
      expect(suitFollowsButton).not.toHaveClass("active");
    });
  });

  describe("reset game", () => {
    it("should call resetGame when Reset Game is clicked", () => {
      const resetGame = vi.fn();
      renderWithContext(
        <LandscapeMenu {...defaultProps} resetGame={resetGame} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const resetButton = screen.getByText("Reset Game").closest("button");
      fireEvent.click(resetButton);

      expect(resetGame).toHaveBeenCalledTimes(1);
    });

    it("should close menu after clicking Reset Game", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const resetButton = screen.getByText("Reset Game").closest("button");
      fireEvent.click(resetButton);

      const panel = container.querySelector(".landscape-menu-panel");
      expect(panel).not.toBeInTheDocument();
    });
  });

  describe("click outside behavior", () => {
    it("should close menu when clicking outside", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      expect(
        container.querySelector(".landscape-menu-panel"),
      ).toBeInTheDocument();

      // Simulate click outside
      fireEvent.mouseDown(document.body);

      expect(
        container.querySelector(".landscape-menu-panel"),
      ).not.toBeInTheDocument();
    });

    it("should not close menu when clicking inside the panel", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const panel = container.querySelector(".landscape-menu-panel");
      fireEvent.mouseDown(panel);

      expect(
        container.querySelector(".landscape-menu-panel"),
      ).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have landscape-menu-toggle class on toggle button", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );
      const toggleButton = container.querySelector(".landscape-menu-toggle");
      expect(toggleButton).toBeInTheDocument();
    });

    it("should have landscape-menu-header class", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const header = container.querySelector(".landscape-menu-header");
      expect(header).toBeInTheDocument();
    });

    it("should have landscape-menu-content class", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const content = container.querySelector(".landscape-menu-content");
      expect(content).toBeInTheDocument();
    });

    it("should have landscape-menu-item class on menu items", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const items = container.querySelectorAll(".landscape-menu-item");
      expect(items.length).toBeGreaterThan(0);
    });

    it("should have landscape-menu-divider elements", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const dividers = container.querySelectorAll(".landscape-menu-divider");
      expect(dividers.length).toBeGreaterThan(0);
    });

    it("should have landscape-menu-section class for sections", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const sections = container.querySelectorAll(".landscape-menu-section");
      expect(sections.length).toBeGreaterThan(0);
    });

    it("should have landscape-menu-reset class on reset button", () => {
      const { container } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const resetButton = container.querySelector(".landscape-menu-reset");
      expect(resetButton).toBeInTheDocument();
    });
  });

  describe("card customization", () => {
    it("should render CardColorPicker component", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      expect(screen.getByText("Card Back Color")).toBeInTheDocument();
    });

    it("should render CardPatternPicker component", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      expect(screen.getByText("Card Pattern")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have aria-label on toggle button", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label");
    });

    it("should have aria-expanded attribute", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-expanded");
    });

    it("should update aria-label based on menu state", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      expect(toggleButton).toHaveAttribute("aria-label", "Open menu");

      fireEvent.click(toggleButton);

      expect(toggleButton).toHaveAttribute("aria-label", "Close menu");
    });

    it("should be keyboard accessible", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);
      const button = screen.getByRole("button");
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  describe("edge cases", () => {
    it("should handle empty ruleSets array", () => {
      const emptyRuleSetsProps = {
        ...defaultProps,
        ruleSets: [],
      };

      const { container } = renderWithContext(
        <LandscapeMenu {...emptyRuleSetsProps} />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      // Should still render the menu
      const panel = container.querySelector(".landscape-menu-panel");
      expect(panel).toBeInTheDocument();
    });

    it("should handle rapid toggle clicks", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);

      const toggleButton = screen.getByRole("button");
      for (let i = 0; i < 10; i++) {
        fireEvent.click(toggleButton);
      }

      // Component should still be functional
      expect(toggleButton).toBeInTheDocument();
    });

    it("should handle multiple action clicks", () => {
      const onHelpClick = vi.fn();
      const toggleTheme = vi.fn();
      const resetGame = vi.fn();

      renderWithContext(
        <LandscapeMenu
          {...defaultProps}
          onHelpClick={onHelpClick}
          toggleTheme={toggleTheme}
          resetGame={resetGame}
        />,
      );

      const toggleButton = screen.getByRole("button", { name: /open menu/i });

      // Open and click help
      fireEvent.click(toggleButton);
      const helpButton = screen.getByText("How to Play").closest("button");
      fireEvent.click(helpButton);
      expect(onHelpClick).toHaveBeenCalledTimes(1);

      // Open and toggle theme
      fireEvent.click(toggleButton);
      const themeButton = screen.getByText("Light Mode").closest("button");
      fireEvent.click(themeButton);
      expect(toggleTheme).toHaveBeenCalledTimes(1);

      // Open and reset game
      fireEvent.click(toggleButton);
      const resetButton = screen.getByText("Reset Game").closest("button");
      fireEvent.click(resetButton);
      expect(resetGame).toHaveBeenCalledTimes(1);
    });
  });

  describe("cleanup", () => {
    it("should remove event listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

      const { unmount } = renderWithContext(
        <LandscapeMenu {...defaultProps} />,
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe("icon rendering", () => {
    it("should render question circle icon for How to Play", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const helpButton = screen.getByText("How to Play").closest("button");
      const icon = helpButton.querySelector(".landscape-menu-icon");
      expect(icon).toBeInTheDocument();
    });

    it("should render redo icon for Reset Game", () => {
      renderWithContext(<LandscapeMenu {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggleButton);

      const resetButton = screen.getByText("Reset Game").closest("button");
      const icon = resetButton.querySelector(".landscape-menu-icon");
      expect(icon).toBeInTheDocument();
    });
  });
});
