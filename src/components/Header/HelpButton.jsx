import PropTypes from "prop-types";
import { FaQuestionCircle } from "react-icons/fa";

/**
 * HelpButton component - Button to open the How to Play modal
 * Matches the styling of other header buttons (ThemeToggle, SettingsPanel)
 */
const HelpButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-2 sm:p-2.5 rounded-lg transition-all duration-300 hover:scale-105"
    style={{
      background: "var(--color-panel-dark)",
      color: "var(--color-text-secondary)",
      border: "1px solid var(--color-border-subtle)",
    }}
    title="How to play"
    aria-label="How to play"
  >
    <FaQuestionCircle className="text-base sm:text-lg" />
  </button>
);

HelpButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default HelpButton;
