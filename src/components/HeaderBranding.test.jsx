/**
 * Unit tests for HeaderBranding component
 * Tests rendering, click behavior, styling, and accessibility
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HeaderBranding from "./HeaderBranding";

describe("HeaderBranding", () => {
  const defaultProps = {
    onReset: vi.fn(),
  };

  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      expect(container.querySelector("h1")).toBeInTheDocument();
    });

    it("should render as an h1 heading element", () => {
      render(<HeaderBranding {...defaultProps} />);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("should display 'Royal Card Game' title text", () => {
      render(<HeaderBranding {...defaultProps} />);
      expect(screen.getByText("Royal Card Game")).toBeInTheDocument();
    });

    it("should have a crown icon", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should have 'Return to home' as title tooltip", () => {
      render(<HeaderBranding {...defaultProps} />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveAttribute("title", "Return to home");
    });
  });

  describe("click behavior", () => {
    it("should call onReset when clicked", () => {
      const onReset = vi.fn();
      render(<HeaderBranding onReset={onReset} />);

      const heading = screen.getByRole("heading");
      fireEvent.click(heading);

      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it("should call onReset on each click", () => {
      const onReset = vi.fn();
      render(<HeaderBranding onReset={onReset} />);

      const heading = screen.getByRole("heading");
      fireEvent.click(heading);
      fireEvent.click(heading);
      fireEvent.click(heading);

      expect(onReset).toHaveBeenCalledTimes(3);
    });

    it("should not call onReset without user interaction", () => {
      const onReset = vi.fn();
      render(<HeaderBranding onReset={onReset} />);

      expect(onReset).not.toHaveBeenCalled();
    });

    it("should call onReset when clicking the crown icon", () => {
      const onReset = vi.fn();
      const { container } = render(<HeaderBranding onReset={onReset} />);

      const svg = container.querySelector("svg");
      fireEvent.click(svg);

      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it("should call onReset when clicking the text", () => {
      const onReset = vi.fn();
      render(<HeaderBranding onReset={onReset} />);

      const text = screen.getByText("Royal Card Game");
      fireEvent.click(text);

      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe("styling", () => {
    it("should have game-title class", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const heading = container.querySelector("h1");
      expect(heading).toHaveClass("game-title");
    });

    it("should have cursor-pointer class for clickability", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const heading = container.querySelector("h1");
      expect(heading).toHaveClass("cursor-pointer");
    });

    it("should have transition classes", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const heading = container.querySelector("h1");
      expect(heading).toHaveClass("transition-all");
    });

    it("should have duration-300 for animation timing", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const heading = container.querySelector("h1");
      expect(heading).toHaveClass("duration-300");
    });

    it("should have hover:scale-105 for hover effect", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const heading = container.querySelector("h1");
      expect(heading).toHaveClass("hover:scale-105");
    });

    it("should have flex layout", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const heading = container.querySelector("h1");
      expect(heading).toHaveClass("flex");
      expect(heading).toHaveClass("items-center");
    });

    it("should have responsive gap classes", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const heading = container.querySelector("h1");
      expect(heading).toHaveClass("gap-2");
      expect(heading).toHaveClass("sm:gap-3");
    });

    it("should have responsive text size classes", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const heading = container.querySelector("h1");
      expect(heading).toHaveClass("text-lg");
      expect(heading).toHaveClass("md:text-2xl");
    });

    it("should have shrink class for responsive behavior", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const heading = container.querySelector("h1");
      expect(heading).toHaveClass("shrink");
    });

    it("should have min-w-0 for text truncation support", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const heading = container.querySelector("h1");
      expect(heading).toHaveClass("min-w-0");
    });
  });

  describe("crown icon styling", () => {
    it("should have header-crown class", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("header-crown");
    });

    it("should have base text size", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("text-base");
    });

    it("should have responsive text sizes", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("sm:text-lg");
      expect(svg).toHaveClass("md:text-xl");
    });

    it("should have gold color style", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveStyle({ color: "var(--color-gold-light)" });
    });
  });

  describe("title text styling", () => {
    it("should have gold-text class on title span", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const textSpan = container.querySelector(".gold-text");
      expect(textSpan).toBeInTheDocument();
    });

    it("should contain correct text in gold-text span", () => {
      const { container } = render(<HeaderBranding {...defaultProps} />);
      const textSpan = container.querySelector(".gold-text");
      expect(textSpan).toHaveTextContent("Royal Card Game");
    });
  });

  describe("accessibility", () => {
    it("should have heading role", () => {
      render(<HeaderBranding {...defaultProps} />);
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });

    it("should be level 1 heading", () => {
      render(<HeaderBranding {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("should have descriptive title attribute", () => {
      render(<HeaderBranding {...defaultProps} />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveAttribute("title");
      expect(heading.getAttribute("title")).not.toBe("");
    });

    it("should be accessible by text content", () => {
      render(<HeaderBranding {...defaultProps} />);
      expect(
        screen.getByRole("heading", { name: /royal card game/i }),
      ).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle rapid clicks", () => {
      const onReset = vi.fn();
      render(<HeaderBranding onReset={onReset} />);

      const heading = screen.getByRole("heading");
      for (let i = 0; i < 10; i++) {
        fireEvent.click(heading);
      }

      expect(onReset).toHaveBeenCalledTimes(10);
    });

    it("should handle double click", () => {
      const onReset = vi.fn();
      render(<HeaderBranding onReset={onReset} />);

      const heading = screen.getByRole("heading");
      // Fire two separate clicks to simulate double-clicking behavior
      fireEvent.click(heading);
      fireEvent.click(heading);

      expect(onReset).toHaveBeenCalledTimes(2);
    });

    it("should call onReset when clicked even with complex callbacks", () => {
      const onReset = vi.fn();
      render(<HeaderBranding onReset={onReset} />);

      const heading = screen.getByRole("heading");
      fireEvent.click(heading);

      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });
});
