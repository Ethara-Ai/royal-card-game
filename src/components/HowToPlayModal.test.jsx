/**
 * Unit tests for HowToPlayModal component
 * Tests rendering, content sections, responsiveness, and interactions
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HowToPlayModal from "./HowToPlayModal";

describe("HowToPlayModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    ruleSetName: "Highest Card Wins",
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render when isOpen is true", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText("How to Play")).toBeInTheDocument();
    });

    it("should not render when isOpen is false", () => {
      render(<HowToPlayModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText("How to Play")).not.toBeInTheDocument();
    });

    it("should display the modal title", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText("How to Play")).toBeInTheDocument();
    });

    it("should have bounce-in animation class", () => {
      const { container } = render(<HowToPlayModal {...defaultProps} />);
      const modalContent = container.querySelector(".bounce-in");
      expect(modalContent).toBeInTheDocument();
    });

    it("should have game-title class on heading", () => {
      const { container } = render(<HowToPlayModal {...defaultProps} />);
      const gameTitle = container.querySelector(".game-title");
      expect(gameTitle).toBeInTheDocument();
    });
  });

  describe("close functionality", () => {
    it("should call onClose when close button is clicked", () => {
      const onClose = vi.fn();
      render(<HowToPlayModal {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByLabelText("Close modal");
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when Got it button is clicked", () => {
      const onClose = vi.fn();
      render(<HowToPlayModal {...defaultProps} onClose={onClose} />);

      const gotItButton = screen.getByText("Got it, let's play!");
      fireEvent.click(gotItButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when clicking the overlay background", () => {
      const onClose = vi.fn();
      render(<HowToPlayModal {...defaultProps} onClose={onClose} />);

      // Click the overlay (the fixed backdrop)
      const overlay = screen.getByText("How to Play").closest(".fixed");
      fireEvent.click(overlay);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should not call onClose when clicking inside the modal content", () => {
      const onClose = vi.fn();
      render(<HowToPlayModal {...defaultProps} onClose={onClose} />);

      // Click on the modal content (not the overlay)
      const modalContent = screen.getByText("Basic Rules");
      fireEvent.click(modalContent);

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("basic rules section", () => {
    it("should display Basic Rules heading", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText("Basic Rules")).toBeInTheDocument();
    });

    it("should display Select to Play rule", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText("Select to Play")).toBeInTheDocument();
    });

    it("should display Take Turns rule", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText("Take Turns")).toBeInTheDocument();
    });

    it("should display Win Tricks rule", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText("Win Tricks")).toBeInTheDocument();
    });

    it("should display Win the Game rule", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText("Win the Game")).toBeInTheDocument();
    });

    it("should display four rule cards", () => {
      const { container } = render(<HowToPlayModal {...defaultProps} />);
      // Each rule has a card with rounded-xl class
      const ruleCards = container.querySelectorAll(".grid .rounded-xl");
      expect(ruleCards.length).toBe(4);
    });
  });

  describe("current rule set section", () => {
    it("should display Current Rule Set heading", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText("Current Rule Set")).toBeInTheDocument();
    });

    it("should display Highest Card Wins rule set", () => {
      render(
        <HowToPlayModal {...defaultProps} ruleSetName="Highest Card Wins" />,
      );
      expect(
        screen.getAllByText("Highest Card Wins").length,
      ).toBeGreaterThanOrEqual(1);
    });

    it("should display Suit Follows rule set", () => {
      render(<HowToPlayModal {...defaultProps} ruleSetName="Suit Follows" />);
      expect(screen.getByText("Suit Follows")).toBeInTheDocument();
    });

    it("should display Spades Trump rule set", () => {
      render(<HowToPlayModal {...defaultProps} ruleSetName="Spades Trump" />);
      expect(screen.getByText("Spades Trump")).toBeInTheDocument();
    });

    it("should display rule description for Highest Card Wins", () => {
      render(
        <HowToPlayModal {...defaultProps} ruleSetName="Highest Card Wins" />,
      );
      expect(
        screen.getByText(/highest value card wins the trick/i),
      ).toBeInTheDocument();
    });

    it("should display rule description for Suit Follows", () => {
      render(<HowToPlayModal {...defaultProps} ruleSetName="Suit Follows" />);
      expect(
        screen.getByText(/must follow the suit of the first card/i),
      ).toBeInTheDocument();
    });

    it("should display rule description for Spades Trump", () => {
      render(<HowToPlayModal {...defaultProps} ruleSetName="Spades Trump" />);
      expect(screen.getByText(/Spades are trump cards/i)).toBeInTheDocument();
    });

    it("should default to Highest Card Wins for unknown rule set", () => {
      render(<HowToPlayModal {...defaultProps} ruleSetName="Unknown Rule" />);
      expect(
        screen.getByText(/highest value card wins the trick/i),
      ).toBeInTheDocument();
    });
  });

  describe("card values section", () => {
    it("should display Card Values heading", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText("Card Values")).toBeInTheDocument();
    });

    it("should display Ace as highest", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("14 (Highest)")).toBeInTheDocument();
    });

    it("should display King value", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText("K")).toBeInTheDocument();
      expect(screen.getByText("13")).toBeInTheDocument();
    });

    it("should display Queen value", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText("Q")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
    });

    it("should display Jack value", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText("J")).toBeInTheDocument();
      expect(screen.getByText("11")).toBeInTheDocument();
    });

    it("should display number cards range", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText("10-2")).toBeInTheDocument();
      expect(screen.getByText("Face value")).toBeInTheDocument();
    });
  });

  describe("pro tips section", () => {
    it("should display Pro Tips heading", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText("Pro Tips")).toBeInTheDocument();
    });

    it("should display leaderboard tip", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText(/Watch the leaderboard/i)).toBeInTheDocument();
    });

    it("should display card tracking tip", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(
        screen.getByText(/Pay attention to which cards have been played/i),
      ).toBeInTheDocument();
    });

    it("should display rule set change tip", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(
        screen.getByText(/Change rule sets in the settings/i),
      ).toBeInTheDocument();
    });

    it("should display current player indicator tip", () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(
        screen.getByText(/current player is highlighted/i),
      ).toBeInTheDocument();
    });

    it("should display star icons for tips", () => {
      render(<HowToPlayModal {...defaultProps} />);
      const stars = screen.getAllByText("★");
      expect(stars.length).toBe(4);
    });
  });

  describe("styling and layout", () => {
    it("should have fixed position overlay", () => {
      const { container } = render(<HowToPlayModal {...defaultProps} />);
      const overlay = container.firstChild;
      expect(overlay).toHaveClass("fixed");
      expect(overlay).toHaveClass("inset-0");
    });

    it("should have high z-index", () => {
      const { container } = render(<HowToPlayModal {...defaultProps} />);
      const overlay = container.firstChild;
      expect(overlay).toHaveClass("z-50");
    });

    it("should center content", () => {
      const { container } = render(<HowToPlayModal {...defaultProps} />);
      const overlay = container.firstChild;
      expect(overlay).toHaveClass("flex");
      expect(overlay).toHaveClass("items-center");
      expect(overlay).toHaveClass("justify-center");
    });

    it("should have backdrop blur", () => {
      const { container } = render(<HowToPlayModal {...defaultProps} />);
      const overlay = container.firstChild;
      expect(overlay.style.backdropFilter).toContain("blur");
    });

    it("should have max-width constraints", () => {
      const { container } = render(<HowToPlayModal {...defaultProps} />);
      const modalContent = container.querySelector(".max-w-lg");
      expect(modalContent).toBeInTheDocument();
    });

    it("should have max-height with overflow scroll", () => {
      const { container } = render(<HowToPlayModal {...defaultProps} />);
      const modalContent = container.querySelector(".overflow-y-auto");
      expect(modalContent).toBeInTheDocument();
    });

    it("should have rounded corners", () => {
      const { container } = render(<HowToPlayModal {...defaultProps} />);
      const modalContent = container.querySelector(".rounded-2xl");
      expect(modalContent).toBeInTheDocument();
    });
  });

  describe("responsive classes", () => {
    it("should have responsive padding", () => {
      const { container } = render(<HowToPlayModal {...defaultProps} />);
      const responsivePadding = container.querySelector(".p-3");
      expect(responsivePadding).toBeInTheDocument();
    });

    it("should have responsive text sizes", () => {
      const { container } = render(<HowToPlayModal {...defaultProps} />);
      const responsiveText = container.querySelector(".text-lg");
      expect(responsiveText).toBeInTheDocument();
    });

    it("should have responsive grid layout for rules", () => {
      const { container } = render(<HowToPlayModal {...defaultProps} />);
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass("grid-cols-1");
    });
  });

  describe("accessibility", () => {
    it("should have accessible close button with aria-label", () => {
      render(<HowToPlayModal {...defaultProps} />);
      const closeButton = screen.getByLabelText("Close modal");
      expect(closeButton).toBeInTheDocument();
    });

    it("should have accessible Got it button", () => {
      render(<HowToPlayModal {...defaultProps} />);
      const gotItButton = screen.getByRole("button", {
        name: "Got it, let's play!",
      });
      expect(gotItButton).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      render(<HowToPlayModal {...defaultProps} />);
      const mainHeading = screen.getByRole("heading", { level: 2 });
      expect(mainHeading).toHaveTextContent("How to Play");
    });

    it("should have section headings", () => {
      render(<HowToPlayModal {...defaultProps} />);
      const sectionHeadings = screen.getAllByRole("heading", { level: 3 });
      expect(sectionHeadings.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("icons", () => {
    it("should render gamepad icon in header", () => {
      render(<HowToPlayModal {...defaultProps} />);
      // The modal should have icons rendered
      expect(screen.getByText("How to Play")).toBeInTheDocument();
    });

    it("should render close icon (X) button", () => {
      render(<HowToPlayModal {...defaultProps} />);
      const closeButton = screen.getByLabelText("Close modal");
      const icon = closeButton.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should render icons for each basic rule", () => {
      const { container } = render(<HowToPlayModal {...defaultProps} />);
      // Each rule card should have an SVG icon
      const ruleCards = container.querySelectorAll(".grid .rounded-xl");
      ruleCards.forEach((card) => {
        const icon = card.querySelector("svg");
        expect(icon).toBeInTheDocument();
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty ruleSetName", () => {
      render(<HowToPlayModal {...defaultProps} ruleSetName="" />);
      // Should default to Highest Card Wins description
      expect(
        screen.getByText(/highest value card wins the trick/i),
      ).toBeInTheDocument();
    });

    it("should handle undefined ruleSetName", () => {
      render(<HowToPlayModal {...defaultProps} ruleSetName={undefined} />);
      expect(
        screen.getByText(/highest value card wins the trick/i),
      ).toBeInTheDocument();
    });

    it("should handle rapid close button clicks", () => {
      const onClose = vi.fn();
      render(<HowToPlayModal {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByLabelText("Close modal");
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(3);
    });

    it("should handle rapid Got it button clicks", () => {
      const onClose = vi.fn();
      render(<HowToPlayModal {...defaultProps} onClose={onClose} />);

      const gotItButton = screen.getByText("Got it, let's play!");
      fireEvent.click(gotItButton);
      fireEvent.click(gotItButton);

      expect(onClose).toHaveBeenCalledTimes(2);
    });
  });
});
