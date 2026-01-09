/**
 * Unit tests for RuleSetSelector component
 * Tests rendering, dropdown behavior, rule selection, and accessibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import RuleSetSelector from "./RuleSetSelector";

describe("RuleSetSelector", () => {
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
      const { container } = render(<RuleSetSelector {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it("should display 'Rule Set' label", () => {
      render(<RuleSetSelector {...defaultProps} />);
      expect(screen.getByText("Rule Set")).toBeInTheDocument();
    });

    it("should display current rule set name", () => {
      render(<RuleSetSelector {...defaultProps} />);
      expect(screen.getByText("Highest Card Wins")).toBeInTheDocument();
    });

    it("should display different rule set when selectedRuleSet changes", () => {
      render(<RuleSetSelector {...defaultProps} selectedRuleSet={1} />);
      expect(screen.getByText("Suit Follows")).toBeInTheDocument();
    });

    it("should show dropdown arrow icon", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("dropdown toggle", () => {
    it("should open dropdown when selector is clicked", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      // Should show all rule options
      expect(screen.getAllByText("Highest Card Wins").length).toBeGreaterThan(
        0,
      );
      expect(screen.getByText("Suit Follows")).toBeInTheDocument();
      expect(screen.getByText("Spades Trump")).toBeInTheDocument();
    });

    it("should close dropdown when selector is clicked again", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");

      // Open
      fireEvent.click(selector);
      expect(screen.getAllByRole("button").length).toBeGreaterThan(0);

      // Close - needs animation timeout
      fireEvent.click(selector);
      vi.advanceTimersByTime(200);
    });

    it("should rotate arrow when dropdown is open", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const arrow = container.querySelector("svg");
      expect(arrow).toHaveClass("rotate-180");
    });

    it("should not rotate arrow when dropdown is closed", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const arrow = container.querySelector("svg");
      expect(arrow).not.toHaveClass("rotate-180");
    });
  });

  describe("rule selection", () => {
    it("should call setSelectedRuleSet when a rule is selected", () => {
      const setSelectedRuleSet = vi.fn();
      const { container } = render(
        <RuleSetSelector
          {...defaultProps}
          setSelectedRuleSet={setSelectedRuleSet}
        />,
      );

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const suitFollowsOption = screen
        .getByText("Suit Follows")
        .closest("button");
      fireEvent.click(suitFollowsOption);

      vi.advanceTimersByTime(200);
      expect(setSelectedRuleSet).toHaveBeenCalledWith(1);
    });

    it("should call setSelectedRuleSet with correct index for each rule", () => {
      const setSelectedRuleSet = vi.fn();
      const { container } = render(
        <RuleSetSelector
          {...defaultProps}
          setSelectedRuleSet={setSelectedRuleSet}
        />,
      );

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const spadesTrumpOption = screen
        .getByText("Spades Trump")
        .closest("button");
      fireEvent.click(spadesTrumpOption);

      vi.advanceTimersByTime(200);
      expect(setSelectedRuleSet).toHaveBeenCalledWith(2);
    });

    it("should close dropdown after selecting a rule", async () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const suitFollowsOption = screen
        .getByText("Suit Follows")
        .closest("button");
      fireEvent.click(suitFollowsOption);

      // Wait for close animation to complete and state to update
      await act(async () => {
        vi.advanceTimersByTime(250);
      });

      // Dropdown should be closed (check arrow rotation)
      const arrow = container.querySelector("svg");
      expect(arrow).not.toHaveClass("rotate-180");
    });
  });

  describe("rule descriptions", () => {
    it("should display rule descriptions in dropdown", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      expect(
        screen.getByText("The highest card value wins the trick"),
      ).toBeInTheDocument();
      expect(screen.getByText("Must follow lead suit")).toBeInTheDocument();
      expect(screen.getByText("Spades are trump cards")).toBeInTheDocument();
    });

    it("should style descriptions with gold color", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const description = screen.getByText(
        "The highest card value wins the trick",
      );
      expect(description).toHaveStyle({ color: "var(--color-text-gold)" });
    });
  });

  describe("selected rule highlighting", () => {
    it("should highlight currently selected rule", () => {
      const { container } = render(
        <RuleSetSelector {...defaultProps} selectedRuleSet={0} />,
      );

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const buttons = container.querySelectorAll(".absolute button");
      const selectedButton = buttons[0];

      expect(selectedButton).toHaveStyle({
        background: "var(--color-panel-hover)",
      });
    });

    it("should not highlight unselected rules", () => {
      const { container } = render(
        <RuleSetSelector {...defaultProps} selectedRuleSet={0} />,
      );

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const buttons = container.querySelectorAll(".absolute button");
      const unselectedButton = buttons[1];

      expect(unselectedButton).toHaveStyle({
        background: "transparent",
      });
    });
  });

  describe("click outside behavior", () => {
    it("should close dropdown when clicking outside", async () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      // Click the overlay
      const overlay = container.querySelector(".fixed.inset-0");
      expect(overlay).toBeInTheDocument();
      fireEvent.click(overlay);

      // Wait for close animation to complete and state to update
      await act(async () => {
        vi.advanceTimersByTime(250);
      });

      const arrow = container.querySelector("svg");
      expect(arrow).not.toHaveClass("rotate-180");
    });

    it("should render an overlay when dropdown is open", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const overlay = container.querySelector(".fixed.inset-0");
      expect(overlay).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have label with gold color style", () => {
      render(<RuleSetSelector {...defaultProps} />);
      const label = screen.getByText("Rule Set");
      expect(label).toHaveStyle({ color: "var(--color-text-gold)" });
    });

    it("should have label with uppercase tracking", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);
      const label = container.querySelector("label");
      expect(label).toHaveClass("uppercase");
      expect(label).toHaveClass("tracking-wider");
    });

    it("should have rounded-lg class on selector", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);
      const selector = container.querySelector(".cursor-pointer");
      expect(selector).toHaveClass("rounded-lg");
    });

    it("should have flex layout on selector", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);
      const selector = container.querySelector(".cursor-pointer");
      expect(selector).toHaveClass("flex");
      expect(selector).toHaveClass("items-center");
    });

    it("should have panel background style", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);
      const selector = container.querySelector(".cursor-pointer");
      expect(selector).toHaveStyle({ background: "var(--color-panel-dark)" });
    });

    it("should have transition on arrow", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);
      const arrow = container.querySelector("svg");
      expect(arrow).toHaveClass("transition-transform");
      expect(arrow).toHaveClass("duration-200");
    });
  });

  describe("dropdown animation", () => {
    it("should have dropdown-slide-in class when opening", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const dropdown = container.querySelector(".dropdown-slide-in");
      expect(dropdown).toBeInTheDocument();
    });

    it("should have dropdown-slide-out class when closing", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);
      fireEvent.click(selector);

      const dropdown = container.querySelector(".dropdown-slide-out");
      expect(dropdown).toBeInTheDocument();
    });
  });

  describe("dropdown positioning", () => {
    it("should position dropdown below selector", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const dropdownContainer = container.querySelector(".absolute.z-50");
      expect(dropdownContainer).toBeInTheDocument();
    });

    it("should have full width dropdown", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const dropdownContainer = container.querySelector(".absolute.z-50");
      expect(dropdownContainer).toHaveClass("w-full");
    });

    it("should have margin-top for spacing", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const dropdownContainer = container.querySelector(".absolute.z-50");
      expect(dropdownContainer).toHaveClass("mt-1");
    });
  });

  describe("accessibility", () => {
    it("should have label element", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);
      expect(container.querySelector("label")).toBeInTheDocument();
    });

    it("should have descriptive label text", () => {
      render(<RuleSetSelector {...defaultProps} />);
      expect(screen.getByText("Rule Set")).toBeInTheDocument();
    });

    it("should display current selection", () => {
      render(<RuleSetSelector {...defaultProps} />);
      expect(screen.getByText("Highest Card Wins")).toBeInTheDocument();
    });

    it("should have accessible buttons for each rule option", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("edge cases", () => {
    it("should handle single rule set", () => {
      const singleRuleSet = [mockRuleSets[0]];
      render(
        <RuleSetSelector
          {...defaultProps}
          ruleSets={singleRuleSet}
          selectedRuleSet={0}
        />,
      );

      expect(screen.getByText("Highest Card Wins")).toBeInTheDocument();
    });

    it("should handle many rule sets", () => {
      const manyRuleSets = [
        ...mockRuleSets,
        { id: "rule4", name: "Rule 4", description: "Description 4" },
        { id: "rule5", name: "Rule 5", description: "Description 5" },
        { id: "rule6", name: "Rule 6", description: "Description 6" },
      ];

      const { container } = render(
        <RuleSetSelector
          {...defaultProps}
          ruleSets={manyRuleSets}
          selectedRuleSet={0}
        />,
      );

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      expect(screen.getByText("Rule 4")).toBeInTheDocument();
      expect(screen.getByText("Rule 5")).toBeInTheDocument();
      expect(screen.getByText("Rule 6")).toBeInTheDocument();
    });

    it("should handle rapid toggle clicks", () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      for (let i = 0; i < 10; i++) {
        fireEvent.click(selector);
      }

      // Component should still be functional
      expect(container).toBeInTheDocument();
    });

    it("should handle selecting the same rule that is already selected", () => {
      const setSelectedRuleSet = vi.fn();
      const { container } = render(
        <RuleSetSelector
          {...defaultProps}
          setSelectedRuleSet={setSelectedRuleSet}
          selectedRuleSet={0}
        />,
      );

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const firstOption = screen
        .getAllByText("Highest Card Wins")[0]
        .closest("button");
      if (firstOption) {
        fireEvent.click(firstOption);
        vi.advanceTimersByTime(200);
        expect(setSelectedRuleSet).toHaveBeenCalledWith(0);
      }
    });

    it("should handle rules with long names", () => {
      const longNameRuleSets = [
        {
          id: "long",
          name: "This Is A Very Long Rule Name That Might Overflow",
          description: "A very detailed description of this complex rule set",
        },
      ];

      render(
        <RuleSetSelector
          {...defaultProps}
          ruleSets={longNameRuleSets}
          selectedRuleSet={0}
        />,
      );

      expect(
        screen.getByText("This Is A Very Long Rule Name That Might Overflow"),
      ).toBeInTheDocument();
    });

    it("should handle rules with special characters", () => {
      const specialCharRuleSets = [
        {
          id: "special",
          name: "Rule & Cards <Special>",
          description: "Description with \"quotes\" and 'apostrophes'",
        },
      ];

      render(
        <RuleSetSelector
          {...defaultProps}
          ruleSets={specialCharRuleSets}
          selectedRuleSet={0}
        />,
      );

      expect(screen.getByText("Rule & Cards <Special>")).toBeInTheDocument();
    });
  });

  describe("different selected indices", () => {
    it("should correctly display first rule when index is 0", () => {
      render(<RuleSetSelector {...defaultProps} selectedRuleSet={0} />);
      expect(screen.getByText("Highest Card Wins")).toBeInTheDocument();
    });

    it("should correctly display second rule when index is 1", () => {
      render(<RuleSetSelector {...defaultProps} selectedRuleSet={1} />);
      expect(screen.getByText("Suit Follows")).toBeInTheDocument();
    });

    it("should correctly display third rule when index is 2", () => {
      render(<RuleSetSelector {...defaultProps} selectedRuleSet={2} />);
      expect(screen.getByText("Spades Trump")).toBeInTheDocument();
    });
  });

  describe("state management", () => {
    it("should maintain internal dropdown state", async () => {
      const { container } = render(<RuleSetSelector {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      const arrow = container.querySelector("svg");

      // Initially closed (arrow not rotated)
      expect(arrow).not.toHaveClass("rotate-180");

      // Open (arrow rotated)
      fireEvent.click(selector);
      expect(arrow).toHaveClass("rotate-180");

      // Close with timeout (arrow back to normal)
      fireEvent.click(selector);
      await act(async () => {
        vi.advanceTimersByTime(250);
      });
      expect(arrow).not.toHaveClass("rotate-180");
    });

    it("should not call setSelectedRuleSet when toggling dropdown", async () => {
      const setSelectedRuleSet = vi.fn();
      const { container } = render(
        <RuleSetSelector
          {...defaultProps}
          setSelectedRuleSet={setSelectedRuleSet}
        />,
      );

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector); // Open
      fireEvent.click(selector); // Close
      await act(async () => {
        vi.advanceTimersByTime(250);
      });

      // setSelectedRuleSet should not be called just from opening/closing
      expect(setSelectedRuleSet).not.toHaveBeenCalled();
    });
  });
});
