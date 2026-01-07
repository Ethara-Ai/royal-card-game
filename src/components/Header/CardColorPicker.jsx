import PropTypes from "prop-types";
import { HexColorPicker } from "react-colorful";

/**
 * Card back color picker component
 * Allows users to select a custom color for card backs
 */
const CardColorPicker = ({ color, onChange, isOpen, onToggle }) => (
  <div>
    <label
      className="block text-xs font-medium uppercase tracking-wider mb-2"
      style={{ color: "var(--color-text-gold)" }}
    >
      Card Back Color
    </label>
    <div
      className="rounded-lg overflow-hidden flex items-center gap-2 p-2 cursor-pointer"
      onClick={onToggle}
      style={{
        background: "var(--color-panel-dark)",
        border: "1px solid var(--color-border-default)",
      }}
    >
      <div
        className="w-5 h-5 rounded shrink-0"
        style={{
          backgroundColor: color,
          border: "2px solid var(--color-border-strong)",
        }}
      />
      <span
        className="text-sm font-medium flex-1"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {color.toUpperCase()}
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
        className="mt-2 p-2 rounded-lg"
        style={{
          background: "var(--color-panel-dark)",
          border: "1px solid var(--color-border-default)",
        }}
      >
        <HexColorPicker
          color={color}
          onChange={onChange}
          style={{ width: "100%", height: "120px" }}
        />
      </div>
    )}
  </div>
);

CardColorPicker.propTypes = {
  color: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default CardColorPicker;
