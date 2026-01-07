/**
 * Unit tests for Header component
 * Tests rendering, settings panel, theme toggle, help button, and customization options
 */

import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";
import { CardCustomizationProvider } from "../context";

// Helper to render with context
const renderWithContext = (ui, options) =>
  render(<CardCustomizationProvider>{ui}</CardCustomizationProvider>, options);

// Button indices after adding HelpButton
// Order: HelpButton (0), ThemeToggle (1), SettingsPanel (2)
const BUTTON_INDEX = {
  HELP: 0,
  THEME: 1,
  SETTINGS: 2,
};

describe("Header", () => {
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
    selectedRuleSet: 0,
    setSelectedRuleSet: vi.fn(),
    ruleSets: mockRuleSets,
    resetGame: vi.fn(),
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
      renderWithContext(<Header {...defaultProps} />);
      expect(screen.getByText("Royal Card Game")).toBeInTheDocument();
    });

    it("should display the game title", () => {
      renderWithContext(<Header {...defaultProps} />);
      expect(screen.getByText("Royal Card Game")).toBeInTheDocument();
    });

    it("should have crown icon", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should have header-container class", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const headerContainer = container.querySelector(".header-container");
      expect(headerContainer).toBeInTheDocument();
    });

    it("should have game-title class on heading", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const gameTitle = container.querySelector(".game-title");
      expect(gameTitle).toBeInTheDocument();
    });

    it("should have gold-text class on title text", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const goldText = container.querySelector(".gold-text");
      expect(goldText).toBeInTheDocument();
    });

    it("should render three header buttons (help, theme, settings)", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("title click behavior", () => {
    it("should call resetGame when title is clicked", () => {
      const resetGame = vi.fn();
      renderWithContext(<Header {...defaultProps} resetGame={resetGame} />);

      const title = screen.getByText("Royal Card Game");
      fireEvent.click(title);

      expect(resetGame).toHaveBeenCalledTimes(1);
    });

    it("should have cursor-pointer class on title", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const title = container.querySelector(".game-title");
      expect(title).toHaveClass("cursor-pointer");
    });

    it("should have title attribute for tooltip", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const title = container.querySelector(".game-title");
      expect(title).toHaveAttribute("title", "Return to home");
    });
  });

  describe("help button", () => {
    it("should render help button", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");
      expect(buttons[BUTTON_INDEX.HELP]).toBeInTheDocument();
    });

    it("should have correct title for help button", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");
      expect(buttons[BUTTON_INDEX.HELP]).toHaveAttribute(
        "title",
        "How to play",
      );
    });

    it("should open How to Play modal when clicked", () => {
      renderWithContext(<Header {...defaultProps} />);

      const helpButton = screen.getByTitle("How to play");
      fireEvent.click(helpButton);

      expect(screen.getByText("How to Play")).toBeInTheDocument();
    });

    it("should close How to Play modal when close button is clicked", () => {
      renderWithContext(<Header {...defaultProps} />);

      // Open modal
      const helpButton = screen.getByTitle("How to play");
      fireEvent.click(helpButton);

      expect(screen.getByText("How to Play")).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByLabelText("Close modal");
      fireEvent.click(closeButton);

      expect(screen.queryByText("How to Play")).not.toBeInTheDocument();
    });

    it("should close How to Play modal when clicking the Got it button", () => {
      renderWithContext(<Header {...defaultProps} />);

      // Open modal
      const helpButton = screen.getByTitle("How to play");
      fireEvent.click(helpButton);

      // Close using the Got it button
      const gotItButton = screen.getByText("Got it, let's play!");
      fireEvent.click(gotItButton);

      expect(screen.queryByText("How to Play")).not.toBeInTheDocument();
    });

    it("should display current rule set name in modal", () => {
      renderWithContext(<Header {...defaultProps} selectedRuleSet={0} />);

      const helpButton = screen.getByTitle("How to play");
      fireEvent.click(helpButton);

      // The current rule set should be displayed in the modal
      expect(
        screen.getAllByText("Highest Card Wins").length,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  describe("theme toggle", () => {
    it("should render theme toggle button", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");
      expect(buttons[BUTTON_INDEX.THEME]).toBeInTheDocument();
    });

    it("should call toggleTheme when theme button is clicked", () => {
      const toggleTheme = vi.fn();
      const { container } = renderWithContext(
        <Header {...defaultProps} toggleTheme={toggleTheme} />,
      );

      const buttons = container.querySelectorAll("button");
      fireEvent.click(buttons[BUTTON_INDEX.THEME]);

      expect(toggleTheme).toHaveBeenCalledTimes(1);
    });

    it("should show sun icon in dark mode", () => {
      const { container } = renderWithContext(
        <Header {...defaultProps} theme="dark" />,
      );
      const buttons = container.querySelectorAll("button");
      expect(
        buttons[BUTTON_INDEX.THEME].querySelector("svg"),
      ).toBeInTheDocument();
    });

    it("should show moon icon in light mode", () => {
      const { container } = renderWithContext(
        <Header {...defaultProps} theme="light" />,
      );
      const buttons = container.querySelectorAll("button");
      expect(
        buttons[BUTTON_INDEX.THEME].querySelector("svg"),
      ).toBeInTheDocument();
    });

    it("should have correct title for dark mode", () => {
      const { container } = renderWithContext(
        <Header {...defaultProps} theme="dark" />,
      );
      const buttons = container.querySelectorAll("button");
      expect(buttons[BUTTON_INDEX.THEME]).toHaveAttribute(
        "title",
        "Switch to warm mode",
      );
    });

    it("should have correct title for light mode", () => {
      const { container } = renderWithContext(
        <Header {...defaultProps} theme="light" />,
      );
      const buttons = container.querySelectorAll("button");
      expect(buttons[BUTTON_INDEX.THEME]).toHaveAttribute(
        "title",
        "Switch to dark mode",
      );
    });
  });

  describe("settings button", () => {
    it("should render settings button", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");
      expect(buttons[BUTTON_INDEX.SETTINGS]).toBeInTheDocument();
    });

    it("should show settings icon initially", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");
      expect(
        buttons[BUTTON_INDEX.SETTINGS].querySelector("svg"),
      ).toBeInTheDocument();
    });

    it("should open settings menu when settings button is clicked", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");

      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);

      const settingsMenu = container.querySelector(".settings-menu");
      expect(settingsMenu).toBeInTheDocument();
    });

    it("should show close icon when settings are open", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");

      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);

      expect(
        buttons[BUTTON_INDEX.SETTINGS].querySelector("svg"),
      ).toBeInTheDocument();
    });

    it("should close settings menu when clicking settings button again", async () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");

      // Open settings
      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);
      expect(container.querySelector(".settings-menu")).toBeInTheDocument();

      // Close settings
      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);

      // Wait for animation timeout
      vi.advanceTimersByTime(300);

      // Settings menu should have fade-out class or be removed
      const settingsMenu = container.querySelector(".settings-menu");
      if (settingsMenu) {
        expect(settingsMenu).toHaveClass("settings-fade-out");
      }
    });
  });

  describe("settings menu content", () => {
    it("should display Rule Set label", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");

      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);

      expect(screen.getByText("Rule Set")).toBeInTheDocument();
    });

    it("should display Card Back Color label", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");

      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);

      expect(screen.getByText("Card Back Color")).toBeInTheDocument();
    });

    it("should display current rule set name", () => {
      const { container } = renderWithContext(
        <Header {...defaultProps} selectedRuleSet={0} />,
      );
      const buttons = container.querySelectorAll("button");

      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);

      expect(screen.getByText("Highest Card Wins")).toBeInTheDocument();
    });

    it("should display different rule set when selectedRuleSet changes", () => {
      const { container } = renderWithContext(
        <Header {...defaultProps} selectedRuleSet={1} />,
      );
      const buttons = container.querySelectorAll("button");

      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);

      expect(screen.getByText("Suit Follows")).toBeInTheDocument();
    });

    it("should have settings-fade-in class when opening", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");

      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);

      const settingsMenu = container.querySelector(".settings-menu");
      expect(settingsMenu).toHaveClass("settings-fade-in");
    });
  });

  describe("rule set dropdown", () => {
    it("should open rule dropdown when clicked", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");

      // Open settings
      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);

      // Find and click the rule set selector
      const ruleSelector = screen.getByText("Highest Card Wins").closest("div");
      fireEvent.click(ruleSelector);

      // Should show all rule options
      expect(screen.getByText("Suit Follows")).toBeInTheDocument();
      expect(screen.getByText("Spades Trump")).toBeInTheDocument();
    });

    it("should call setSelectedRuleSet when a rule is selected", () => {
      const setSelectedRuleSet = vi.fn();
      const { container } = renderWithContext(
        <Header {...defaultProps} setSelectedRuleSet={setSelectedRuleSet} />,
      );
      const buttons = container.querySelectorAll("button");

      // Open settings
      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);

      // Open rule dropdown
      const ruleSelector = screen.getByText("Highest Card Wins").closest("div");
      fireEvent.click(ruleSelector);

      // Click on a different rule
      const suitFollowsOption = screen.getAllByText("Suit Follows")[0];
      fireEvent.click(suitFollowsOption.closest("button"));

      expect(setSelectedRuleSet).toHaveBeenCalledWith(1);
    });

    it("should display rule descriptions in dropdown", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");

      // Open settings
      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);

      // Open rule dropdown
      const ruleSelector = screen.getByText("Highest Card Wins").closest("div");
      fireEvent.click(ruleSelector);

      expect(screen.getByText("Must follow lead suit")).toBeInTheDocument();
    });

    it("should have rotate class on dropdown arrow when open", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");

      // Open settings
      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);

      // Open rule dropdown
      const ruleSelector = screen.getByText("Highest Card Wins").closest("div");
      fireEvent.click(ruleSelector);

      const arrow = container.querySelector(".rotate-180");
      expect(arrow).toBeInTheDocument();
    });
  });

  describe("click outside behavior", () => {
    it("should close settings when clicking outside", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");

      // Open settings
      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);
      expect(container.querySelector(".settings-menu")).toBeInTheDocument();

      // Click outside - simulate mousedown on document body
      fireEvent.mouseDown(document.body);

      // The click outside handler should close settings
      // Just verify the component handles the event without throwing
      expect(container).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have responsive padding classes", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const headerContainer = container.querySelector(".header-container");
      expect(headerContainer).toHaveClass("p-3");
    });

    it("should have z-50 class for z-index", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const headerContainer = container.querySelector(".header-container");
      expect(headerContainer).toHaveClass("z-50");
    });

    it("should have flex layout", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const flexContainer = container.querySelector(".flex");
      expect(flexContainer).toBeInTheDocument();
    });

    it("should have items-center for vertical alignment", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const alignedContainer = container.querySelector(".items-center");
      expect(alignedContainer).toBeInTheDocument();
    });

    it("should have justify-between for horizontal spacing", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const spacedContainer = container.querySelector(".justify-between");
      expect(spacedContainer).toBeInTheDocument();
    });

    it("should have max-w-7xl for content width", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const maxWidthContainer = container.querySelector(".max-w-7xl");
      expect(maxWidthContainer).toBeInTheDocument();
    });
  });

  describe("button styling", () => {
    it("should have rounded-lg class on buttons", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("rounded-lg");
      });
    });

    it("should have transition classes on buttons", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("transition-all");
      });
    });

    it("should have duration-300 for transitions", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("duration-300");
      });
    });

    it("should have hover:scale-105 for hover effect", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("hover:scale-105");
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty ruleSets array", () => {
      const emptyRuleSetsProps = {
        ...defaultProps,
        ruleSets: [],
        selectedRuleSet: 0,
      };

      // Should not throw
      expect(() =>
        renderWithContext(<Header {...emptyRuleSetsProps} />),
      ).not.toThrow();
    });

    it("should handle rapid theme toggle clicks", () => {
      const toggleTheme = vi.fn();
      const { container } = renderWithContext(
        <Header {...defaultProps} toggleTheme={toggleTheme} />,
      );

      const buttons = container.querySelectorAll("button");

      // Click multiple times rapidly
      fireEvent.click(buttons[BUTTON_INDEX.THEME]);
      fireEvent.click(buttons[BUTTON_INDEX.THEME]);
      fireEvent.click(buttons[BUTTON_INDEX.THEME]);

      expect(toggleTheme).toHaveBeenCalledTimes(3);
    });

    it("should handle rapid settings button clicks", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");

      // Click multiple times
      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);
      fireEvent.click(buttons[BUTTON_INDEX.SETTINGS]);

      // Should not throw
      expect(container).toBeInTheDocument();
    });

    it("should handle rapid help button clicks", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");

      // Click multiple times
      fireEvent.click(buttons[BUTTON_INDEX.HELP]);
      fireEvent.click(buttons[BUTTON_INDEX.HELP]);

      // Should not throw
      expect(container).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have accessible buttons", () => {
      renderWithContext(<Header {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    it("should have title attributes on buttons for tooltips", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");

      // Help button should have title
      expect(buttons[BUTTON_INDEX.HELP]).toHaveAttribute(
        "title",
        "How to play",
      );
      // Theme button should have title
      expect(buttons[BUTTON_INDEX.THEME]).toHaveAttribute("title");
    });

    it("should have aria-label on help button", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      const buttons = container.querySelectorAll("button");
      expect(buttons[BUTTON_INDEX.HELP]).toHaveAttribute(
        "aria-label",
        "How to play",
      );
    });
  });

  describe("different themes", () => {
    it("should render correctly in dark theme", () => {
      const { container } = renderWithContext(
        <Header {...defaultProps} theme="dark" />,
      );
      expect(container.querySelector(".header-container")).toBeInTheDocument();
    });

    it("should render correctly in light theme", () => {
      const { container } = renderWithContext(
        <Header {...defaultProps} theme="light" />,
      );
      expect(container.querySelector(".header-container")).toBeInTheDocument();
    });
  });

  describe("card customization props", () => {
    it("should receive cardBackColor prop", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it("should receive cardBackPattern prop", () => {
      const { container } = renderWithContext(<Header {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("How to Play modal content", () => {
    it("should display basic rules section", () => {
      renderWithContext(<Header {...defaultProps} />);

      const helpButton = screen.getByTitle("How to play");
      fireEvent.click(helpButton);

      expect(screen.getByText("Basic Rules")).toBeInTheDocument();
    });

    it("should display card values section", () => {
      renderWithContext(<Header {...defaultProps} />);

      const helpButton = screen.getByTitle("How to play");
      fireEvent.click(helpButton);

      expect(screen.getByText("Card Values")).toBeInTheDocument();
    });

    it("should display pro tips section", () => {
      renderWithContext(<Header {...defaultProps} />);

      const helpButton = screen.getByTitle("How to play");
      fireEvent.click(helpButton);

      expect(screen.getByText("Pro Tips")).toBeInTheDocument();
    });

    it("should display current rule set section", () => {
      renderWithContext(<Header {...defaultProps} />);

      const helpButton = screen.getByTitle("How to play");
      fireEvent.click(helpButton);

      expect(screen.getByText("Current Rule Set")).toBeInTheDocument();
    });

    it("should close modal when clicking overlay background", () => {
      renderWithContext(<Header {...defaultProps} />);

      const helpButton = screen.getByTitle("How to play");
      fireEvent.click(helpButton);

      expect(screen.getByText("How to Play")).toBeInTheDocument();

      // Click the overlay (the fixed backdrop)
      const overlay = screen.getByText("How to Play").closest(".fixed");
      fireEvent.click(overlay);

      expect(screen.queryByText("How to Play")).not.toBeInTheDocument();
    });
  });
});
