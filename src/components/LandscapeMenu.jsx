import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaQuestionCircle,
  FaRedo,
  FaCrown,
} from "react-icons/fa";
import { useCardCustomization } from "../context";
import CardColorPicker from "./CardColorPicker";
import CardPatternPicker from "./CardPatternPicker";

const LandscapeMenu = ({
  theme,
  toggleTheme,
  ruleSets,
  selectedRuleSet,
  setSelectedRuleSet,
  resetGame,
  onHelpClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const menuRef = useRef(null);

  const {
    cardBackColor,
    setCardBackColor,
    cardBackPattern,
    setCardBackPattern,
  } = useCardCustomization();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuAction = (action) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="landscape-menu-container" ref={menuRef}>
      <button
        className="landscape-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {isOpen && (
        <div className="landscape-menu-panel">
          <div className="landscape-menu-header">
            <FaCrown className="landscape-menu-crown" />
            <span className="landscape-menu-title">Menu</span>
          </div>

          <div className="landscape-menu-content">
            <button
              className="landscape-menu-item"
              onClick={() => handleMenuAction(onHelpClick)}
            >
              <FaQuestionCircle className="landscape-menu-icon" />
              <span>How to Play</span>
            </button>

            <button
              className="landscape-menu-item"
              onClick={() => handleMenuAction(toggleTheme)}
            >
              {theme === "dark" ? (
                <FaSun className="landscape-menu-icon" />
              ) : (
                <FaMoon className="landscape-menu-icon" />
              )}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>

            <div className="landscape-menu-divider" />

            <div className="landscape-menu-section">
              <span className="landscape-menu-section-title">Game Rules</span>
              <div className="landscape-menu-rules">
                {ruleSets.map((rule, index) => (
                  <button
                    key={rule.id}
                    className={`landscape-menu-rule ${selectedRuleSet === index ? "active" : ""}`}
                    onClick={() => setSelectedRuleSet(index)}
                  >
                    {rule.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="landscape-menu-divider" />

            <div className="landscape-menu-section">
              <span className="landscape-menu-section-title">Card Back</span>
              <CardColorPicker
                color={cardBackColor}
                onChange={setCardBackColor}
                isOpen={isColorPickerOpen}
                onToggle={() => setIsColorPickerOpen(!isColorPickerOpen)}
              />
              <CardPatternPicker
                cardBackColor={cardBackColor}
                cardBackPattern={cardBackPattern}
                setCardBackPattern={setCardBackPattern}
              />
            </div>

            <div className="landscape-menu-divider" />

            <button
              className="landscape-menu-reset"
              onClick={() => handleMenuAction(resetGame)}
            >
              <FaRedo className="landscape-menu-icon" />
              <span>Reset Game</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

LandscapeMenu.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  ruleSets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectedRuleSet: PropTypes.number.isRequired,
  setSelectedRuleSet: PropTypes.func.isRequired,
  resetGame: PropTypes.func.isRequired,
  onHelpClick: PropTypes.func.isRequired,
};

export default LandscapeMenu;
