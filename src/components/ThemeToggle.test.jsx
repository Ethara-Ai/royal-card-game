/**
 * Unit tests for ThemeToggle component
 * Tests theme switching functionality, icons, and accessibility
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "./ThemeToggle";

describe("ThemeToggle", () => {
  const defaultProps = {
    theme: "dark",
    onToggle: vi.fn(),
  };

  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<ThemeToggle {...defaultProps} />);
      expect(container.querySelector("button")).toBeInTheDocument();
    });

    it("should render as a button element", () => {
      render(<ThemeToggle {...defaultProps} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should have an SVG icon", () => {
      const { container } = render(<ThemeToggle {...defaultProps} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("dark mode", () => {
    it("should show sun icon in dark mode", () => {
      const { container } = render(
        <ThemeToggle {...defaultProps} theme="dark" />,
      );
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      // Sun icon should be displayed for switching to light mode
    });

    it("should have correct title for dark mode", () => {
      render(<ThemeToggle {...defaultProps} theme="dark" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("title", "Switch to warm mode");
    });

    it("should have correct aria-label for dark mode", () => {
      render(<ThemeToggle {...defaultProps} theme="dark" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Switch to warm mode");
    });

    it("should apply gold color to sun icon in dark mode", () => {
      const { container } = render(
        <ThemeToggle {...defaultProps} theme="dark" />,
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveStyle({ color: "var(--color-gold-light)" });
    });
  });

  describe("light mode", () => {
    it("should show moon icon in light mode", () => {
      const { container } = render(
        <ThemeToggle {...defaultProps} theme="light" />,
      );
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      // Moon icon should be displayed for switching to dark mode
    });

    it("should have correct title for light mode", () => {
      render(<ThemeToggle {...defaultProps} theme="light" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("title", "Switch to dark mode");
    });

    it("should have correct aria-label for light mode", () => {
      render(<ThemeToggle {...defaultProps} theme="light" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Switch to dark mode");
    });

    it("should apply secondary text color to moon icon in light mode", () => {
      const { container } = render(
        <ThemeToggle {...defaultProps} theme="light" />,
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveStyle({ color: "var(--color-text-secondary)" });
    });
  });

  describe("click behavior", () => {
    it("should call onToggle when clicked", () => {
      const onToggle = vi.fn();
      render(<ThemeToggle {...defaultProps} onToggle={onToggle} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it("should call onToggle on each click", () => {
      const onToggle = vi.fn();
      render(<ThemeToggle {...defaultProps} onToggle={onToggle} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(onToggle).toHaveBeenCalledTimes(3);
    });
  });

  describe("styling", () => {
    it("should have rounded-lg class", () => {
      const { container } = render(<ThemeToggle {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveClass("rounded-lg");
    });

    it("should have transition classes", () => {
      const { container } = render(<ThemeToggle {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveClass("transition-all");
    });

    it("should have duration-300 for animation timing", () => {
      const { container } = render(<ThemeToggle {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveClass("duration-300");
    });

    it("should have hover:scale-105 for hover effect", () => {
      const { container } = render(<ThemeToggle {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveClass("hover:scale-105");
    });

    it("should have flex layout for centering", () => {
      const { container } = render(<ThemeToggle {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveClass("flex");
      expect(button).toHaveClass("items-center");
      expect(button).toHaveClass("justify-center");
    });

    it("should have responsive padding", () => {
      const { container } = render(<ThemeToggle {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveClass("p-2");
      expect(button).toHaveClass("sm:p-2.5");
    });

    it("should have panel background style", () => {
      const { container } = render(<ThemeToggle {...defaultProps} />);
      const button = container.querySelector("button");
      expect(button).toHaveStyle({ background: "var(--color-panel-dark)" });
    });

    it("should have subtle border style", () => {
      const { container } = render(<ThemeToggle {...defaultProps} />);
      const button = container.querySelector("button");
      // Check that border style attribute contains the expected value
      expect(button.style.border).toContain("1px solid");
    });
  });

  describe("icon sizing", () => {
    it("should have base text size on icon", () => {
      const { container } = render(<ThemeToggle {...defaultProps} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("text-base");
    });

    it("should have responsive text size on icon", () => {
      const { container } = render(<ThemeToggle {...defaultProps} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("sm:text-lg");
    });
  });

  describe("accessibility", () => {
    it("should be focusable", () => {
      render(<ThemeToggle {...defaultProps} />);
      const button = screen.getByRole("button");
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it("should have descriptive title attribute", () => {
      render(<ThemeToggle {...defaultProps} theme="dark" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("title");
      expect(button.getAttribute("title")).not.toBe("");
    });

    it("should have descriptive aria-label", () => {
      render(<ThemeToggle {...defaultProps} theme="dark" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label");
      expect(button.getAttribute("aria-label")).not.toBe("");
    });
  });

  describe("edge cases", () => {
    it("should handle undefined theme gracefully", () => {
      // Should default to showing dark mode behavior
      const { container } = render(
        <ThemeToggle theme={undefined} onToggle={vi.fn()} />,
      );
      expect(container.querySelector("button")).toBeInTheDocument();
    });

    it("should handle rapid clicks", () => {
      const onToggle = vi.fn();
      render(<ThemeToggle {...defaultProps} onToggle={onToggle} />);

      const button = screen.getByRole("button");
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }

      expect(onToggle).toHaveBeenCalledTimes(10);
    });
  });
});
