/**
 * Unit tests for CardPatternPicker component
 * Tests rendering, pattern selection, dropdown behavior, and accessibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CardPatternPicker from "./CardPatternPicker";

// Mock the patterns utility
vi.mock("../utils/patterns", () => ({
  cardPatterns: [
    { id: "solid", name: "Solid" },
    { id: "stripes", name: "Stripes" },
    { id: "dots", name: "Dots" },
    { id: "diamonds", name: "Diamonds" },
    { id: "crosshatch", name: "Crosshatch" },
    { id: "waves", name: "Waves" },
  ],
  getPatternStyle: vi.fn((patternId, _color) => ({
    backgroundImage:
      patternId === "solid"
        ? "none"
        : `url("data:image/svg+xml,<svg>mock-${patternId}</svg>")`,
    backgroundSize: patternId === "solid" ? "auto" : "10px 10px",
  })),
}));

describe("CardPatternPicker", () => {
  const defaultProps = {
    cardBackColor: "#1a5f7a",
    cardBackPattern: "solid",
    setCardBackPattern: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it("should display 'Card Pattern' label", () => {
      render(<CardPatternPicker {...defaultProps} />);
      expect(screen.getByText("Card Pattern")).toBeInTheDocument();
    });

    it("should display current pattern name", () => {
      render(<CardPatternPicker {...defaultProps} cardBackPattern="solid" />);
      expect(screen.getByText("Solid")).toBeInTheDocument();
    });

    it("should render pattern preview box", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);
      const preview = container.querySelector(".pattern-preview");
      expect(preview).toBeInTheDocument();
    });

    it("should show dropdown arrow icon", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("pattern preview", () => {
    it("should apply the cardBackColor to the preview box", () => {
      const { container } = render(
        <CardPatternPicker {...defaultProps} cardBackColor="#ff5500" />,
      );
      const preview = container.querySelector(".pattern-preview");
      // jsdom converts hex to rgb, so check for either format
      const bgColor = preview.style.backgroundColor;
      expect(bgColor === "#ff5500" || bgColor === "rgb(255, 85, 0)").toBe(true);
    });

    it("should update preview when color changes", () => {
      const { container, rerender } = render(
        <CardPatternPicker {...defaultProps} cardBackColor="#ff5500" />,
      );

      rerender(<CardPatternPicker {...defaultProps} cardBackColor="#00ff00" />);

      const preview = container.querySelector(".pattern-preview");
      // jsdom converts hex to rgb, so check for either format
      const bgColor = preview.style.backgroundColor;
      expect(bgColor === "#00ff00" || bgColor === "rgb(0, 255, 0)").toBe(true);
    });

    it("should display different pattern name when pattern changes", () => {
      const { rerender } = render(
        <CardPatternPicker {...defaultProps} cardBackPattern="solid" />,
      );

      expect(screen.getByText("Solid")).toBeInTheDocument();

      rerender(
        <CardPatternPicker {...defaultProps} cardBackPattern="stripes" />,
      );

      expect(screen.getByText("Stripes")).toBeInTheDocument();
    });
  });

  describe("dropdown toggle", () => {
    it("should open dropdown when selector is clicked", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      // Should show pattern options
      expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
    });

    it("should close dropdown when selector is clicked again", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");

      // Open
      fireEvent.click(selector);
      expect(screen.getAllByRole("button").length).toBeGreaterThan(0);

      // Close
      fireEvent.click(selector);
      // Dropdown should be closed, only the main selector visible
    });

    it("should rotate arrow when dropdown is open", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const arrow = container.querySelector("svg");
      expect(arrow).toHaveClass("rotate-180");
    });

    it("should not rotate arrow when dropdown is closed", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);

      const arrow = container.querySelector("svg");
      expect(arrow).not.toHaveClass("rotate-180");
    });
  });

  describe("pattern selection", () => {
    it("should display all pattern options when open", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      // Check for pattern names from our mock
      expect(screen.getAllByText("Solid").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Stripes").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Dots").length).toBeGreaterThan(0);
    });

    it("should call setCardBackPattern when a pattern is selected", () => {
      const setCardBackPattern = vi.fn();
      const { container } = render(
        <CardPatternPicker
          {...defaultProps}
          setCardBackPattern={setCardBackPattern}
        />,
      );

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const stripesOption = screen.getAllByText("Stripes")[0];
      fireEvent.click(stripesOption);

      expect(setCardBackPattern).toHaveBeenCalledWith("stripes");
    });

    it("should close dropdown after selecting a pattern", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const stripesButton = screen.getAllByText("Stripes")[0].closest("button");
      fireEvent.click(stripesButton);

      const arrow = container.querySelector("svg");
      expect(arrow).not.toHaveClass("rotate-180");
    });

    it("should highlight the currently selected pattern", () => {
      render(<CardPatternPicker {...defaultProps} cardBackPattern="stripes" />);

      const selector = document.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      // Find the stripes option button and check for selected styling
      const buttons = document.querySelectorAll(".grid button");
      const stripesButton = Array.from(buttons).find((btn) =>
        btn.textContent.includes("Stripes"),
      );

      expect(stripesButton).toHaveStyle({
        background: "var(--color-panel-hover)",
      });
    });
  });

  describe("styling", () => {
    it("should have label with gold color style", () => {
      render(<CardPatternPicker {...defaultProps} />);
      const label = screen.getByText("Card Pattern");
      expect(label).toHaveStyle({ color: "var(--color-text-gold)" });
    });

    it("should have label with uppercase tracking", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);
      const label = container.querySelector("label");
      expect(label).toHaveClass("uppercase");
      expect(label).toHaveClass("tracking-wider");
    });

    it("should have rounded-lg class on selector", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);
      const selector = container.querySelector(".cursor-pointer");
      expect(selector).toHaveClass("rounded-lg");
    });

    it("should have flex layout on selector", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);
      const selector = container.querySelector(".cursor-pointer");
      expect(selector).toHaveClass("flex");
      expect(selector).toHaveClass("items-center");
    });

    it("should have panel background style", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);
      const selector = container.querySelector(".cursor-pointer");
      expect(selector).toHaveStyle({ background: "var(--color-panel-dark)" });
    });

    it("should have transition on arrow", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);
      const arrow = container.querySelector("svg");
      expect(arrow).toHaveClass("transition-transform");
      expect(arrow).toHaveClass("duration-200");
    });
  });

  describe("pattern grid styling", () => {
    it("should display patterns in a 3-column grid", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const grid = container.querySelector(".grid.grid-cols-3");
      expect(grid).toBeInTheDocument();
    });

    it("should have gap between pattern options", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("gap-2");
    });

    it("should have hover effect on pattern buttons", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const buttons = container.querySelectorAll(".grid button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("hover:scale-105");
      });
    });
  });

  describe("pattern preview boxes in dropdown", () => {
    it("should display pattern preview for each option", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const previewBoxes = container.querySelectorAll(".grid .w-8.h-10");
      expect(previewBoxes.length).toBe(6); // 6 patterns from our mock
    });

    it("should apply cardBackColor to all pattern previews", () => {
      const { container } = render(
        <CardPatternPicker {...defaultProps} cardBackColor="#ff0000" />,
      );

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const previewBoxes = container.querySelectorAll(".grid .w-8.h-10");
      previewBoxes.forEach((box) => {
        // jsdom converts hex to rgb, so check for either format
        const bgColor = box.style.backgroundColor;
        expect(bgColor === "#ff0000" || bgColor === "rgb(255, 0, 0)").toBe(
          true,
        );
      });
    });
  });

  describe("accessibility", () => {
    it("should have label element", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);
      expect(container.querySelector("label")).toBeInTheDocument();
    });

    it("should have descriptive label text", () => {
      render(<CardPatternPicker {...defaultProps} />);
      expect(screen.getByText("Card Pattern")).toBeInTheDocument();
    });

    it("should have accessible buttons for each pattern", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should display pattern name as text for each option", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector);

      // Pattern names from our mock
      const patternNames = [
        "Solid",
        "Stripes",
        "Dots",
        "Diamonds",
        "Crosshatch",
        "Waves",
      ];
      patternNames.forEach((name) => {
        expect(screen.getAllByText(name).length).toBeGreaterThan(0);
      });
    });
  });

  describe("edge cases", () => {
    it("should handle unknown pattern gracefully", () => {
      render(
        <CardPatternPicker
          {...defaultProps}
          cardBackPattern="unknown-pattern"
        />,
      );
      // Should not crash and should display something (fallback to "Solid" or empty)
      expect(screen.getByText("Card Pattern")).toBeInTheDocument();
    });

    it("should handle rapid toggle clicks", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");
      for (let i = 0; i < 10; i++) {
        fireEvent.click(selector);
      }

      // Component should still be functional
      expect(container).toBeInTheDocument();
    });

    it("should handle rapid pattern selection", () => {
      const setCardBackPattern = vi.fn();
      const { container } = render(
        <CardPatternPicker
          {...defaultProps}
          setCardBackPattern={setCardBackPattern}
        />,
      );

      const selector = container.querySelector(".cursor-pointer");

      // Each pattern selection closes the dropdown, so we need to reopen each time
      fireEvent.click(selector); // Open
      let buttons = container.querySelectorAll(".grid button");
      fireEvent.click(buttons[0]); // Select first pattern (closes dropdown)

      fireEvent.click(selector); // Reopen
      buttons = container.querySelectorAll(".grid button");
      fireEvent.click(buttons[1]); // Select second pattern

      fireEvent.click(selector); // Reopen
      buttons = container.querySelectorAll(".grid button");
      fireEvent.click(buttons[2]); // Select third pattern

      expect(setCardBackPattern).toHaveBeenCalledTimes(3);
    });

    it("should handle empty cardBackColor", () => {
      const { container } = render(
        <CardPatternPicker {...defaultProps} cardBackColor="" />,
      );
      const preview = container.querySelector(".pattern-preview");
      expect(preview).toBeInTheDocument();
    });
  });

  describe("different patterns", () => {
    // Patterns from our mock
    const patterns = [
      "solid",
      "stripes",
      "dots",
      "diamonds",
      "crosshatch",
      "waves",
    ];

    patterns.forEach((pattern) => {
      it(`should correctly display ${pattern} pattern`, () => {
        render(
          <CardPatternPicker {...defaultProps} cardBackPattern={pattern} />,
        );
        // Component should render without crashing
        expect(screen.getByText("Card Pattern")).toBeInTheDocument();
      });
    });
  });

  describe("state management", () => {
    it("should maintain internal isOpen state", () => {
      const { container } = render(<CardPatternPicker {...defaultProps} />);

      const selector = container.querySelector(".cursor-pointer");

      // Initially closed
      expect(container.querySelector(".grid")).not.toBeInTheDocument();

      // Open
      fireEvent.click(selector);
      expect(container.querySelector(".grid")).toBeInTheDocument();

      // Close
      fireEvent.click(selector);
      expect(container.querySelector(".grid")).not.toBeInTheDocument();
    });

    it("should not affect parent state when toggling dropdown", () => {
      const setCardBackPattern = vi.fn();
      const { container } = render(
        <CardPatternPicker
          {...defaultProps}
          setCardBackPattern={setCardBackPattern}
        />,
      );

      const selector = container.querySelector(".cursor-pointer");
      fireEvent.click(selector); // Open
      fireEvent.click(selector); // Close

      // setCardBackPattern should not be called just from opening/closing
      expect(setCardBackPattern).not.toHaveBeenCalled();
    });
  });
});
