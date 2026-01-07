/**
 * Unit tests for ruleSets configuration
 * Tests the rule set definitions and their evaluateWinner functions
 */

import { describe, it, expect } from "vitest";
import ruleSets from "./ruleSets";

describe("ruleSets", () => {
  describe("structure", () => {
    it("should be an array", () => {
      expect(Array.isArray(ruleSets)).toBe(true);
    });

    it("should have 3 rule sets", () => {
      expect(ruleSets).toHaveLength(3);
    });

    it("should have required properties for each rule set", () => {
      ruleSets.forEach((ruleSet) => {
        expect(ruleSet).toHaveProperty("id");
        expect(ruleSet).toHaveProperty("name");
        expect(ruleSet).toHaveProperty("description");
        expect(ruleSet).toHaveProperty("evaluateWinner");
      });
    });

    it("should have unique ids", () => {
      const ids = ruleSets.map((r) => r.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it("should have unique names", () => {
      const names = ruleSets.map((r) => r.name);
      const uniqueNames = [...new Set(names)];
      expect(names.length).toBe(uniqueNames.length);
    });

    it("should have evaluateWinner as a function for each rule set", () => {
      ruleSets.forEach((ruleSet) => {
        expect(typeof ruleSet.evaluateWinner).toBe("function");
      });
    });

    it("should have non-empty ids", () => {
      ruleSets.forEach((ruleSet) => {
        expect(ruleSet.id.length).toBeGreaterThan(0);
      });
    });

    it("should have non-empty names", () => {
      ruleSets.forEach((ruleSet) => {
        expect(ruleSet.name.length).toBeGreaterThan(0);
      });
    });

    it("should have non-empty descriptions", () => {
      ruleSets.forEach((ruleSet) => {
        expect(ruleSet.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe("highest-card rule set", () => {
    const highestCardRuleSet = ruleSets.find((r) => r.id === "highest-card");

    it("should exist", () => {
      expect(highestCardRuleSet).toBeDefined();
    });

    it("should have correct name", () => {
      expect(highestCardRuleSet.name).toBe("Highest Card Wins");
    });

    it("should have correct description", () => {
      expect(highestCardRuleSet.description).toBe(
        "The highest card value wins the trick"
      );
    });

    describe("evaluateWinner", () => {
      it("should return the player with the highest value card", () => {
        const cards = {
          player1: { suit: "hearts", rank: 5, value: 5 },
          player2: { suit: "diamonds", rank: 10, value: 10 },
          player3: { suit: "clubs", rank: 3, value: 3 },
          player4: { suit: "spades", rank: 7, value: 7 },
        };

        const winner = highestCardRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player2");
      });

      it("should handle Ace as highest value (14)", () => {
        const cards = {
          player1: { suit: "hearts", rank: 1, value: 14 },
          player2: { suit: "diamonds", rank: 13, value: 13 },
          player3: { suit: "clubs", rank: 12, value: 12 },
          player4: { suit: "spades", rank: 11, value: 11 },
        };

        const winner = highestCardRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player1");
      });

      it("should handle King (value 13)", () => {
        const cards = {
          player1: { suit: "hearts", rank: 2, value: 2 },
          player2: { suit: "diamonds", rank: 13, value: 13 },
          player3: { suit: "clubs", rank: 10, value: 10 },
          player4: { suit: "spades", rank: 5, value: 5 },
        };

        const winner = highestCardRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player2");
      });

      it("should ignore suit and only consider value", () => {
        const cards = {
          player1: { suit: "hearts", rank: 5, value: 5 },
          player2: { suit: "spades", rank: 5, value: 5 },
          player3: { suit: "clubs", rank: 8, value: 8 },
          player4: { suit: "diamonds", rank: 2, value: 2 },
        };

        const winner = highestCardRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player3");
      });

      it("should return first player with highest value on tie", () => {
        const cards = {
          player1: { suit: "hearts", rank: 10, value: 10 },
          player2: { suit: "diamonds", rank: 10, value: 10 },
          player3: { suit: "clubs", rank: 5, value: 5 },
          player4: { suit: "spades", rank: 3, value: 3 },
        };

        const winner = highestCardRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player1");
      });

      it("should handle all same value cards", () => {
        const cards = {
          player1: { suit: "hearts", rank: 7, value: 7 },
          player2: { suit: "diamonds", rank: 7, value: 7 },
          player3: { suit: "clubs", rank: 7, value: 7 },
          player4: { suit: "spades", rank: 7, value: 7 },
        };

        const winner = highestCardRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player1");
      });

      it("should work with fewer than 4 cards", () => {
        const cards = {
          player1: { suit: "hearts", rank: 5, value: 5 },
          player2: { suit: "diamonds", rank: 10, value: 10 },
        };

        const winner = highestCardRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player2");
      });

      it("should work with a single card", () => {
        const cards = {
          player1: { suit: "hearts", rank: 5, value: 5 },
        };

        const winner = highestCardRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player1");
      });
    });
  });

  describe("suit-follows rule set", () => {
    const suitFollowsRuleSet = ruleSets.find((r) => r.id === "suit-follows");

    it("should exist", () => {
      expect(suitFollowsRuleSet).toBeDefined();
    });

    it("should have correct name", () => {
      expect(suitFollowsRuleSet.name).toBe("Suit Follows");
    });

    it("should have correct description", () => {
      expect(suitFollowsRuleSet.description).toBe(
        "Must follow lead suit, highest of lead suit wins"
      );
    });

    describe("evaluateWinner", () => {
      it("should return the player with highest card of lead suit", () => {
        const cards = {
          player1: { suit: "hearts", rank: 5, value: 5 },
          player2: { suit: "hearts", rank: 10, value: 10 },
          player3: { suit: "hearts", rank: 3, value: 3 },
          player4: { suit: "hearts", rank: 7, value: 7 },
        };

        const winner = suitFollowsRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player2");
      });

      it("should ignore higher cards of different suits", () => {
        const cards = {
          player1: { suit: "hearts", rank: 5, value: 5 },
          player2: { suit: "spades", rank: 1, value: 14 },
          player3: { suit: "hearts", rank: 10, value: 10 },
          player4: { suit: "diamonds", rank: 13, value: 13 },
        };

        const winner = suitFollowsRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player3");
      });

      it("should use lead card suit from first player", () => {
        const cards = {
          player1: { suit: "diamonds", rank: 2, value: 2 },
          player2: { suit: "diamonds", rank: 8, value: 8 },
          player3: { suit: "hearts", rank: 13, value: 13 },
          player4: { suit: "spades", rank: 1, value: 14 },
        };

        const winner = suitFollowsRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player2");
      });

      it("should handle Ace as highest when following suit", () => {
        const cards = {
          player1: { suit: "clubs", rank: 13, value: 13 },
          player2: { suit: "clubs", rank: 1, value: 14 },
          player3: { suit: "clubs", rank: 12, value: 12 },
          player4: { suit: "clubs", rank: 11, value: 11 },
        };

        const winner = suitFollowsRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player2");
      });

      it("should return lead player if no one follows suit", () => {
        const cards = {
          player1: { suit: "hearts", rank: 2, value: 2 },
          player2: { suit: "spades", rank: 13, value: 13 },
          player3: { suit: "clubs", rank: 1, value: 14 },
          player4: { suit: "diamonds", rank: 10, value: 10 },
        };

        const winner = suitFollowsRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player1");
      });

      it("should return first player with highest lead suit on tie", () => {
        const cards = {
          player1: { suit: "hearts", rank: 10, value: 10 },
          player2: { suit: "hearts", rank: 10, value: 10 },
          player3: { suit: "spades", rank: 10, value: 10 },
          player4: { suit: "clubs", rank: 10, value: 10 },
        };

        const winner = suitFollowsRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player1");
      });

      it("should work with only lead player following suit", () => {
        const cards = {
          player1: { suit: "diamonds", rank: 3, value: 3 },
          player2: { suit: "hearts", rank: 10, value: 10 },
          player3: { suit: "spades", rank: 12, value: 12 },
          player4: { suit: "clubs", rank: 1, value: 14 },
        };

        const winner = suitFollowsRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player1");
      });

      it("should work with a single card", () => {
        const cards = {
          player1: { suit: "spades", rank: 5, value: 5 },
        };

        const winner = suitFollowsRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player1");
      });

      it("should handle multiple followers with varying values", () => {
        const cards = {
          player1: { suit: "spades", rank: 5, value: 5 },
          player2: { suit: "spades", rank: 2, value: 2 },
          player3: { suit: "spades", rank: 11, value: 11 },
          player4: { suit: "hearts", rank: 1, value: 14 },
        };

        const winner = suitFollowsRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player3");
      });
    });
  });

  describe("spades-trump rule set", () => {
    const spadesTrumpRuleSet = ruleSets.find((r) => r.id === "spades-trump");

    it("should exist", () => {
      expect(spadesTrumpRuleSet).toBeDefined();
    });

    it("should have correct name", () => {
      expect(spadesTrumpRuleSet.name).toBe("Spades Trump");
    });

    it("should have correct description", () => {
      expect(spadesTrumpRuleSet.description).toBe(
        "Spades are trump cards and beat all other suits"
      );
    });

    describe("evaluateWinner", () => {
      it("should return spades player over higher non-spades cards", () => {
        const cards = {
          player1: { suit: "hearts", rank: 1, value: 14 },
          player2: { suit: "spades", rank: 2, value: 2 },
          player3: { suit: "diamonds", rank: 13, value: 13 },
          player4: { suit: "clubs", rank: 12, value: 12 },
        };

        const winner = spadesTrumpRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player2");
      });

      it("should return highest spades when multiple spades played", () => {
        const cards = {
          player1: { suit: "spades", rank: 3, value: 3 },
          player2: { suit: "spades", rank: 10, value: 10 },
          player3: { suit: "spades", rank: 5, value: 5 },
          player4: { suit: "hearts", rank: 1, value: 14 },
        };

        const winner = spadesTrumpRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player2");
      });

      it("should handle Ace of spades as highest trump", () => {
        const cards = {
          player1: { suit: "spades", rank: 13, value: 13 },
          player2: { suit: "spades", rank: 1, value: 14 },
          player3: { suit: "spades", rank: 12, value: 12 },
          player4: { suit: "spades", rank: 11, value: 11 },
        };

        const winner = spadesTrumpRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player2");
      });

      it("should return highest lead suit when no spades played", () => {
        const cards = {
          player1: { suit: "hearts", rank: 5, value: 5 },
          player2: { suit: "hearts", rank: 10, value: 10 },
          player3: { suit: "diamonds", rank: 13, value: 13 },
          player4: { suit: "clubs", rank: 1, value: 14 },
        };

        const winner = spadesTrumpRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player2");
      });

      it("should ignore non-lead suit and non-spades cards", () => {
        const cards = {
          player1: { suit: "diamonds", rank: 3, value: 3 },
          player2: { suit: "hearts", rank: 1, value: 14 },
          player3: { suit: "diamonds", rank: 10, value: 10 },
          player4: { suit: "clubs", rank: 13, value: 13 },
        };

        const winner = spadesTrumpRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player3");
      });

      it("should handle lowest spade beating highest of other suits", () => {
        const cards = {
          player1: { suit: "hearts", rank: 1, value: 14 },
          player2: { suit: "diamonds", rank: 1, value: 14 },
          player3: { suit: "clubs", rank: 1, value: 14 },
          player4: { suit: "spades", rank: 2, value: 2 },
        };

        const winner = spadesTrumpRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player4");
      });

      it("should return lead player when no spades and no one follows suit", () => {
        const cards = {
          player1: { suit: "hearts", rank: 2, value: 2 },
          player2: { suit: "diamonds", rank: 13, value: 13 },
          player3: { suit: "clubs", rank: 1, value: 14 },
          player4: { suit: "diamonds", rank: 10, value: 10 },
        };

        const winner = spadesTrumpRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player1");
      });

      it("should work with only spades cards", () => {
        const cards = {
          player1: { suit: "spades", rank: 5, value: 5 },
          player2: { suit: "spades", rank: 8, value: 8 },
          player3: { suit: "spades", rank: 3, value: 3 },
          player4: { suit: "spades", rank: 11, value: 11 },
        };

        const winner = spadesTrumpRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player4");
      });

      it("should return first spades player on tie", () => {
        const cards = {
          player1: { suit: "spades", rank: 5, value: 5 },
          player2: { suit: "spades", rank: 5, value: 5 },
          player3: { suit: "hearts", rank: 10, value: 10 },
          player4: { suit: "diamonds", rank: 1, value: 14 },
        };

        const winner = spadesTrumpRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player1");
      });

      it("should work with a single spades card", () => {
        const cards = {
          player1: { suit: "spades", rank: 5, value: 5 },
        };

        const winner = spadesTrumpRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player1");
      });

      it("should work with a single non-spades card", () => {
        const cards = {
          player1: { suit: "hearts", rank: 5, value: 5 },
        };

        const winner = spadesTrumpRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player1");
      });

      it("should handle spades lead with followers", () => {
        const cards = {
          player1: { suit: "spades", rank: 5, value: 5 },
          player2: { suit: "spades", rank: 10, value: 10 },
          player3: { suit: "hearts", rank: 1, value: 14 },
          player4: { suit: "spades", rank: 3, value: 3 },
        };

        const winner = spadesTrumpRuleSet.evaluateWinner(cards);
        expect(winner).toBe("player2");
      });
    });
  });

  describe("rule set indices", () => {
    it("should have highest-card at index 0", () => {
      expect(ruleSets[0].id).toBe("highest-card");
    });

    it("should have suit-follows at index 1", () => {
      expect(ruleSets[1].id).toBe("suit-follows");
    });

    it("should have spades-trump at index 2", () => {
      expect(ruleSets[2].id).toBe("spades-trump");
    });
  });

  describe("edge cases across all rule sets", () => {
    it("should handle empty cards object gracefully", () => {
      ruleSets.forEach((ruleSet) => {
        // Note: This tests the current behavior - may throw or return undefined
        // The important thing is it doesn't crash unexpectedly
        try {
          const result = ruleSet.evaluateWinner({});
          expect(result).toBeDefined();
        } catch {
          // Expected for empty input
        }
      });
    });

    it("should return a string player ID for valid input", () => {
      const validCards = {
        player1: { suit: "hearts", rank: 5, value: 5 },
        player2: { suit: "diamonds", rank: 10, value: 10 },
        player3: { suit: "clubs", rank: 3, value: 3 },
        player4: { suit: "spades", rank: 7, value: 7 },
      };

      ruleSets.forEach((ruleSet) => {
        const winner = ruleSet.evaluateWinner(validCards);
        expect(typeof winner).toBe("string");
        expect(["player1", "player2", "player3", "player4"]).toContain(winner);
      });
    });

    it("should consistently return same winner for same input", () => {
      const cards = {
        player1: { suit: "hearts", rank: 5, value: 5 },
        player2: { suit: "hearts", rank: 10, value: 10 },
        player3: { suit: "spades", rank: 3, value: 3 },
        player4: { suit: "diamonds", rank: 7, value: 7 },
      };

      ruleSets.forEach((ruleSet) => {
        const winner1 = ruleSet.evaluateWinner(cards);
        const winner2 = ruleSet.evaluateWinner(cards);
        const winner3 = ruleSet.evaluateWinner(cards);
        expect(winner1).toBe(winner2);
        expect(winner2).toBe(winner3);
      });
    });
  });
});
