/**
 * Unit tests for TurnInstructionOverlay component
 * Tests rendering, visibility, auto-dismiss, and interaction behavior
 */

import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TurnInstructionOverlay from "./TurnInstructionOverlay";

describe("TurnInstructionOverlay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  const defaultProps = {
    visible: true,
    ruleSetName: "Highest Card Wins",
    ruleSetDescription: "The highest card value wins the trick",
    onDismiss: vi.fn(),
  };

  describe("rendering", () => {
    it("should not render when visible is false", () => {
      render(<TurnInstructionOverlay {...defaultProps} visible={false} />);
      expect(screen.queryByText("Your Turn")).not.toBeInTheDocument();
    });

    it("should render after delay when visible is true", async () => {
      render(<TurnInstructionOverlay {...defaultProps} />);

      // Initially not visible
      expect(screen.queryByText("Your Turn")).not.toBeInTheDocument();

      // After delay, should be visible
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText("Your Turn")).toBeInTheDocument();
    });

    it("should display the rule set name", async () => {
      render(<TurnInstructionOverlay {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText("Highest Card Wins")).toBeInTheDocument();
    });

    it("should display the rule set description", async () => {
      render(<TurnInstructionOverlay {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(
        screen.getByText("The highest card value wins the trick"),
      ).toBeInTheDocument();
    });

    it("should display drag instruction", async () => {
      render(<TurnInstructionOverlay {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText("Drag a card to play")).toBeInTheDocument();
    });

    it("should display dismiss hint", async () => {
      render(<TurnInstructionOverlay {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText("Click anywhere to dismiss")).toBeInTheDocument();
    });

    it("should use default values when props are not provided", async () => {
      render(<TurnInstructionOverlay visible={true} />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText("Highest Card Wins")).toBeInTheDocument();
      expect(
        screen.getByText("Play your highest value card to win the trick"),
      ).toBeInTheDocument();
    });
  });

  describe("different rule sets", () => {
    it("should display Suit Follows rule", async () => {
      render(
        <TurnInstructionOverlay
          {...defaultProps}
          ruleSetName="Suit Follows"
          ruleSetDescription="Must follow lead suit, highest of lead suit wins"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText("Suit Follows")).toBeInTheDocument();
      expect(
        screen.getByText("Must follow lead suit, highest of lead suit wins"),
      ).toBeInTheDocument();
    });

    it("should display Spades Trump rule", async () => {
      render(
        <TurnInstructionOverlay
          {...defaultProps}
          ruleSetName="Spades Trump"
          ruleSetDescription="Spades are trump cards and beat all other suits"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText("Spades Trump")).toBeInTheDocument();
      expect(
        screen.getByText("Spades are trump cards and beat all other suits"),
      ).toBeInTheDocument();
    });
  });

  describe("auto-dismiss", () => {
    it("should auto-dismiss after 5 seconds", async () => {
      const onDismiss = vi.fn();
      render(
        <TurnInstructionOverlay {...defaultProps} onDismiss={onDismiss} />,
      );

      // Show the overlay
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText("Your Turn")).toBeInTheDocument();

      // Wait for auto-dismiss (5000ms + 300ms for animation)
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Should start exit animation and call onDismiss
      act(() => {
        vi.advanceTimersByTime(400);
      });

      expect(onDismiss).toHaveBeenCalled();
    });
  });

  describe("interaction dismissal", () => {
    it("should dismiss on mousedown", async () => {
      const onDismiss = vi.fn();
      render(
        <TurnInstructionOverlay {...defaultProps} onDismiss={onDismiss} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText("Your Turn")).toBeInTheDocument();

      // Simulate mousedown
      fireEvent.mouseDown(document);

      act(() => {
        vi.advanceTimersByTime(400);
      });

      expect(onDismiss).toHaveBeenCalled();
    });

    it("should dismiss on touchstart", async () => {
      const onDismiss = vi.fn();
      render(
        <TurnInstructionOverlay {...defaultProps} onDismiss={onDismiss} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText("Your Turn")).toBeInTheDocument();

      // Simulate touchstart
      fireEvent.touchStart(document);

      act(() => {
        vi.advanceTimersByTime(400);
      });

      expect(onDismiss).toHaveBeenCalled();
    });

    it("should dismiss on dragstart", async () => {
      const onDismiss = vi.fn();
      render(
        <TurnInstructionOverlay {...defaultProps} onDismiss={onDismiss} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText("Your Turn")).toBeInTheDocument();

      // Simulate dragstart
      fireEvent.dragStart(document);

      act(() => {
        vi.advanceTimersByTime(400);
      });

      expect(onDismiss).toHaveBeenCalled();
    });
  });

  describe("visibility transitions", () => {
    it("should hide when visible prop changes to false", async () => {
      const { rerender } = render(<TurnInstructionOverlay {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText("Your Turn")).toBeInTheDocument();

      rerender(<TurnInstructionOverlay {...defaultProps} visible={false} />);

      // Need to advance timers to process the setTimeout(0) for hiding
      act(() => {
        vi.advanceTimersByTime(10);
      });

      expect(screen.queryByText("Your Turn")).not.toBeInTheDocument();
    });

    it("should show again when visible prop changes back to true", async () => {
      const { rerender } = render(
        <TurnInstructionOverlay {...defaultProps} visible={false} />,
      );

      expect(screen.queryByText("Your Turn")).not.toBeInTheDocument();

      rerender(<TurnInstructionOverlay {...defaultProps} visible={true} />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText("Your Turn")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have overlay class", async () => {
      const { container } = render(
        <TurnInstructionOverlay {...defaultProps} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      const overlay = container.querySelector(".turn-instruction-overlay");
      expect(overlay).toBeInTheDocument();
    });

    it("should have content panel class", async () => {
      const { container } = render(
        <TurnInstructionOverlay {...defaultProps} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      const content = container.querySelector(".turn-instruction-content");
      expect(content).toBeInTheDocument();
    });

    it("should have entering animation class when visible", async () => {
      const { container } = render(
        <TurnInstructionOverlay {...defaultProps} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      const overlay = container.querySelector(".turn-instruction-overlay");
      expect(overlay).toHaveClass("entering");
    });

    it("should have all theme-aware CSS classes", async () => {
      const { container } = render(
        <TurnInstructionOverlay {...defaultProps} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Check for all theme-aware CSS classes
      expect(
        container.querySelector(".turn-instruction-header"),
      ).toBeInTheDocument();
      expect(
        container.querySelector(".turn-instruction-icon"),
      ).toBeInTheDocument();
      expect(
        container.querySelector(".turn-instruction-label"),
      ).toBeInTheDocument();
      expect(
        container.querySelector(".turn-instruction-rule"),
      ).toBeInTheDocument();
      expect(
        container.querySelector(".turn-instruction-description"),
      ).toBeInTheDocument();
      expect(
        container.querySelector(".turn-instruction-divider"),
      ).toBeInTheDocument();
      expect(
        container.querySelector(".turn-instruction-action"),
      ).toBeInTheDocument();
      expect(
        container.querySelector(".turn-instruction-dismiss"),
      ).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle null onDismiss callback", async () => {
      render(<TurnInstructionOverlay {...defaultProps} onDismiss={null} />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText("Your Turn")).toBeInTheDocument();

      // Should not throw when dismissing
      fireEvent.mouseDown(document);

      act(() => {
        vi.advanceTimersByTime(400);
      });

      // Should complete without error
    });

    it("should handle empty rule set name", async () => {
      render(<TurnInstructionOverlay {...defaultProps} ruleSetName="" />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Should use default
      expect(screen.getByText("Highest Card Wins")).toBeInTheDocument();
    });

    it("should handle undefined rule set description", async () => {
      render(
        <TurnInstructionOverlay
          {...defaultProps}
          ruleSetDescription={undefined}
        />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Should use default
      expect(
        screen.getByText("Play your highest value card to win the trick"),
      ).toBeInTheDocument();
    });

    it("should cleanup timers on unmount", async () => {
      const { unmount } = render(<TurnInstructionOverlay {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Unmount before timers complete
      unmount();

      // Advance timers - should not throw
      act(() => {
        vi.advanceTimersByTime(5000);
      });
    });

    it("should cleanup event listeners on unmount", async () => {
      const { unmount } = render(<TurnInstructionOverlay {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      unmount();

      // Should not throw when events fire after unmount
      fireEvent.mouseDown(document);
    });
  });

  describe("accessibility", () => {
    it("should contain lightbulb icon for visual indication", async () => {
      const { container } = render(
        <TurnInstructionOverlay {...defaultProps} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should have readable text contrast", async () => {
      render(<TurnInstructionOverlay {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Text elements should be present and readable
      expect(screen.getByText("Your Turn")).toBeInTheDocument();
      expect(screen.getByText("Highest Card Wins")).toBeInTheDocument();
    });

    it("should have role status for screen readers", async () => {
      const { container } = render(
        <TurnInstructionOverlay {...defaultProps} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      const overlay = container.querySelector(".turn-instruction-overlay");
      expect(overlay).toHaveAttribute("role", "status");
    });

    it("should have aria-live polite for announcements", async () => {
      const { container } = render(
        <TurnInstructionOverlay {...defaultProps} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      const overlay = container.querySelector(".turn-instruction-overlay");
      expect(overlay).toHaveAttribute("aria-live", "polite");
    });

    it("should have descriptive aria-label", async () => {
      const { container } = render(
        <TurnInstructionOverlay {...defaultProps} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      const overlay = container.querySelector(".turn-instruction-overlay");
      expect(overlay).toHaveAttribute("aria-label");
      expect(overlay.getAttribute("aria-label")).toContain("Your turn");
      expect(overlay.getAttribute("aria-label")).toContain("Highest Card Wins");
    });

    it("should hide decorative elements from screen readers", async () => {
      const { container } = render(
        <TurnInstructionOverlay {...defaultProps} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Icon should be hidden from screen readers
      const icon = container.querySelector(".turn-instruction-icon");
      expect(icon).toHaveAttribute("aria-hidden", "true");

      // Divider should be hidden
      const divider = container.querySelector(".turn-instruction-divider");
      expect(divider).toHaveAttribute("aria-hidden", "true");

      // Action icon should be hidden
      const actionIcon = container.querySelector(
        ".turn-instruction-action-icon",
      );
      expect(actionIcon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("theme compliance", () => {
    it("should use CSS classes for theme-aware styling", async () => {
      const { container } = render(
        <TurnInstructionOverlay {...defaultProps} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      // All text elements should use theme-aware CSS classes
      const label = container.querySelector(".turn-instruction-label");
      expect(label).toBeInTheDocument();

      const rule = container.querySelector(".turn-instruction-rule");
      expect(rule).toBeInTheDocument();

      const description = container.querySelector(
        ".turn-instruction-description",
      );
      expect(description).toBeInTheDocument();

      const action = container.querySelector(".turn-instruction-action");
      expect(action).toBeInTheDocument();

      const dismiss = container.querySelector(".turn-instruction-dismiss");
      expect(dismiss).toBeInTheDocument();
    });

    it("should have content panel for backdrop blur effect", async () => {
      const { container } = render(
        <TurnInstructionOverlay {...defaultProps} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      const content = container.querySelector(".turn-instruction-content");
      expect(content).toBeInTheDocument();
    });

    it("should have theme-aware divider", async () => {
      const { container } = render(
        <TurnInstructionOverlay {...defaultProps} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      const divider = container.querySelector(".turn-instruction-divider");
      expect(divider).toBeInTheDocument();
    });

    it("should have theme-aware action icon container", async () => {
      const { container } = render(
        <TurnInstructionOverlay {...defaultProps} />,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      const actionIcon = container.querySelector(
        ".turn-instruction-action-icon",
      );
      expect(actionIcon).toBeInTheDocument();
    });
  });
});
