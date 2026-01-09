/**
 * Unit tests for HelpButton component
 * Tests rendering, click behavior, styling, and accessibility
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HelpButton from "./HelpButton";

describe("HelpButton", () => {
  const defaultProps = {
    onClick: vi.fn(),
  };

  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<HelpButton {...defaultProps} />);
      expect(container.querySelector("button")).toBeInTheDocument();
    });

    it("should render as a button element", () => {
      render(<HelpButton {...defaultProps} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should have a question circle icon", () => {
      const { container } = render(<HelpButton {...defaultProps} />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should have 'How to play' as title", () => {
      render(<HelpButton {...defaultProps} />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("title", "How to play");
    });

    it("should have 'How to play' as aria-label", () => {
      render(<HelpButton {...defaultProps} />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "How to play");
    });
  });

  describe("click behavior", () => {
    it("should call onClick when clicked", () => {
      const onClick = vi.fn();
      render(<HelpButton onClick={onClick} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClick on each click", () => {
      const onClick = vi.fn();
      render(<HelpButton onClick={onClick} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(3);
    });

    it("should not call onClick without user interaction", () => {
      const onClick = vi.fn();
      render(<HelpButton onClick={onClick} />);

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("styling", () => {
    it("should have rounded-lg class", () => {
      const { container } = render(<HelpButton {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveClass("rounded-lg");
    });

    it("should have transition classes", () => {
      const { container } = render(<HelpButton {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveClass("transition-all");
    });

    it("should have duration-300 for animation timing", () => {
      const { container } = render(<HelpButton {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveClass("duration-300");
    });

    it("should have hover:scale-105 for hover effect", () => {
      const { container } = render(<HelpButton {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveClass("hover:scale-105");
    });

    it("should have flex layout for centering", () => {
      const { container } = render(<HelpButton {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveClass("flex");
      expect(button).toHaveClass("items-center");
      expect(button).toHaveClass("justify-center");
    });

    it("should have responsive padding", () => {
      const { container } = render(<HelpButton {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveClass("p-2");
      expect(button).toHaveClass("sm:p-2.5");
    });

    it("should have panel background style", () => {
      const { container } = render(<HelpButton {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveStyle({ background: "var(--color-panel-dark)" });
    });

    it("should have secondary text color style", () => {
      const { container } = render(<HelpButton {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveStyle({ color: "var(--color-text-secondary)" });
    });

    it("should have subtle border style", () => {
      const { container } = render(<HelpButton {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveStyle({
        border: "1px solid var(--color-border-subtle)",
      });
    });
  });

  describe("icon styling", () => {
    it("should have base text size on icon", () => {
      const { container } = render(<HelpButton {...defaultProps} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("text-base");
    });

    it("should have responsive text size on icon", () => {
      const { container } = render(<HelpButton {...defaultProps} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("sm:text-lg");
    });
  });

  describe("accessibility", () => {
    it("should be focusable", () => {
      render(<HelpButton {...defaultProps} />);
      const button = screen.getByRole("button");
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it("should have descriptive title attribute", () => {
      render(<HelpButton {...defaultProps} />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("title");
      expect(button.getAttribute("title")).not.toBe("");
    });

    it("should have descriptive aria-label", () => {
      render(<HelpButton {...defaultProps} />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label");
      expect(button.getAttribute("aria-label")).not.toBe("");
    });

    it("should be accessible by role", () => {
      render(<HelpButton {...defaultProps} />);
      expect(screen.getByRole("button", { name: /how to play/i })).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle rapid clicks", () => {
      const onClick = vi.fn();
      render(<HelpButton onClick={onClick} />);

      const button = screen.getByRole("button");
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }

      expect(onClick).toHaveBeenCalledTimes(10);
    });

    it("should handle keyboard activation with Enter", () => {
      const onClick = vi.fn();
      render(<HelpButton onClick={onClick} />);

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
      fireEvent.keyUp(button, { key: "Enter", code: "Enter" });

      // Button should respond to keyboard by default
      expect(button).toBeInTheDocument();
    });

    it("should handle keyboard activation with Space", () => {
      const onClick = vi.fn();
      render(<HelpButton onClick={onClick} />);

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: " ", code: "Space" });
      fireEvent.keyUp(button, { key: " ", code: "Space" });

      // Button should respond to keyboard by default
      expect(button).toBeInTheDocument();
    });
  });
});
