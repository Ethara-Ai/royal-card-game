/**
 * Unit tests for gameConstants
 * Tests all exported constants and their values
 */

import { describe, it, expect } from "vitest";
import {
  INITIAL_GAME_STATE,
  INITIAL_PLAYERS,
  SUITS,
  CARDS_PER_PLAYER,
  PLAYER_COUNT,
  DEFAULT_CARD_BACK_COLOR,
  DEFAULT_CARD_BACK_PATTERN,
  ANIMATION_TIMINGS,
  CARD_POSITIONS,
  GAME_PHASES,
  CONFETTI_COLORS,
  THEMES,
} from "./gameConstants";

describe("gameConstants", () => {
  describe("INITIAL_GAME_STATE", () => {
    it("should be an object", () => {
      expect(typeof INITIAL_GAME_STATE).toBe("object");
      expect(INITIAL_GAME_STATE).not.toBeNull();
    });

    it("should have phase set to waiting", () => {
      expect(INITIAL_GAME_STATE.phase).toBe("waiting");
    });

    it("should have currentPlayer set to 0", () => {
      expect(INITIAL_GAME_STATE.currentPlayer).toBe(0);
    });

    it("should have empty currentTrick array", () => {
      expect(Array.isArray(INITIAL_GAME_STATE.currentTrick)).toBe(true);
      expect(INITIAL_GAME_STATE.currentTrick).toHaveLength(0);
    });

    it("should have empty playedCards object", () => {
      expect(typeof INITIAL_GAME_STATE.playedCards).toBe("object");
      expect(Object.keys(INITIAL_GAME_STATE.playedCards)).toHaveLength(0);
    });

    it("should have scores array with 4 zeros", () => {
      expect(Array.isArray(INITIAL_GAME_STATE.scores)).toBe(true);
      expect(INITIAL_GAME_STATE.scores).toHaveLength(4);
      expect(INITIAL_GAME_STATE.scores).toEqual([0, 0, 0, 0]);
    });

    it("should have round set to 1", () => {
      expect(INITIAL_GAME_STATE.round).toBe(1);
    });

    it("should have maxRounds set to 5", () => {
      expect(INITIAL_GAME_STATE.maxRounds).toBe(5);
    });

    it("should have all required properties", () => {
      const requiredProps = [
        "phase",
        "currentPlayer",
        "currentTrick",
        "playedCards",
        "scores",
        "round",
        "maxRounds",
      ];
      requiredProps.forEach((prop) => {
        expect(INITIAL_GAME_STATE).toHaveProperty(prop);
      });
    });
  });

  describe("INITIAL_PLAYERS", () => {
    it("should be an array", () => {
      expect(Array.isArray(INITIAL_PLAYERS)).toBe(true);
    });

    it("should have 4 players", () => {
      expect(INITIAL_PLAYERS).toHaveLength(4);
    });

    it("should have required properties for each player", () => {
      const requiredProps = ["id", "name", "hand", "score", "isActive"];
      INITIAL_PLAYERS.forEach((player) => {
        requiredProps.forEach((prop) => {
          expect(player).toHaveProperty(prop);
        });
      });
    });

    it("should have unique ids for each player", () => {
      const ids = INITIAL_PLAYERS.map((p) => p.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it("should have player1 as the first player", () => {
      expect(INITIAL_PLAYERS[0].id).toBe("player1");
      expect(INITIAL_PLAYERS[0].name).toBe("Player");
    });

    it("should have player1 as active", () => {
      expect(INITIAL_PLAYERS[0].isActive).toBe(true);
    });

    it("should have other players as inactive", () => {
      for (let i = 1; i < INITIAL_PLAYERS.length; i++) {
        expect(INITIAL_PLAYERS[i].isActive).toBe(false);
      }
    });

    it("should have empty hands for all players", () => {
      INITIAL_PLAYERS.forEach((player) => {
        expect(Array.isArray(player.hand)).toBe(true);
        expect(player.hand).toHaveLength(0);
      });
    });

    it("should have zero score for all players", () => {
      INITIAL_PLAYERS.forEach((player) => {
        expect(player.score).toBe(0);
      });
    });

    it("should have correct player names", () => {
      expect(INITIAL_PLAYERS[0].name).toBe("Player");
      expect(INITIAL_PLAYERS[1].name).toBe("Alex");
      expect(INITIAL_PLAYERS[2].name).toBe("Sam");
      expect(INITIAL_PLAYERS[3].name).toBe("Jordan");
    });

    it("should have correct player ids", () => {
      expect(INITIAL_PLAYERS[0].id).toBe("player1");
      expect(INITIAL_PLAYERS[1].id).toBe("player2");
      expect(INITIAL_PLAYERS[2].id).toBe("player3");
      expect(INITIAL_PLAYERS[3].id).toBe("player4");
    });
  });

  describe("SUITS", () => {
    it("should be an array", () => {
      expect(Array.isArray(SUITS)).toBe(true);
    });

    it("should have 4 suits", () => {
      expect(SUITS).toHaveLength(4);
    });

    it("should contain hearts", () => {
      expect(SUITS).toContain("hearts");
    });

    it("should contain diamonds", () => {
      expect(SUITS).toContain("diamonds");
    });

    it("should contain clubs", () => {
      expect(SUITS).toContain("clubs");
    });

    it("should contain spades", () => {
      expect(SUITS).toContain("spades");
    });

    it("should have unique values", () => {
      const uniqueSuits = [...new Set(SUITS)];
      expect(SUITS.length).toBe(uniqueSuits.length);
    });

    it("should be in expected order", () => {
      expect(SUITS).toEqual(["hearts", "diamonds", "clubs", "spades"]);
    });

    it("should contain only strings", () => {
      SUITS.forEach((suit) => {
        expect(typeof suit).toBe("string");
      });
    });
  });

  describe("CARDS_PER_PLAYER", () => {
    it("should be a number", () => {
      expect(typeof CARDS_PER_PLAYER).toBe("number");
    });

    it("should be 7", () => {
      expect(CARDS_PER_PLAYER).toBe(7);
    });

    it("should be a positive integer", () => {
      expect(CARDS_PER_PLAYER).toBeGreaterThan(0);
      expect(Number.isInteger(CARDS_PER_PLAYER)).toBe(true);
    });

    it("should allow dealing to all players without exceeding deck size", () => {
      const totalCards = CARDS_PER_PLAYER * PLAYER_COUNT;
      const deckSize = SUITS.length * 13; // 52 cards
      expect(totalCards).toBeLessThanOrEqual(deckSize);
    });
  });

  describe("PLAYER_COUNT", () => {
    it("should be a number", () => {
      expect(typeof PLAYER_COUNT).toBe("number");
    });

    it("should be 4", () => {
      expect(PLAYER_COUNT).toBe(4);
    });

    it("should match INITIAL_PLAYERS length", () => {
      expect(PLAYER_COUNT).toBe(INITIAL_PLAYERS.length);
    });

    it("should match scores array length", () => {
      expect(PLAYER_COUNT).toBe(INITIAL_GAME_STATE.scores.length);
    });

    it("should be a positive integer", () => {
      expect(PLAYER_COUNT).toBeGreaterThan(0);
      expect(Number.isInteger(PLAYER_COUNT)).toBe(true);
    });
  });

  describe("DEFAULT_CARD_BACK_COLOR", () => {
    it("should be a string", () => {
      expect(typeof DEFAULT_CARD_BACK_COLOR).toBe("string");
    });

    it("should be a valid hex color", () => {
      expect(DEFAULT_CARD_BACK_COLOR).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it("should be the correct default color", () => {
      expect(DEFAULT_CARD_BACK_COLOR).toBe("#145a4a");
    });

    it("should be a non-empty string", () => {
      expect(DEFAULT_CARD_BACK_COLOR.length).toBeGreaterThan(0);
    });
  });

  describe("DEFAULT_CARD_BACK_PATTERN", () => {
    it("should be a string", () => {
      expect(typeof DEFAULT_CARD_BACK_PATTERN).toBe("string");
    });

    it("should be checker", () => {
      expect(DEFAULT_CARD_BACK_PATTERN).toBe("checker");
    });

    it("should be a non-empty string", () => {
      expect(DEFAULT_CARD_BACK_PATTERN.length).toBeGreaterThan(0);
    });
  });

  describe("ANIMATION_TIMINGS", () => {
    it("should be an object", () => {
      expect(typeof ANIMATION_TIMINGS).toBe("object");
      expect(ANIMATION_TIMINGS).not.toBeNull();
    });

    it("should have dealingDelay property", () => {
      expect(ANIMATION_TIMINGS).toHaveProperty("dealingDelay");
      expect(typeof ANIMATION_TIMINGS.dealingDelay).toBe("number");
    });

    it("should have dealingAnimation property", () => {
      expect(ANIMATION_TIMINGS).toHaveProperty("dealingAnimation");
      expect(typeof ANIMATION_TIMINGS.dealingAnimation).toBe("number");
    });

    it("should have cardPlayDelay property", () => {
      expect(ANIMATION_TIMINGS).toHaveProperty("cardPlayDelay");
      expect(typeof ANIMATION_TIMINGS.cardPlayDelay).toBe("number");
    });

    it("should have aiPlayDelay property", () => {
      expect(ANIMATION_TIMINGS).toHaveProperty("aiPlayDelay");
      expect(typeof ANIMATION_TIMINGS.aiPlayDelay).toBe("number");
    });

    it("should have trickEvaluationDelay property", () => {
      expect(ANIMATION_TIMINGS).toHaveProperty("trickEvaluationDelay");
      expect(typeof ANIMATION_TIMINGS.trickEvaluationDelay).toBe("number");
    });

    it("should have confettiDuration property", () => {
      expect(ANIMATION_TIMINGS).toHaveProperty("confettiDuration");
      expect(typeof ANIMATION_TIMINGS.confettiDuration).toBe("number");
    });

    it("should have appLoadDelay property", () => {
      expect(ANIMATION_TIMINGS).toHaveProperty("appLoadDelay");
      expect(typeof ANIMATION_TIMINGS.appLoadDelay).toBe("number");
    });

    it("should have all positive values", () => {
      Object.values(ANIMATION_TIMINGS).forEach((value) => {
        expect(value).toBeGreaterThan(0);
      });
    });

    it("should have correct timing values", () => {
      expect(ANIMATION_TIMINGS.dealingDelay).toBe(500);
      expect(ANIMATION_TIMINGS.dealingAnimation).toBe(800);
      expect(ANIMATION_TIMINGS.cardPlayDelay).toBe(1000);
      expect(ANIMATION_TIMINGS.aiPlayDelay).toBe(1200);
      expect(ANIMATION_TIMINGS.trickEvaluationDelay).toBe(2000);
      expect(ANIMATION_TIMINGS.confettiDuration).toBe(5000);
      expect(ANIMATION_TIMINGS.appLoadDelay).toBe(500);
    });

    it("should have integer values (milliseconds)", () => {
      Object.values(ANIMATION_TIMINGS).forEach((value) => {
        expect(Number.isInteger(value)).toBe(true);
      });
    });
  });

  describe("CARD_POSITIONS", () => {
    it("should be an array", () => {
      expect(Array.isArray(CARD_POSITIONS)).toBe(true);
    });

    it("should have 4 positions (one for each player)", () => {
      expect(CARD_POSITIONS).toHaveLength(4);
    });

    it("should have required properties for each position", () => {
      const requiredProps = ["x", "y", "rotation", "zIndex"];
      CARD_POSITIONS.forEach((position) => {
        requiredProps.forEach((prop) => {
          expect(position).toHaveProperty(prop);
        });
      });
    });

    it("should have number values for x, y, rotation, and zIndex", () => {
      CARD_POSITIONS.forEach((position) => {
        expect(typeof position.x).toBe("number");
        expect(typeof position.y).toBe("number");
        expect(typeof position.rotation).toBe("number");
        expect(typeof position.zIndex).toBe("number");
      });
    });

    it("should have increasing zIndex values", () => {
      for (let i = 1; i < CARD_POSITIONS.length; i++) {
        expect(CARD_POSITIONS[i].zIndex).toBeGreaterThan(
          CARD_POSITIONS[i - 1].zIndex,
        );
      }
    });

    it("should have correct position values", () => {
      expect(CARD_POSITIONS[0]).toEqual({
        x: -50,
        y: 10,
        rotation: -8,
        zIndex: 1,
      });
      expect(CARD_POSITIONS[1]).toEqual({
        x: -18,
        y: -5,
        rotation: -3,
        zIndex: 2,
      });
      expect(CARD_POSITIONS[2]).toEqual({
        x: 18,
        y: -5,
        rotation: 3,
        zIndex: 3,
      });
      expect(CARD_POSITIONS[3]).toEqual({
        x: 50,
        y: 10,
        rotation: 8,
        zIndex: 4,
      });
    });

    it("should have symmetric x positions", () => {
      expect(CARD_POSITIONS[0].x).toBe(-CARD_POSITIONS[3].x);
      expect(CARD_POSITIONS[1].x).toBe(-CARD_POSITIONS[2].x);
    });

    it("should have symmetric rotations", () => {
      expect(CARD_POSITIONS[0].rotation).toBe(-CARD_POSITIONS[3].rotation);
      expect(CARD_POSITIONS[1].rotation).toBe(-CARD_POSITIONS[2].rotation);
    });
  });

  describe("GAME_PHASES", () => {
    it("should be an object", () => {
      expect(typeof GAME_PHASES).toBe("object");
      expect(GAME_PHASES).not.toBeNull();
    });

    it("should have WAITING phase", () => {
      expect(GAME_PHASES).toHaveProperty("WAITING");
      expect(GAME_PHASES.WAITING).toBe("waiting");
    });

    it("should have DEALING phase", () => {
      expect(GAME_PHASES).toHaveProperty("DEALING");
      expect(GAME_PHASES.DEALING).toBe("dealing");
    });

    it("should have PLAYING phase", () => {
      expect(GAME_PHASES).toHaveProperty("PLAYING");
      expect(GAME_PHASES.PLAYING).toBe("playing");
    });

    it("should have EVALUATING phase", () => {
      expect(GAME_PHASES).toHaveProperty("EVALUATING");
      expect(GAME_PHASES.EVALUATING).toBe("evaluating");
    });

    it("should have GAME_OVER phase", () => {
      expect(GAME_PHASES).toHaveProperty("GAME_OVER");
      expect(GAME_PHASES.GAME_OVER).toBe("gameOver");
    });

    it("should have 5 phases", () => {
      expect(Object.keys(GAME_PHASES)).toHaveLength(5);
    });

    it("should have unique phase values", () => {
      const values = Object.values(GAME_PHASES);
      const uniqueValues = [...new Set(values)];
      expect(values.length).toBe(uniqueValues.length);
    });

    it("should have string values for all phases", () => {
      Object.values(GAME_PHASES).forEach((value) => {
        expect(typeof value).toBe("string");
      });
    });

    it("should match INITIAL_GAME_STATE phase", () => {
      expect(INITIAL_GAME_STATE.phase).toBe(GAME_PHASES.WAITING);
    });
  });

  describe("CONFETTI_COLORS", () => {
    it("should be an array", () => {
      expect(Array.isArray(CONFETTI_COLORS)).toBe(true);
    });

    it("should have 5 colors", () => {
      expect(CONFETTI_COLORS).toHaveLength(5);
    });

    it("should contain only valid hex colors", () => {
      CONFETTI_COLORS.forEach((color) => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it("should contain expected colors", () => {
      expect(CONFETTI_COLORS).toContain("#c9a227");
      expect(CONFETTI_COLORS).toContain("#dbb840");
      expect(CONFETTI_COLORS).toContain("#f0d060");
      expect(CONFETTI_COLORS).toContain("#ffffff");
      expect(CONFETTI_COLORS).toContain("#1a7360");
    });

    it("should have correct order", () => {
      expect(CONFETTI_COLORS).toEqual([
        "#c9a227",
        "#dbb840",
        "#f0d060",
        "#ffffff",
        "#1a7360",
      ]);
    });

    it("should contain only strings", () => {
      CONFETTI_COLORS.forEach((color) => {
        expect(typeof color).toBe("string");
      });
    });

    it("should have non-empty values", () => {
      CONFETTI_COLORS.forEach((color) => {
        expect(color.length).toBeGreaterThan(0);
      });
    });
  });

  describe("THEMES", () => {
    it("should be an object", () => {
      expect(typeof THEMES).toBe("object");
      expect(THEMES).not.toBeNull();
    });

    it("should have DARK theme", () => {
      expect(THEMES).toHaveProperty("DARK");
      expect(THEMES.DARK).toBe("dark");
    });

    it("should have LIGHT theme", () => {
      expect(THEMES).toHaveProperty("LIGHT");
      expect(THEMES.LIGHT).toBe("light");
    });

    it("should have 2 themes", () => {
      expect(Object.keys(THEMES)).toHaveLength(2);
    });

    it("should have unique theme values", () => {
      const values = Object.values(THEMES);
      const uniqueValues = [...new Set(values)];
      expect(values.length).toBe(uniqueValues.length);
    });

    it("should have string values for all themes", () => {
      Object.values(THEMES).forEach((value) => {
        expect(typeof value).toBe("string");
      });
    });

    it("should have lowercase values", () => {
      Object.values(THEMES).forEach((value) => {
        expect(value).toBe(value.toLowerCase());
      });
    });
  });

  describe("cross-constant consistency", () => {
    it("should have consistent player count across constants", () => {
      expect(PLAYER_COUNT).toBe(INITIAL_PLAYERS.length);
      expect(PLAYER_COUNT).toBe(INITIAL_GAME_STATE.scores.length);
      expect(PLAYER_COUNT).toBe(CARD_POSITIONS.length);
    });

    it("should have initial phase matching GAME_PHASES.WAITING", () => {
      expect(INITIAL_GAME_STATE.phase).toBe(GAME_PHASES.WAITING);
    });

    it("should have cards per player that allows full deal", () => {
      const totalCardsNeeded = CARDS_PER_PLAYER * PLAYER_COUNT;
      const deckSize = SUITS.length * 13;
      expect(totalCardsNeeded).toBeLessThanOrEqual(deckSize);
    });

    it("should have default card back pattern matching available patterns", () => {
      // Default pattern should be a known pattern
      const knownPatterns = [
        "solid",
        "checker",
        "diagonal",
        "diamond",
        "dots",
        "cross",
      ];
      expect(knownPatterns).toContain(DEFAULT_CARD_BACK_PATTERN);
    });
  });
});
