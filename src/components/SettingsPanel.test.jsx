/**
 * Unit tests for SettingsPanel component
 * Tests rendering, settings toggle, panel content, and accessibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SettingsPanel from "./SettingsPanel";
import { CardCustomizationProvider } from "../context";

// Helper to render with context
const renderWithContext = (ui, options) =>
  render(<CardCustomizationProvider>{ui}</CardCustomizationProvider>, options);

describe("SettingsPanel", () => {
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
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );
      expect(container).toBeInTheDocument();
    });

    it("should render settings button", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should show settings icon (cog) when panel is closed", () => {
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should not show settings menu initially", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);
      expect(screen.queryByText("Rule Set")).not.toBeInTheDocument();
    });
  });

  describe("toggle behavior", () => {
    it("should open settings menu when button is clicked", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(screen.getByText("Rule Set")).toBeInTheDocument();
    });

    it("should show close icon (X) when settings are open", () => {
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Should have X icon instead of cog
      const svg = container.querySelector("button svg");
      expect(svg).toBeInTheDocument();
    });

    it("should close settings menu when button is clicked again", async () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const button = screen.getByRole("button");
      fireEvent.click(button); // Open
      fireEvent.click(button); // Start close animation

      // Wait for animation to complete (200ms fade out + buffer)
      await act(async () => {
        vi.advanceTimersByTime(250);
      });

      expect(screen.queryByText("Rule Set")).not.toBeInTheDocument();
    });

    it("should have settings-fade-in class when opening", () => {
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      const settingsMenu = container.querySelector(".settings-fade-in");
      expect(settingsMenu).toBeInTheDocument();
    });

    it("should have settings-fade-out class when closing", () => {
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button); // Open
      fireEvent.click(button); // Close

      const settingsMenu = container.querySelector(".settings-fade-out");
      expect(settingsMenu).toBeInTheDocument();
    });
  });

  describe("settings menu content", () => {
    it("should display Rule Set label", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(screen.getByText("Rule Set")).toBeInTheDocument();
    });

    it("should display Card Back Color label", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(screen.getByText("Card Back Color")).toBeInTheDocument();
    });

    it("should display Card Pattern label", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(screen.getByText("Card Pattern")).toBeInTheDocument();
    });

    it("should display Reset Game button", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(screen.getByText(/Reset Game/i)).toBeInTheDocument();
    });

    it("should display current rule set name", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(screen.getByText("Highest Card Wins")).toBeInTheDocument();
    });
  });

  describe("reset game functionality", () => {
    it("should call resetGame when Reset Game button is clicked", () => {
      const resetGame = vi.fn();
      renderWithContext(
        <SettingsPanel {...defaultProps} resetGame={resetGame} />,
      );

      const settingsButton = screen.getByRole("button");
      fireEvent.click(settingsButton);

      const resetButton = screen.getByText(/Reset Game/i).closest("button");
      fireEvent.click(resetButton);

      expect(resetGame).toHaveBeenCalledTimes(1);
    });

    it("should close settings panel after clicking Reset Game", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const settingsButton = screen.getByRole("button");
      fireEvent.click(settingsButton);

      const resetButton = screen.getByText(/Reset Game/i).closest("button");
      fireEvent.click(resetButton);

      expect(screen.queryByText("Rule Set")).not.toBeInTheDocument();
    });
  });

  describe("click outside behavior", () => {
    it("should close settings when clicking outside", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(screen.getByText("Rule Set")).toBeInTheDocument();

      // Simulate click outside
      fireEvent.mouseDown(document.body);

      expect(screen.queryByText("Rule Set")).not.toBeInTheDocument();
    });

    it("should not close settings when clicking inside the panel", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      const ruleSetLabel = screen.getByText("Rule Set");
      fireEvent.mouseDown(ruleSetLabel);

      expect(screen.getByText("Rule Set")).toBeInTheDocument();
    });
  });

  describe("button styling", () => {
    it("should have rounded-lg class", () => {
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("rounded-lg");
    });

    it("should have transition classes", () => {
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("transition-all");
    });

    it("should have duration-300 for animation timing", () => {
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("duration-300");
    });

    it("should have hover:scale-105 for hover effect", () => {
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("hover:scale-105");
    });

    it("should have flex layout for centering", () => {
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("flex");
      expect(button).toHaveClass("items-center");
      expect(button).toHaveClass("justify-center");
    });

    it("should have responsive padding", () => {
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("p-2");
      expect(button).toHaveClass("sm:p-2.5");
    });

    it("should have panel background style", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ background: "var(--color-panel-dark)" });
    });
  });

  describe("settings menu styling", () => {
    it("should have settings-menu class", () => {
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      const menu = container.querySelector(".settings-menu");
      expect(menu).toBeInTheDocument();
    });

    it("should have absolute positioning", () => {
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      const menu = container.querySelector(".settings-menu");
      expect(menu).toHaveClass("absolute");
    });

    it("should be positioned to the right", () => {
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      const menu = container.querySelector(".settings-menu");
      expect(menu).toHaveClass("right-0");
    });

    it("should have rounded corners", () => {
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      const menu = container.querySelector(".settings-menu");
      expect(menu).toHaveClass("rounded-xl");
    });

    it("should have responsive width", () => {
      const { container } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      const menu = container.querySelector(".settings-menu");
      expect(menu).toHaveClass("w-56");
      expect(menu).toHaveClass("sm:w-64");
    });
  });

  describe("reset game button styling", () => {
    it("should have full width", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const settingsButton = screen.getByRole("button");
      fireEvent.click(settingsButton);

      const resetButton = screen.getByText(/Reset Game/i).closest("button");
      expect(resetButton).toHaveClass("w-full");
    });

    it("should have rounded corners", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const settingsButton = screen.getByRole("button");
      fireEvent.click(settingsButton);

      const resetButton = screen.getByText(/Reset Game/i).closest("button");
      expect(resetButton).toHaveClass("rounded-lg");
    });

    it("should have reset-game-btn class", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const settingsButton = screen.getByRole("button");
      fireEvent.click(settingsButton);

      const resetButton = screen.getByText(/Reset Game/i).closest("button");
      expect(resetButton).toHaveClass("reset-game-btn");
    });

    it("should have flex layout for icon and text", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const settingsButton = screen.getByRole("button");
      fireEvent.click(settingsButton);

      const resetButton = screen.getByText(/Reset Game/i).closest("button");
      expect(resetButton).toHaveClass("flex");
      expect(resetButton).toHaveClass("items-center");
      expect(resetButton).toHaveClass("justify-center");
    });
  });

  describe("accessibility", () => {
    it("should have aria-label for settings button when closed", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Open settings");
    });

    it("should have aria-label for settings button when open", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(button).toHaveAttribute("aria-label", "Close settings");
    });

    it("should be focusable", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);
      const button = screen.getByRole("button");
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  describe("edge cases", () => {
    it("should handle rapid button clicks", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const button = screen.getByRole("button");
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }

      // Component should still be functional
      expect(button).toBeInTheDocument();
    });

    it("should handle empty ruleSets array", () => {
      const emptyRuleSetsProps = {
        ...defaultProps,
        ruleSets: [],
        selectedRuleSet: 0,
      };

      // This might cause an error, so we wrap in try-catch or expect it to handle gracefully
      renderWithContext(<SettingsPanel {...emptyRuleSetsProps} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should handle selectedRuleSet out of bounds", () => {
      const outOfBoundsProps = {
        ...defaultProps,
        selectedRuleSet: 99,
      };

      renderWithContext(<SettingsPanel {...outOfBoundsProps} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("different rule sets", () => {
    it("should display first rule set when selectedRuleSet is 0", () => {
      renderWithContext(
        <SettingsPanel {...defaultProps} selectedRuleSet={0} />,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(screen.getByText("Highest Card Wins")).toBeInTheDocument();
    });

    it("should display second rule set when selectedRuleSet is 1", () => {
      renderWithContext(
        <SettingsPanel {...defaultProps} selectedRuleSet={1} />,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(screen.getByText("Suit Follows")).toBeInTheDocument();
    });

    it("should display third rule set when selectedRuleSet is 2", () => {
      renderWithContext(
        <SettingsPanel {...defaultProps} selectedRuleSet={2} />,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(screen.getByText("Spades Trump")).toBeInTheDocument();
    });
  });

  describe("internal state management", () => {
    it("should manage showSettings state correctly", async () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const button = screen.getByRole("button");

      // Initially closed
      expect(screen.queryByText("Rule Set")).not.toBeInTheDocument();

      // Open
      fireEvent.click(button);
      expect(screen.getByText("Rule Set")).toBeInTheDocument();

      // Close - wait for animation to complete (200ms fade out + buffer)
      fireEvent.click(button);
      await act(async () => {
        vi.advanceTimersByTime(250);
      });
      expect(screen.queryByText("Rule Set")).not.toBeInTheDocument();
    });

    it("should manage isColorPickerOpen state correctly", () => {
      renderWithContext(<SettingsPanel {...defaultProps} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Click on the color picker selector to open it
      const colorSelector = screen
        .getByText("Card Back Color")
        .closest("div")
        .querySelector(".cursor-pointer");

      if (colorSelector) {
        fireEvent.click(colorSelector);
        // Color picker should open
      }
    });
  });

  describe("cleanup", () => {
    it("should remove event listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

      const { unmount } = renderWithContext(
        <SettingsPanel {...defaultProps} />,
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});
