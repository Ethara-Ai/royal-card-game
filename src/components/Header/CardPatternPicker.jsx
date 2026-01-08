import { useState } from "react";
import PropTypes from "prop-types";
import { cardPatterns, getPatternStyle } from "../../utils/patterns";

/**
 * Card pattern picker component for selecting card back patterns
 * Displays available patterns in a dropdown grid
 */
const CardPatternPicker = ({
  cardBackColor,
  cardBackPattern,
  setCardBackPattern,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentPattern = cardPatterns.find((p) => p.id === cardBackPattern);

  return (
    <div>
      <label
        className="block text-xs font-medium uppercase tracking-wider mb-2"
        style={{ color: "var(--color-text-gold)" }}
      >
        Card Pattern
      </label>
      <div
        className="rounded-lg overflow-hidden flex items-center gap-2 p-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "var(--color-panel-dark)",
          border: "1px solid var(--color-border-default)",
        }}
      >
        <div
          className="w-5 h-7 rounded shrink-0 pattern-preview"
          style={{
            backgroundColor: cardBackColor,
            border: "1px solid var(--color-border-strong)",
            backgroundImage: getPatternStyle(cardBackPattern, cardBackColor)
              .backgroundImage,
            backgroundSize: getPatternStyle(cardBackPattern, cardBackColor)
              .backgroundSize,
          }}
        />
        <span
          className="text-sm font-medium flex-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {currentPattern?.name || "Solid"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ fill: "var(--color-text-muted)" }}
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
      {isOpen && (
        <div
          className="mt-2 rounded-lg grid grid-cols-3 gap-2 p-2"
          style={{
            background: "var(--color-panel-dark)",
            border: "1px solid var(--color-border-default)",
          }}
        >
          {cardPatterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => {
                setCardBackPattern(pattern.id);
                setIsOpen(false);
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                background:
                  cardBackPattern === pattern.id
                    ? "var(--color-panel-hover)"
                    : "transparent",
                border:
                  cardBackPattern === pattern.id
                    ? "1px solid var(--color-border-gold)"
                    : "1px solid transparent",
              }}
            >
              <div
                className="w-8 h-10 rounded"
                style={{
                  backgroundColor: cardBackColor,
                  border: "1px solid var(--color-border-default)",
                  backgroundImage: getPatternStyle(pattern.id, cardBackColor)
                    .backgroundImage,
                  backgroundSize: getPatternStyle(pattern.id, cardBackColor)
                    .backgroundSize,
                }}
              />
              <span
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {pattern.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

CardPatternPicker.propTypes = {
  cardBackColor: PropTypes.string.isRequired,
  cardBackPattern: PropTypes.string.isRequired,
  setCardBackPattern: PropTypes.func.isRequired,
};

export default CardPatternPicker;
