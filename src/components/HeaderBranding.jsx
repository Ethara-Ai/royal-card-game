import PropTypes from "prop-types";
import { FaCrown } from "react-icons/fa";

/**
 * HeaderBranding component displays the game logo and title
 * Clicking the title resets/returns to home
 */
const HeaderBranding = ({ onReset }) => (
  <h1
    onClick={onReset}
    className="text-lg sm:text-xs md:text-2xl game-title flex items-center gap-2 sm:gap-3 cursor-pointer transition-all duration-300 hover:scale-105 mr-2 sm:mr-0 min-w-0 shrink"
    title="Return to home"
  >
    <FaCrown
      className="header-crown text-base sm:text-lg md:text-xl"
      style={{ color: "var(--color-gold-light)" }}
    />
    <span className="gold-text ">Royal Card Game</span>
  </h1>
);

HeaderBranding.propTypes = {
  onReset: PropTypes.func.isRequired,
};

export default HeaderBranding;
