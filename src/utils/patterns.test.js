/**
 * Unit tests for patterns utility functions
 * Tests cardPatterns array and getPatternStyle function
 */

import { describe, it, expect } from "vitest";
import { cardPatterns, getPatternStyle } from "./patterns";

describe("patterns", () => {
  describe("cardPatterns", () => {
    it("should be an array", () => {
      expect(Array.isArray(cardPatterns)).toBe(true);
    });

    it("should have 6 pattern options", () => {
      expect(cardPatterns).toHaveLength(6);
    });

    it("should contain solid pattern", () => {
      const solidPattern = cardPatterns.find((p) => p.id === "solid");
      expect(solidPattern).toBeDefined();
      expect(solidPattern.name).toBe("Solid");
      expect(solidPattern.description).toBe("Plain solid color");
    });

    it("should contain checker pattern", () => {
      const checkerPattern = cardPatterns.find((p) => p.id === "checker");
      expect(checkerPattern).toBeDefined();
      expect(checkerPattern.name).toBe("Checker");
      expect(checkerPattern.description).toBe("Classic checkerboard");
    });

    it("should contain diagonal pattern", () => {
      const diagonalPattern = cardPatterns.find((p) => p.id === "diagonal");
      expect(diagonalPattern).toBeDefined();
      expect(diagonalPattern.name).toBe("Diagonal");
      expect(diagonalPattern.description).toBe("Diagonal stripes");
    });

    it("should contain diamond pattern", () => {
      const diamondPattern = cardPatterns.find((p) => p.id === "diamond");
      expect(diamondPattern).toBeDefined();
      expect(diamondPattern.name).toBe("Patchy");
      expect(diamondPattern.description).toBe("Diamond lattice");
    });

    it("should contain dots pattern", () => {
      const dotsPattern = cardPatterns.find((p) => p.id === "dots");
      expect(dotsPattern).toBeDefined();
      expect(dotsPattern.name).toBe("Dots");
      expect(dotsPattern.description).toBe("Polka dot pattern");
    });

    it("should contain cross pattern", () => {
      const crossPattern = cardPatterns.find((p) => p.id === "cross");
      expect(crossPattern).toBeDefined();
      expect(crossPattern.name).toBe("Squares");
      expect(crossPattern.description).toBe("Cross hatch pattern");
    });

    it("should have required properties for each pattern", () => {
      cardPatterns.forEach((pattern) => {
        expect(pattern).toHaveProperty("id");
        expect(pattern).toHaveProperty("name");
        expect(pattern).toHaveProperty("description");
        expect(typeof pattern.id).toBe("string");
        expect(typeof pattern.name).toBe("string");
        expect(typeof pattern.description).toBe("string");
      });
    });

    it("should have unique ids", () => {
      const ids = cardPatterns.map((p) => p.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it("should have unique names", () => {
      const names = cardPatterns.map((p) => p.name);
      const uniqueNames = [...new Set(names)];
      expect(names.length).toBe(uniqueNames.length);
    });

    it("should have non-empty ids", () => {
      cardPatterns.forEach((pattern) => {
        expect(pattern.id.length).toBeGreaterThan(0);
      });
    });

    it("should have non-empty names", () => {
      cardPatterns.forEach((pattern) => {
        expect(pattern.name.length).toBeGreaterThan(0);
      });
    });

    it("should have non-empty descriptions", () => {
      cardPatterns.forEach((pattern) => {
        expect(pattern.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getPatternStyle", () => {
    const testColor = "#145a4a";
    const testColorRed = "#ff0000";
    const testColorBlue = "#0000ff";

    describe("solid pattern", () => {
      it("should return backgroundImage as none for solid pattern", () => {
        const style = getPatternStyle("solid", testColor);
        expect(style.backgroundImage).toBe("none");
      });

      it("should return backgroundSize as auto for solid pattern", () => {
        const style = getPatternStyle("solid", testColor);
        expect(style.backgroundSize).toBe("auto");
      });

      it("should return consistent style regardless of color", () => {
        const style1 = getPatternStyle("solid", testColor);
        const style2 = getPatternStyle("solid", testColorRed);
        expect(style1.backgroundImage).toBe(style2.backgroundImage);
        expect(style1.backgroundSize).toBe(style2.backgroundSize);
      });
    });

    describe("checker pattern", () => {
      it("should return a backgroundImage with linear-gradient", () => {
        const style = getPatternStyle("checker", testColor);
        expect(style.backgroundImage).toContain("linear-gradient");
      });

      it("should return correct backgroundSize", () => {
        const style = getPatternStyle("checker", testColor);
        expect(style.backgroundSize).toBe("8px 8px");
      });

      it("should include 45deg and -45deg gradients", () => {
        const style = getPatternStyle("checker", testColor);
        expect(style.backgroundImage).toContain("45deg");
        expect(style.backgroundImage).toContain("-45deg");
      });

      it("should include color-mix for darker color", () => {
        const style = getPatternStyle("checker", testColor);
        expect(style.backgroundImage).toContain("color-mix");
      });

      it("should include the provided color in the color-mix", () => {
        const style = getPatternStyle("checker", testColor);
        expect(style.backgroundImage).toContain(testColor);
      });
    });

    describe("diagonal pattern", () => {
      it("should return a backgroundImage with repeating-linear-gradient", () => {
        const style = getPatternStyle("diagonal", testColor);
        expect(style.backgroundImage).toContain("repeating-linear-gradient");
      });

      it("should return correct backgroundSize", () => {
        const style = getPatternStyle("diagonal", testColor);
        expect(style.backgroundSize).toBe("10px 10px");
      });

      it("should include 45deg gradient", () => {
        const style = getPatternStyle("diagonal", testColor);
        expect(style.backgroundImage).toContain("45deg");
      });

      it("should include color-mix for darker color", () => {
        const style = getPatternStyle("diagonal", testColor);
        expect(style.backgroundImage).toContain("color-mix");
      });

      it("should include transparent sections", () => {
        const style = getPatternStyle("diagonal", testColor);
        expect(style.backgroundImage).toContain("transparent");
      });
    });

    describe("diamond pattern", () => {
      it("should return a backgroundImage with linear-gradient", () => {
        const style = getPatternStyle("diamond", testColor);
        expect(style.backgroundImage).toContain("linear-gradient");
      });

      it("should return correct backgroundSize", () => {
        const style = getPatternStyle("diamond", testColor);
        expect(style.backgroundSize).toBe("10px 10px");
      });

      it("should return correct backgroundPosition", () => {
        const style = getPatternStyle("diamond", testColor);
        expect(style.backgroundPosition).toBe("0 0, 5px 5px");
      });

      it("should include 45deg gradient", () => {
        const style = getPatternStyle("diamond", testColor);
        expect(style.backgroundImage).toContain("45deg");
      });

      it("should include color-mix for darker color", () => {
        const style = getPatternStyle("diamond", testColor);
        expect(style.backgroundImage).toContain("color-mix");
      });
    });

    describe("dots pattern", () => {
      it("should return a backgroundImage with radial-gradient", () => {
        const style = getPatternStyle("dots", testColor);
        expect(style.backgroundImage).toContain("radial-gradient");
      });

      it("should return correct backgroundSize", () => {
        const style = getPatternStyle("dots", testColor);
        expect(style.backgroundSize).toBe("8px 8px");
      });

      it("should include circle shape", () => {
        const style = getPatternStyle("dots", testColor);
        expect(style.backgroundImage).toContain("circle");
      });

      it("should include color-mix for lighter color", () => {
        const style = getPatternStyle("dots", testColor);
        expect(style.backgroundImage).toContain("color-mix");
        expect(style.backgroundImage).toContain("white");
      });

      it("should include transparent sections", () => {
        const style = getPatternStyle("dots", testColor);
        expect(style.backgroundImage).toContain("transparent");
      });
    });

    describe("cross pattern", () => {
      it("should return a backgroundImage with linear-gradient", () => {
        const style = getPatternStyle("cross", testColor);
        expect(style.backgroundImage).toContain("linear-gradient");
      });

      it("should return correct backgroundSize", () => {
        const style = getPatternStyle("cross", testColor);
        expect(style.backgroundSize).toBe("6px 6px");
      });

      it("should include 90deg gradient for horizontal lines", () => {
        const style = getPatternStyle("cross", testColor);
        expect(style.backgroundImage).toContain("90deg");
      });

      it("should include color-mix for darker color", () => {
        const style = getPatternStyle("cross", testColor);
        expect(style.backgroundImage).toContain("color-mix");
      });
    });

    describe("default/unknown pattern", () => {
      it("should return backgroundImage as none for unknown pattern", () => {
        const style = getPatternStyle("unknown", testColor);
        expect(style.backgroundImage).toBe("none");
      });

      it("should return backgroundSize as auto for unknown pattern", () => {
        const style = getPatternStyle("unknown", testColor);
        expect(style.backgroundSize).toBe("auto");
      });

      it("should handle empty string pattern id", () => {
        const style = getPatternStyle("", testColor);
        expect(style.backgroundImage).toBe("none");
        expect(style.backgroundSize).toBe("auto");
      });

      it("should handle null pattern id", () => {
        const style = getPatternStyle(null, testColor);
        expect(style.backgroundImage).toBe("none");
        expect(style.backgroundSize).toBe("auto");
      });

      it("should handle undefined pattern id", () => {
        const style = getPatternStyle(undefined, testColor);
        expect(style.backgroundImage).toBe("none");
        expect(style.backgroundSize).toBe("auto");
      });

      it("should handle numeric pattern id", () => {
        const style = getPatternStyle(123, testColor);
        expect(style.backgroundImage).toBe("none");
        expect(style.backgroundSize).toBe("auto");
      });
    });

    describe("color handling", () => {
      it("should accept hex colors", () => {
        const style = getPatternStyle("checker", "#ff0000");
        expect(style.backgroundImage).toContain("#ff0000");
      });

      it("should accept 3-digit hex colors", () => {
        const style = getPatternStyle("checker", "#f00");
        expect(style.backgroundImage).toContain("#f00");
      });

      it("should accept rgb colors", () => {
        const style = getPatternStyle("checker", "rgb(255, 0, 0)");
        expect(style.backgroundImage).toContain("rgb(255, 0, 0)");
      });

      it("should accept rgba colors", () => {
        const style = getPatternStyle("checker", "rgba(255, 0, 0, 0.5)");
        expect(style.backgroundImage).toContain("rgba(255, 0, 0, 0.5)");
      });

      it("should accept named colors", () => {
        const style = getPatternStyle("checker", "red");
        expect(style.backgroundImage).toContain("red");
      });

      it("should accept hsl colors", () => {
        const style = getPatternStyle("checker", "hsl(0, 100%, 50%)");
        expect(style.backgroundImage).toContain("hsl(0, 100%, 50%)");
      });

      it("should use darker color (70% mix with black) for most patterns", () => {
        const style = getPatternStyle("checker", testColor);
        expect(style.backgroundImage).toContain("70%");
        expect(style.backgroundImage).toContain("black");
      });

      it("should use lighter color (70% mix with white) for dots pattern", () => {
        const style = getPatternStyle("dots", testColor);
        expect(style.backgroundImage).toContain("70%");
        expect(style.backgroundImage).toContain("white");
      });
    });

    describe("return value structure", () => {
      it("should always return an object", () => {
        cardPatterns.forEach((pattern) => {
          const style = getPatternStyle(pattern.id, testColor);
          expect(typeof style).toBe("object");
          expect(style).not.toBeNull();
        });
      });

      it("should always include backgroundImage property", () => {
        cardPatterns.forEach((pattern) => {
          const style = getPatternStyle(pattern.id, testColor);
          expect(style).toHaveProperty("backgroundImage");
        });
      });

      it("should always include backgroundSize property", () => {
        cardPatterns.forEach((pattern) => {
          const style = getPatternStyle(pattern.id, testColor);
          expect(style).toHaveProperty("backgroundSize");
        });
      });

      it("should return valid CSS values", () => {
        cardPatterns.forEach((pattern) => {
          const style = getPatternStyle(pattern.id, testColor);
          expect(typeof style.backgroundImage).toBe("string");
          expect(typeof style.backgroundSize).toBe("string");
        });
      });
    });

    describe("integration with cardPatterns", () => {
      it("should generate valid styles for all defined patterns", () => {
        cardPatterns.forEach((pattern) => {
          const style = getPatternStyle(pattern.id, testColor);
          expect(style).toBeDefined();
          expect(style.backgroundImage).toBeDefined();
          expect(style.backgroundSize).toBeDefined();
        });
      });

      it("should produce different styles for different patterns", () => {
        const styles = cardPatterns.map((pattern) =>
          getPatternStyle(pattern.id, testColor),
        );

        // Compare each style with others
        for (let i = 0; i < styles.length; i++) {
          for (let j = i + 1; j < styles.length; j++) {
            // At least one property should be different
            const isDifferent =
              styles[i].backgroundImage !== styles[j].backgroundImage ||
              styles[i].backgroundSize !== styles[j].backgroundSize;
            expect(isDifferent).toBe(true);
          }
        }
      });

      it("should produce same style for same pattern and color", () => {
        cardPatterns.forEach((pattern) => {
          const style1 = getPatternStyle(pattern.id, testColor);
          const style2 = getPatternStyle(pattern.id, testColor);
          expect(style1).toEqual(style2);
        });
      });

      it("should produce different styles for same pattern with different colors", () => {
        // Excluding solid pattern as it doesn't use color
        const nonSolidPatterns = cardPatterns.filter((p) => p.id !== "solid");

        nonSolidPatterns.forEach((pattern) => {
          const style1 = getPatternStyle(pattern.id, testColorRed);
          const style2 = getPatternStyle(pattern.id, testColorBlue);
          expect(style1.backgroundImage).not.toBe(style2.backgroundImage);
        });
      });
    });
  });
});
