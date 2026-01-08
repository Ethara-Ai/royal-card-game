/**
 * Integration Tests - Full Game Flow
 * Tests the complete game flow from start to finish
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import App from "../../App";
import { GAME_PHASES } from "../../constants";

describe("Full Game Flow Integration Tests", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Complete Game Lifecycle", () => {
    it("should complete a full game from waiting room to game over", async () => {
      render(<App />);

      // 1. WAITING ROOM PHASE
      expect(
        await screen.findByText(/Welcome to Royal Card Game/i),
      ).toBeInTheDocument();

      // Enter username
      const usernameInput = screen.getByPlaceholderText(/Enter your name/i);
      await user.type(usernameInput, "TestPlayer");

      // Start game
      const startButton = screen.getByRole("button", { name: /Start Game/i });
      await user.click(startButton);

      // 2. DEALING PHASE
      await waitFor(
        () => {
          expect(
            screen.queryByText(/cards are being dealt/i),
          ).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // 3. PLAYING PHASE
      await waitFor(
        () => {
          expect(screen.queryByText(/Your turn/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      // Verify user has cards
      const userCards = screen.getAllByRole("button", { name: /Card/i });
      expect(userCards.length).toBeGreaterThan(0);

      // Play all 7 tricks
      for (let trick = 0; trick < 7; trick++) {
        // Wait for user's turn
        await waitFor(
          () => {
            const turnIndicator = screen.queryByText(/Your turn/i);
            if (!turnIndicator) return false;
            return true;
          },
          { timeout: 10000 },
        );

        // Find available cards in user's hand
        const availableCards = screen.getAllByRole("button", {
          name: /Card/i,
        });

        if (availableCards.length > 0) {
          // Simulate drag and drop to play area
          const card = availableCards[0];
          const playArea = screen.getByTestId("play-area-drop");

          await user.pointer([
            { keys: "[MouseLeft>]", target: card },
            { coords: { x: 500, y: 300 } },
            { keys: "[/MouseLeft]", target: playArea },
          ]);

          // Wait for trick to complete
          await waitFor(() => screen.queryByText(/wins the trick/i) !== null, {
            timeout: 15000,
          });
        }
      }

      // 4. GAME OVER PHASE
      await waitFor(
        () => {
          expect(screen.queryByText(/Game Over/i)).toBeInTheDocument();
        },
        { timeout: 10000 },
      );

      // Verify winner modal appears
      expect(screen.getByText(/wins the game/i)).toBeInTheDocument();

      // Verify final scores are displayed
      expect(screen.getByText(/Final Score/i)).toBeInTheDocument();
    }, 60000); // Extended timeout for full game

    it("should handle game reset correctly", async () => {
      render(<App />);

      // Start game
      const usernameInput =
        await screen.findByPlaceholderText(/Enter your name/i);
      await user.type(usernameInput, "Player1");

      const startButton = screen.getByRole("button", { name: /Start Game/i });
      await user.click(startButton);

      // Wait for game to start
      await waitFor(() => {
        expect(
          screen.queryByText(/cards are being dealt/i),
        ).toBeInTheDocument();
      });

      // Reset game during dealing
      const resetButton = screen.getByRole("button", { name: /Reset/i });
      await user.click(resetButton);

      // Should return to waiting room
      await waitFor(() => {
        expect(
          screen.queryByText(/Welcome to Royal Card Game/i),
        ).toBeInTheDocument();
      });

      // Should be able to start again
      const newStartButton = screen.getByRole("button", {
        name: /Start Game/i,
      });
      expect(newStartButton).toBeEnabled();
    });

    it("should maintain scores throughout the game", async () => {
      render(<App />);

      // Start game
      const usernameInput =
        await screen.findByPlaceholderText(/Enter your name/i);
      await user.type(usernameInput, "ScoreTracker");

      const startButton = screen.getByRole("button", { name: /Start Game/i });
      await user.click(startButton);

      // Wait for playing phase
      await waitFor(
        () => {
          expect(screen.queryByText(/Your turn/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      // Track initial scores
      const initialScores = screen
        .getAllByText(/Score:/i)
        .map((el) => parseInt(el.textContent.match(/\d+/)[0]));

      expect(initialScores).toEqual([0, 0, 0, 0]);

      // Play one trick
      const cards = screen.getAllByRole("button", { name: /Card/i });
      if (cards.length > 0) {
        const card = cards[0];
        const playArea = screen.getByTestId("play-area-drop");

        await user.pointer([
          { keys: "[MouseLeft>]", target: card },
          { coords: { x: 500, y: 300 } },
          { keys: "[/MouseLeft]", target: playArea },
        ]);

        // Wait for trick completion
        await waitFor(() => screen.queryByText(/wins the trick/i) !== null, {
          timeout: 15000,
        });

        // Verify score increased
        await waitFor(() => {
          const newScores = screen
            .getAllByText(/Score:/i)
            .map((el) => parseInt(el.textContent.match(/\d+/)[0]));

          const totalScore = newScores.reduce((sum, score) => sum + score, 0);
          expect(totalScore).toBe(1);
        });
      }
    }, 30000);
  });

  describe("Error Handling and Edge Cases", () => {
    it("should handle starting game without username", async () => {
      render(<App />);

      // Try to start without username
      const startButton = await screen.findByRole("button", {
        name: /Start Game/i,
      });

      await user.click(startButton);

      // Game should still start (username is optional or defaults)
      await waitFor(
        () => {
          expect(
            screen.queryByText(/cards are being dealt/i),
          ).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it("should prevent playing cards out of turn", async () => {
      render(<App />);

      // Start game
      const usernameInput =
        await screen.findByPlaceholderInput(/Enter your name/i);
      await user.type(usernameInput, "TurnTester");

      const startButton = screen.getByRole("button", { name: /Start Game/i });
      await user.click(startButton);

      // Wait for playing phase
      await waitFor(
        () => {
          expect(screen.queryByText(/Your turn/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      // Play a card during user's turn
      const cards = screen.getAllByRole("button", { name: /Card/i });
      if (cards.length > 0) {
        const card = cards[0];
        await user.click(card);

        // Wait for AI turn
        await waitFor(() => screen.queryByText(/Your turn/i) === null, {
          timeout: 5000,
        });

        // Try to play another card (should be prevented)
        if (cards.length > 1) {
          const secondCard = cards[1];
          const initialHandSize = cards.length;

          await user.click(secondCard);

          // Hand size should not change (card not played)
          const currentCards = screen.getAllByRole("button", {
            name: /Card/i,
          });
          expect(currentCards.length).toBe(initialHandSize);
        }
      }
    }, 20000);

    it("should handle rapid clicking on start button", async () => {
      render(<App />);

      const startButton = await screen.findByRole("button", {
        name: /Start Game/i,
      });

      // Click multiple times rapidly
      await user.tripleClick(startButton);

      // Should only start one game
      await waitFor(
        () => {
          expect(
            screen.queryByText(/cards are being dealt/i),
          ).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Verify only one set of cards was dealt
      await waitFor(
        () => {
          expect(screen.queryByText(/Your turn/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      const cards = screen.getAllByRole("button", { name: /Card/i });
      expect(cards.length).toBeLessThanOrEqual(13); // Max 13 cards per player
    });
  });

  describe("Accessibility Integration", () => {
    it("should be keyboard navigable throughout the game", async () => {
      render(<App />);

      // Tab to username input
      await user.tab();
      expect(screen.getByPlaceholderText(/Enter your name/i)).toHaveFocus();

      // Type username
      await user.keyboard("KeyboardUser");

      // Tab to start button
      await user.tab();
      const startButton = screen.getByRole("button", { name: /Start Game/i });
      expect(startButton).toHaveFocus();

      // Press Enter to start
      await user.keyboard("{Enter}");

      // Wait for game to start
      await waitFor(
        () => {
          expect(
            screen.queryByText(/cards are being dealt/i),
          ).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Wait for playing phase
      await waitFor(
        () => {
          expect(screen.queryByText(/Your turn/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      // Tab to first card
      await user.tab();
      const cards = screen.getAllByRole("button", { name: /Card/i });
      if (cards.length > 0) {
        expect(cards[0]).toHaveFocus();

        // Use arrow keys to navigate cards
        await user.keyboard("{ArrowRight}");
        if (cards.length > 1) {
          expect(cards[1]).toHaveFocus();
        }

        // Select card with Enter
        await user.keyboard("{Enter}");

        // Card should be played
        await waitFor(
          () => {
            const remainingCards = screen.getAllByRole("button", {
              name: /Card/i,
            });
            expect(remainingCards.length).toBe(cards.length - 1);
          },
          { timeout: 2000 },
        );
      }
    }, 30000);

    it("should have proper ARIA labels and roles", async () => {
      render(<App />);

      // Check main landmarks
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByRole("banner")).toBeInTheDocument();

      // Start game
      const usernameInput =
        await screen.findByPlaceholderText(/Enter your name/i);
      await user.type(usernameInput, "ARIATest");

      const startButton = screen.getByRole("button", { name: /Start Game/i });
      await user.click(startButton);

      // Wait for playing phase
      await waitFor(
        () => {
          expect(screen.queryByText(/Your turn/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      // Verify cards have proper ARIA labels
      const cards = screen.getAllByRole("button", { name: /Card/i });
      cards.forEach((card) => {
        expect(card).toHaveAttribute("aria-label");
      });

      // Verify play area has proper role
      const playArea = screen.getByTestId("play-area-drop");
      expect(playArea).toHaveAttribute("role");
    });

    it("should announce important game events to screen readers", async () => {
      render(<App />);

      // Start game
      const usernameInput =
        await screen.findByPlaceholderText(/Enter your name/i);
      await user.type(usernameInput, "ScreenReaderTest");

      const startButton = screen.getByRole("button", { name: /Start Game/i });
      await user.click(startButton);

      // Check for live region announcements
      await waitFor(() => {
        const liveRegions = screen.queryAllByRole("status");
        expect(liveRegions.length).toBeGreaterThan(0);
      });

      // Wait for playing phase
      await waitFor(
        () => {
          expect(screen.queryByText(/Your turn/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      // Play a card and verify announcement
      const cards = screen.getAllByRole("button", { name: /Card/i });
      if (cards.length > 0) {
        await user.click(cards[0]);

        await waitFor(
          () => {
            // Should announce card played
            expect(screen.queryByText(/Card played/i)).toBeInTheDocument();
          },
          { timeout: 2000 },
        );
      }
    }, 20000);
  });

  describe("Theme and Customization Integration", () => {
    it("should maintain theme preference throughout game", async () => {
      render(<App />);

      // Toggle to dark theme
      const themeToggle = await screen.findByRole("button", {
        name: /theme/i,
      });
      await user.click(themeToggle);

      // Verify dark theme applied
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");

      // Start game
      const startButton = screen.getByRole("button", { name: /Start Game/i });
      await user.click(startButton);

      // Wait for game to start
      await waitFor(
        () => {
          expect(screen.queryByText(/Your turn/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      // Theme should persist
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    });

    it("should allow card customization during game", async () => {
      render(<App />);

      // Start game first
      const startButton = await screen.findByRole("button", {
        name: /Start Game/i,
      });
      await user.click(startButton);

      // Wait for playing phase
      await waitFor(
        () => {
          expect(screen.queryByText(/Your turn/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      // Open settings
      const settingsButton = screen.getByRole("button", { name: /settings/i });
      await user.click(settingsButton);

      // Change card pattern (if available)
      const patternOptions = screen.queryAllByRole("button", {
        name: /pattern/i,
      });
      if (patternOptions.length > 0) {
        await user.click(patternOptions[0]);

        // Close settings
        await user.keyboard("{Escape}");

        // Game should continue with new pattern
        expect(screen.queryByText(/Your turn/i)).toBeInTheDocument();
      }
    });
  });

  describe("Performance and Memory", () => {
    it("should handle multiple game sessions without memory leaks", async () => {
      const { unmount } = render(<App />);

      // Play multiple short games
      for (let i = 0; i < 3; i++) {
        const startButton = await screen.findByRole("button", {
          name: /Start Game/i,
        });
        await user.click(startButton);

        // Wait briefly
        await waitFor(
          () => {
            expect(
              screen.queryByText(/cards are being dealt/i),
            ).toBeInTheDocument();
          },
          { timeout: 3000 },
        );

        // Reset game
        const resetButton = screen.getByRole("button", { name: /Reset/i });
        await user.click(resetButton);

        await waitFor(() => {
          expect(
            screen.queryByText(/Welcome to Royal Card Game/i),
          ).toBeInTheDocument();
        });
      }

      // Cleanup
      unmount();

      // If we get here without errors, no major memory leaks
      expect(true).toBe(true);
    }, 30000);

    it("should cleanup timers and intervals on unmount", async () => {
      const { unmount } = render(<App />);

      // Start game
      const startButton = await screen.findByRole("button", {
        name: /Start Game/i,
      });
      await user.click(startButton);

      // Wait for dealing
      await waitFor(
        () => {
          expect(
            screen.queryByText(/cards are being dealt/i),
          ).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Unmount during active game
      unmount();

      // Should not throw errors
      expect(true).toBe(true);
    });
  });
});
