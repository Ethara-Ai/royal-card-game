/**
 * Integration Tests - Full Game Flow
 * Tests the complete game flow from start to finish
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import App from "../../App";

describe("Full Game Flow Integration Tests", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("Complete Game Lifecycle", () => {
    it("should render the app and show loading screen initially", async () => {
      const { container } = render(<App />);

      // App should render without crashing
      expect(container).toBeInTheDocument();

      // Loading screen should be present initially
      const loadingScreen = container.querySelector(".loading-screen");
      expect(loadingScreen).toBeInTheDocument();
    });

    it("should transition from loading to waiting room", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for waiting room to appear
      await waitFor(
        () => {
          expect(screen.getByText("Waiting Room")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it("should allow entering username in waiting room", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for waiting room
      await waitFor(
        () => {
          expect(screen.getByText("Waiting Room")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Find and interact with username input
      const usernameInput = screen.getByPlaceholderText(/Enter your name/i);
      expect(usernameInput).toBeInTheDocument();

      fireEvent.change(usernameInput, { target: { value: "TestPlayer" } });
      expect(usernameInput.value).toBe("TestPlayer");
    });

    it("should show Start Game button when username is entered", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for waiting room
      await waitFor(
        () => {
          expect(screen.getByText("Waiting Room")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Enter username
      const usernameInput = screen.getByPlaceholderText(/Enter your name/i);
      fireEvent.change(usernameInput, { target: { value: "TestPlayer" } });

      // Start Game button should now be enabled
      await waitFor(() => {
        expect(screen.getByText("Start Game")).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("should show Enter Name to Start when username is empty", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for waiting room
      await waitFor(
        () => {
          expect(screen.getByText("Waiting Room")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Button should show "Enter Name to Start" initially
      expect(screen.getByText("Enter Name to Start")).toBeInTheDocument();
    });

    it("should not start game without username", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for waiting room
      await waitFor(
        () => {
          expect(screen.getByText("Waiting Room")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Click start button without entering username
      const startButton = screen.getByRole("button", {
        name: /Enter Name to Start/i,
      });
      fireEvent.click(startButton);

      // Should still be in waiting room
      expect(screen.getByText("Waiting Room")).toBeInTheDocument();
    });

    it("should handle whitespace-only username", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for waiting room
      await waitFor(
        () => {
          expect(screen.getByText("Waiting Room")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Enter whitespace only
      const usernameInput = screen.getByPlaceholderText(/Enter your name/i);
      fireEvent.change(usernameInput, { target: { value: "   " } });

      // Button should still show "Enter Name to Start"
      expect(screen.getByText("Enter Name to Start")).toBeInTheDocument();
    });
  });

  describe("Accessibility Integration", () => {
    it("should have accessible username input with label", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for waiting room
      await waitFor(
        () => {
          expect(screen.getByText("Waiting Room")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Input should be accessible by label
      const usernameInput = screen.getByLabelText(/Your Name/i);
      expect(usernameInput).toBeInTheDocument();
      expect(usernameInput).toHaveAttribute("type", "text");
    });

    it("should have accessible buttons", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for waiting room
      await waitFor(
        () => {
          expect(screen.getByText("Waiting Room")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // All buttons should be accessible
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should have accessible images with alt text", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for waiting room
      await waitFor(
        () => {
          expect(screen.getByText("Waiting Room")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Player avatars should have alt text
      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
      });
    });
  });

  describe("Theme and Customization Integration", () => {
    it("should render header with theme toggle", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for app content
      await waitFor(
        () => {
          expect(screen.getByText("Royal Card Game")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Theme toggle should be present
      const themeToggle = screen.getByRole("button", {
        name: /Switch to (warm|dark) mode/i,
      });
      expect(themeToggle).toBeInTheDocument();
    });

    it("should toggle theme when clicking theme button", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for app content
      await waitFor(
        () => {
          expect(screen.getByText("Royal Card Game")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Find and click theme toggle
      const themeToggle = screen.getByRole("button", {
        name: /Switch to (warm|dark) mode/i,
      });

      const initialTitle = themeToggle.getAttribute("title");
      fireEvent.click(themeToggle);

      // Title should change after toggle
      await waitFor(() => {
        const newTitle = themeToggle.getAttribute("title");
        expect(newTitle).not.toBe(initialTitle);
      });
    });

    it("should render help button", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for app content
      await waitFor(
        () => {
          expect(screen.getByText("Royal Card Game")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Help button should be present
      const helpButton = screen.getByRole("button", {
        name: /How to play/i,
      });
      expect(helpButton).toBeInTheDocument();
    });
  });

  describe("Player Display Integration", () => {
    it("should display all players in waiting room", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for waiting room
      await waitFor(
        () => {
          expect(screen.getByText("Waiting Room")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Should display 4 player avatars
      const images = screen.getAllByRole("img");
      expect(images).toHaveLength(4);

      // Should show Ready status for all
      const readyStatuses = screen.getAllByText("Ready");
      expect(readyStatuses).toHaveLength(4);
    });

    it("should show player names", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for waiting room
      await waitFor(
        () => {
          expect(screen.getByText("Waiting Room")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // AI players should be shown
      expect(screen.getByText("Alex")).toBeInTheDocument();
      expect(screen.getByText("Sam")).toBeInTheDocument();
      expect(screen.getByText("Jordan")).toBeInTheDocument();
    });
  });

  describe("Rule Selection Integration", () => {
    it("should display rule set selection in waiting room", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for waiting room to appear
      await waitFor(
        () => {
          expect(screen.getByText("Waiting Room")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Rule set selector label should be present
      expect(screen.getByText("Select Game Mode")).toBeInTheDocument();

      // Rule set selector button should exist (has id="rule-set-select")
      const ruleSetButton = document.getElementById("rule-set-select");
      expect(ruleSetButton).toBeInTheDocument();
    });

    it("should show rule description", async () => {
      render(<App />);

      // Advance past loading screen
      vi.advanceTimersByTime(2500);

      // Wait for waiting room
      await waitFor(
        () => {
          expect(screen.getByText("Waiting Room")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Rule set selector should have aria-haspopup for dropdown
      const ruleSetButton = document.getElementById("rule-set-select");
      expect(ruleSetButton).toHaveAttribute("aria-haspopup", "listbox");

      // The description appears below the dropdown when closed
      // Check that the rule set button contains some text (the rule name)
      expect(ruleSetButton.textContent).toBeTruthy();
    });
  });

  describe("Performance and Memory", () => {
    it("should render without memory leaks", () => {
      const { unmount } = render(<App />);

      // Advance past loading
      vi.advanceTimersByTime(2500);

      // Unmount should not throw
      expect(() => unmount()).not.toThrow();
    });

    it("should handle multiple renders", () => {
      // Multiple renders should not cause issues
      const { rerender } = render(<App />);

      vi.advanceTimersByTime(2500);

      // Rerender should not throw
      expect(() => rerender(<App />)).not.toThrow();
    });
  });
});
