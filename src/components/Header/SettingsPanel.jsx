import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FaCog, FaTimes, FaRedo } from "react-icons/fa";
import { useCardCustomization } from "../../context";
import RuleSetSelector from "./RuleSetSelector";
import CardColorPicker from "./CardColorPicker";
import CardPatternPicker from "./CardPatternPicker";

/**
 * SettingsPanel - Collapsible settings menu with game options
 * Manages card customization, rule selection, and game reset
 */
const SettingsPanel = ({ selectedRuleSet, setSelectedRuleSet, ruleSets, resetGame }) => {
  const settingsRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsFadeState, setSettingsFadeState] = useState("in");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const {
    cardBackColor,
    setCardBackColor,
    cardBackPattern,
    setCardBackPattern,
  } = useCardCustomization();

  // Close settings when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSettingsClick = () => {
    if (!showSettings) {
      setShowSettings(true);
      setSettingsFadeState("in");
    } else {
      setSettingsFadeState("out");
      setTimeout(() => {
        setShowSettings(false);
      }, 200);
    }
  };

  return (
    <div className="relative" ref={settingsRef}>
      <button
        onClick={handleSettingsClick}
        className="p-2 sm:p-2.5 rounded-lg transition-all duration-300 hover:scale-105"
        style={{
          background: "var(--color-panel-dark)",
          color: "var(--color-text-secondary)",
          border: "1px solid var(--color-border-subtle)",
        }}
        aria-label={showSettings ? "Close settings" : "Open settings"}
      >
        {showSettings ? (
          <FaTimes className="text-base sm:text-lg transition-transform transform hover:rotate-90 duration-300" />
        ) : (
          <FaCog className="text-base sm:text-lg" />
        )}
      </button>

      {showSettings && (
        <div
          className={`settings-menu absolute right-0 w-56 sm:w-64 rounded-xl overflow-hidden ${
            settingsFadeState === "in"
              ? "settings-fade-in"
              : "settings-fade-out"
          }`}
          style={{
            top: "100%",
            marginTop: "8px",
            maxHeight: "calc(100vh - 80px)",
            overflowY: "auto",
            background: "var(--color-panel-base)",
            border: "1px solid var(--color-border-default)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            <RuleSetSelector
              selectedRuleSet={selectedRuleSet}
              setSelectedRuleSet={setSelectedRuleSet}
              ruleSets={ruleSets}
            />

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

            <button
              onClick={resetGame}
              className="w-full px-3 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm reset-game-btn"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-gold-base) 0%, var(--color-gold-dark) 100%)",
                color: "var(--color-bg)",
              }}
            >
              <FaRedo className="text-xs" /> Reset Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

SettingsPanel.propTypes = {
  selectedRuleSet: PropTypes.number.isRequired,
  setSelectedRuleSet: PropTypes.func.isRequired,
  ruleSets: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  resetGame: PropTypes.func.isRequired,
};

export default SettingsPanel;
