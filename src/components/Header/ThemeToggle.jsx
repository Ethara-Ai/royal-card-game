import PropTypes from "prop-types";
import { FaMoon, FaSun } from "react-icons/fa";

/**
 * Theme toggle button component
 * Switches between dark and light themes
 */
const ThemeToggle = ({ theme, onToggle }) => {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onToggle}
      className="p-2 sm:p-2.5 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
      style={{
        background: "var(--color-panel-dark)",
        color: "var(--color-text-secondary)",
        border: "1px solid var(--color-border-subtle)",
      }}
      title={isDark ? "Switch to warm mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to warm mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <FaSun
          className="text-base sm:text-lg"
          style={{ color: "var(--color-gold-light)" }}
        />
      ) : (
        <FaMoon
          className="text-base sm:text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        />
      )}
    </button>
  );
};

ThemeToggle.propTypes = {
  theme: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ThemeToggle;
