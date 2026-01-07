/**
 * Card back pattern utilities
 * Provides pattern definitions and style generation for card backs
 */

/**
 * Available card back patterns
 */
export const cardPatterns = [
  { id: "solid", name: "Solid", description: "Plain solid color" },
  { id: "checker", name: "Checker", description: "Classic checkerboard" },
  { id: "diagonal", name: "Diagonal", description: "Diagonal stripes" },
  { id: "diamond", name: "Patchy", description: "Diamond lattice" },
  { id: "dots", name: "Dots", description: "Polka dot pattern" },
  { id: "cross", name: "Squares", description: "Cross hatch pattern" },
];

/**
 * Generates CSS background styles for a given pattern and color
 * @param {string} patternId - The pattern identifier
 * @param {string} color - The base color for the pattern
 * @returns {Object} CSS style object with backgroundImage and backgroundSize
 */
export const getPatternStyle = (patternId, color) => {
  const darkerColor = `color-mix(in srgb, ${color} 70%, black)`;
  const lighterColor = `color-mix(in srgb, ${color} 70%, white)`;

  switch (patternId) {
    case "checker":
      return {
        backgroundImage: `
          linear-gradient(45deg, ${darkerColor} 25%, transparent 25%),
          linear-gradient(-45deg, ${darkerColor} 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, ${darkerColor} 75%),
          linear-gradient(-45deg, transparent 75%, ${darkerColor} 75%)
        `,
        backgroundSize: "8px 8px",
      };
    case "diagonal":
      return {
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 3px,
          ${darkerColor} 3px,
          ${darkerColor} 6px
        )`,
        backgroundSize: "10px 10px",
      };
    case "diamond":
      return {
        backgroundImage: `
          linear-gradient(45deg, ${darkerColor} 25%, transparent 25%, transparent 75%, ${darkerColor} 75%),
          linear-gradient(45deg, ${darkerColor} 25%, transparent 25%, transparent 75%, ${darkerColor} 75%)
        `,
        backgroundSize: "10px 10px",
        backgroundPosition: "0 0, 5px 5px",
      };
    case "dots":
      return {
        backgroundImage: `radial-gradient(circle, ${lighterColor} 2px, transparent 2px)`,
        backgroundSize: "8px 8px",
      };
    case "cross":
      return {
        backgroundImage: `
          linear-gradient(${darkerColor} 1px, transparent 1px),
          linear-gradient(90deg, ${darkerColor} 1px, transparent 1px)
        `,
        backgroundSize: "6px 6px",
      };
    default:
      return {
        backgroundImage: "none",
        backgroundSize: "auto",
      };
  }
};
