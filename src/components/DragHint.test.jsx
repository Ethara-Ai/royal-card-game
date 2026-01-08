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
      expect(container.querySelector(".drag-hint")).not.toBeInTheDocument();
    });

    it("should not render when visible is false", () => {
      const { container } = render(<DragHint visible={false} />);
      expect(container.querySelector(".drag-hint")).not.toBeInTheDocument();
    });

    it("should render after delay when visible is true", () => {
      const { container } = render(<DragHint visible={true} />);

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
        screen.getByText("Tap a card to select it"),
      ).toBeInTheDocument();
    });
  });

  describe("visibility timing", () => {
    it("should show after 500ms delay", () => {
      const { container } = render(<DragHint visible={true} />);

      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(container.querySelector(".drag-hint")).not.toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(container.querySelector(".drag-hint")).toBeInTheDocument();
    });

    it("should be visible at 3000ms mark", () => {
      const { container } = render(<DragHint visible={true} />);

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(container.querySelector(".drag-hint")).toBeInTheDocument();
    });
  });

  describe("hasSelectedCard behavior", () => {
    it("should not render when hasSelectedCard is true", () => {
      const { container } = render(
        <DragHint visible={true} hasSelectedCard={true} />,
      );

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(container.querySelector(".drag-hint")).not.toBeInTheDocument();
    });

    it("should render when hasSelectedCard is false", () => {
      const { container } = render(
        <DragHint visible={true} hasSelectedCard={false} />,
      );

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(container.querySelector(".drag-hint")).toBeInTheDocument();
    });
  });

  describe("one-time display behavior", () => {
    it("should not show if visible becomes false before delay", () => {
      const { container, rerender } = render(<DragHint visible={true} />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      rerender(<DragHint visible={false} />);

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

  describe("icon", () => {
    it("should render an SVG icon", () => {
      const { container } = render(<DragHint visible={true} />);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should have circle elements for tap icon", () => {
      const { container } = render(<DragHint visible={true} />);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const circles = container.querySelectorAll("svg circle");
      expect(circles.length).toBe(2);
    });
  });

  describe("cleanup", () => {
    it("should cleanup timers on unmount", () => {
      const { unmount } = render(<DragHint visible={true} />);

      unmount();

      expect(() => {
        act(() => {
          vi.advanceTimersByTime(6000);
        });
      }).not.toThrow();
    });
  });
});
