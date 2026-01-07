/**
 * Unit tests for DragHint component
 * Tests visibility, styling, and content
 */

import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import DragHint from "./DragHint";

describe("DragHint", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("should not render initially when visible is true", () => {
      const { container } = render(<DragHint visible={true} />);
      // Initially not visible due to delay
      expect(container.querySelector(".drag-hint")).not.toBeInTheDocument();
    });

    it("should not render when visible is false", () => {
      const { container } = render(<DragHint visible={false} />);
      expect(container.querySelector(".drag-hint")).not.toBeInTheDocument();
    });

    it("should render after delay when visible is true", () => {
      const { container } = render(<DragHint visible={true} />);

      // Fast-forward past the show timer (500ms)
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(container.querySelector(".drag-hint")).toBeInTheDocument();
    });

    it("should display hint text", () => {
      render(<DragHint visible={true} />);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(
        screen.getByText("Drag a card to the play area"),
      ).toBeInTheDocument();
    });
  });

  describe("visibility timing", () => {
    it("should show after 500ms delay", () => {
      const { container } = render(<DragHint visible={true} />);

      // Before delay
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(container.querySelector(".drag-hint")).not.toBeInTheDocument();

      // After delay
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(container.querySelector(".drag-hint")).toBeInTheDocument();
    });

    it("should be visible at 3000ms mark", () => {
      const { container } = render(<DragHint visible={true} />);

      // At 3000ms - should be visible (between 500ms show and 5000ms hide)
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(container.querySelector(".drag-hint")).toBeInTheDocument();
    });
  });

  describe("one-time display behavior", () => {
    it("should not show if visible becomes false before delay", () => {
      const { container, rerender } = render(<DragHint visible={true} />);

      // Wait less than delay
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Set visible to false - this triggers cleanup which clears the timers
      rerender(<DragHint visible={false} />);

      // Wait past what would be the delay
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(container.querySelector(".drag-hint")).not.toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have correct positioning styles", () => {
      const { container } = render(<DragHint visible={true} />);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const hintElement = container.querySelector(".drag-hint");
      expect(hintElement.style.position).toBe("absolute");
      expect(hintElement.style.left).toBe("50%");
      expect(hintElement.style.zIndex).toBe("20");
    });

    it("should have pointer-events none", () => {
      const { container } = render(<DragHint visible={true} />);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const hintElement = container.querySelector(".drag-hint");
      expect(hintElement.style.pointerEvents).toBe("none");
    });
  });

  describe("arrow icon", () => {
    it("should render an SVG arrow", () => {
      const { container } = render(<DragHint visible={true} />);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should have correct arrow path", () => {
      const { container } = render(<DragHint visible={true} />);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const path = container.querySelector("svg path");
      expect(path).toBeInTheDocument();
      expect(path.getAttribute("d")).toContain("M12 4");
    });
  });

  describe("cleanup", () => {
    it("should cleanup timers on unmount", () => {
      const { unmount } = render(<DragHint visible={true} />);

      // Unmount before timers fire
      unmount();

      // Advance time past all timers - should not throw
      expect(() => {
        act(() => {
          vi.advanceTimersByTime(6000);
        });
      }).not.toThrow();
    });
  });
});
