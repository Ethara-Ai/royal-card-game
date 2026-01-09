/**
 * Unit tests for CardColorPicker component
 * Tests rendering, color selection, dropdown behavior, and accessibility
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CardColorPicker from "./CardColorPicker";

// Mock react-colorful since it's an external library
vi.mock("react-colorful", () => ({
  HexColorPicker: ({ color, onChange, style: _style }) => (
    <div
      data-testid="hex-color-picker"
      data-color={color}
      onClick={() => onChange && onChange("#ff0000")}
    >
      Mock Color Picker
    </div>
  ),
}));

describe("CardColorPicker", () => {
  const defaultProps = {
    color: "#1a5f7a",
    onChange: vi.fn(),
    isOpen: false,
    onToggle: vi.fn(),
  };

  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<CardColorPicker {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it("should display 'Card Back Color' label", () => {
      render(<CardColorPicker {...defaultProps} />);
      expect(screen.getByText("Card Back Color")).toBeInTheDocument();
    });

    it("should display color in uppercase", () => {
      render(<CardColorPicker {...defaultProps} color="#1a5f7a" />);
      expect(screen.getByText("#1A5F7A")).toBeInTheDocument();
    });

    it("should render color preview box", () => {
      const { container } = render(<CardColorPicker {...defaultProps} />);
      const colorPreview = container.querySelector(".w-5.h-5");
      expect(colorPreview).toBeInTheDocument();
    });

    it("should show dropdown arrow icon", () => {
      const { container } = render(<CardColorPicker {...defaultProps} />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("color preview", () => {
    it("should apply the color to the preview box", () => {
      const { container } = render(
        <CardColorPicker {...defaultProps} color="#ff5500" />,
      );
      const colorPreview = container.querySelector(".w-5.h-5");
      // jsdom converts hex to rgb, so check for either format
      const bgColor = colorPreview.style.backgroundColor;
      expect(bgColor === "#ff5500" || bgColor === "rgb(255, 85, 0)").toBe(true);
    });

    it("should update preview when color changes", () => {
      const { container, rerender } = render(
        <CardColorPicker {...defaultProps} color="#ff5500" />,
      );

      rerender(<CardColorPicker {...defaultProps} color="#00ff00" />);

      const colorPreview = container.querySelector(".w-5.h-5");
      // jsdom converts hex to rgb, so check for either format
      const bgColor = colorPreview.style.backgroundColor;
      expect(bgColor === "#00ff00" || bgColor === "rgb(0, 255, 0)").toBe(true);
    });

    it("should display updated color text when color changes", () => {
      const { rerender } = render(
        <CardColorPicker {...defaultProps} color="#ff5500" />,
      );

      expect(screen.getByText("#FF5500")).toBeInTheDocument();

      rerender(<CardColorPicker {...defaultProps} color="#00ff00" />);

      expect(screen.getByText("#00FF00")).toBeInTheDocument();
    });
  });

  describe("click behavior", () => {
    it("should call onToggle when color selector is clicked", () => {
      const onToggle = vi.fn();
      const { container } = render(
        <CardColorPicker {...defaultProps} onToggle={onToggle} />,
      );

      const clickableArea = container.querySelector(".cursor-pointer");
      fireEvent.click(clickableArea);

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it("should call onToggle on each click", () => {
      const onToggle = vi.fn();
      const { container } = render(
        <CardColorPicker {...defaultProps} onToggle={onToggle} />,
      );

      const clickableArea = container.querySelector(".cursor-pointer");
      fireEvent.click(clickableArea);
      fireEvent.click(clickableArea);
      fireEvent.click(clickableArea);

      expect(onToggle).toHaveBeenCalledTimes(3);
    });
  });

  describe("dropdown state", () => {
    it("should not show color picker when isOpen is false", () => {
      render(<CardColorPicker {...defaultProps} isOpen={false} />);
      expect(screen.queryByTestId("hex-color-picker")).not.toBeInTheDocument();
    });

    it("should show color picker when isOpen is true", () => {
      render(<CardColorPicker {...defaultProps} isOpen={true} />);
      expect(screen.getByTestId("hex-color-picker")).toBeInTheDocument();
    });

    it("should rotate arrow when isOpen is true", () => {
      const { container } = render(
        <CardColorPicker {...defaultProps} isOpen={true} />,
      );
      const arrow = container.querySelector("svg");
      expect(arrow).toHaveClass("rotate-180");
    });

    it("should not rotate arrow when isOpen is false", () => {
      const { container } = render(
        <CardColorPicker {...defaultProps} isOpen={false} />,
      );
      const arrow = container.querySelector("svg");
      expect(arrow).not.toHaveClass("rotate-180");
    });
  });

  describe("color picker interaction", () => {
    it("should call onChange when color is selected", () => {
      const onChange = vi.fn();
      render(
        <CardColorPicker {...defaultProps} isOpen={true} onChange={onChange} />,
      );

      const colorPicker = screen.getByTestId("hex-color-picker");
      fireEvent.click(colorPicker);

      expect(onChange).toHaveBeenCalledWith("#ff0000");
    });

    it("should pass current color to color picker", () => {
      render(
        <CardColorPicker {...defaultProps} isOpen={true} color="#abcdef" />,
      );

      const colorPicker = screen.getByTestId("hex-color-picker");
      expect(colorPicker).toHaveAttribute("data-color", "#abcdef");
    });
  });

  describe("styling", () => {
    it("should have label with gold color style", () => {
      render(<CardColorPicker {...defaultProps} />);
      const label = screen.getByText("Card Back Color");
      expect(label).toHaveStyle({ color: "var(--color-text-gold)" });
    });

    it("should have label with uppercase tracking", () => {
      const { container } = render(<CardColorPicker {...defaultProps} />);
      const label = container.querySelector("label");
      expect(label).toHaveClass("uppercase");
      expect(label).toHaveClass("tracking-wider");
    });

    it("should have rounded-lg class on selector", () => {
      const { container } = render(<CardColorPicker {...defaultProps} />);
      const selector = container.querySelector(".cursor-pointer");
      expect(selector).toHaveClass("rounded-lg");
    });

    it("should have flex layout on selector", () => {
      const { container } = render(<CardColorPicker {...defaultProps} />);
      const selector = container.querySelector(".cursor-pointer");
      expect(selector).toHaveClass("flex");
      expect(selector).toHaveClass("items-center");
    });

    it("should have panel background style", () => {
      const { container } = render(<CardColorPicker {...defaultProps} />);
      const selector = container.querySelector(".cursor-pointer");
      expect(selector).toHaveStyle({ background: "var(--color-panel-dark)" });
    });

    it("should have color preview with border", () => {
      const { container } = render(<CardColorPicker {...defaultProps} />);
      const colorPreview = container.querySelector(".w-5.h-5");
      // Check that border style attribute contains the expected value
      expect(colorPreview.style.border).toContain("2px solid");
    });

    it("should have transition on arrow", () => {
      const { container } = render(<CardColorPicker {...defaultProps} />);
      const arrow = container.querySelector("svg");
      expect(arrow).toHaveClass("transition-transform");
      expect(arrow).toHaveClass("duration-200");
    });
  });

  describe("color picker container styling", () => {
    it("should have margin-top when open", () => {
      const { container } = render(
        <CardColorPicker {...defaultProps} isOpen={true} />,
      );
      const pickerContainer = container.querySelector(".mt-2");
      expect(pickerContainer).toBeInTheDocument();
    });

    it("should have rounded-lg class when open", () => {
      render(<CardColorPicker {...defaultProps} isOpen={true} />);
      const pickerContainer = screen
        .getByTestId("hex-color-picker")
        .closest(".rounded-lg");
      expect(pickerContainer).toBeInTheDocument();
    });

    it("should have padding when open", () => {
      const { container } = render(
        <CardColorPicker {...defaultProps} isOpen={true} />,
      );
      const pickerContainer = container.querySelector(".mt-2.p-2");
      expect(pickerContainer).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have label element", () => {
      const { container } = render(<CardColorPicker {...defaultProps} />);
      expect(container.querySelector("label")).toBeInTheDocument();
    });

    it("should have descriptive label text", () => {
      render(<CardColorPicker {...defaultProps} />);
      expect(screen.getByText("Card Back Color")).toBeInTheDocument();
    });

    it("should display readable color value", () => {
      render(<CardColorPicker {...defaultProps} color="#abc123" />);
      expect(screen.getByText("#ABC123")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle lowercase hex colors", () => {
      render(<CardColorPicker {...defaultProps} color="#abcdef" />);
      expect(screen.getByText("#ABCDEF")).toBeInTheDocument();
    });

    it("should handle uppercase hex colors", () => {
      render(<CardColorPicker {...defaultProps} color="#ABCDEF" />);
      expect(screen.getByText("#ABCDEF")).toBeInTheDocument();
    });

    it("should handle mixed case hex colors", () => {
      render(<CardColorPicker {...defaultProps} color="#AbCdEf" />);
      expect(screen.getByText("#ABCDEF")).toBeInTheDocument();
    });

    it("should handle rapid toggle clicks", () => {
      const onToggle = vi.fn();
      const { container } = render(
        <CardColorPicker {...defaultProps} onToggle={onToggle} />,
      );

      const clickableArea = container.querySelector(".cursor-pointer");
      for (let i = 0; i < 10; i++) {
        fireEvent.click(clickableArea);
      }

      expect(onToggle).toHaveBeenCalledTimes(10);
    });

    it("should handle short hex colors (#fff)", () => {
      render(<CardColorPicker {...defaultProps} color="#fff" />);
      expect(screen.getByText("#FFF")).toBeInTheDocument();
    });
  });

  describe("different colors", () => {
    const testColors = [
      { input: "#000000", display: "#000000" },
      { input: "#ffffff", display: "#FFFFFF" },
      { input: "#ff0000", display: "#FF0000" },
      { input: "#00ff00", display: "#00FF00" },
      { input: "#0000ff", display: "#0000FF" },
      { input: "#123abc", display: "#123ABC" },
    ];

    testColors.forEach(({ input, display }) => {
      it(`should correctly display ${input} as ${display}`, () => {
        render(<CardColorPicker {...defaultProps} color={input} />);
        expect(screen.getByText(display)).toBeInTheDocument();
      });
    });
  });
});
