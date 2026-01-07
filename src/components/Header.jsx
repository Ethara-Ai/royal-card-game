import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaCrown, FaCog, FaTimes, FaMoon, FaSun, FaRedo } from "react-icons/fa";
import { HexColorPicker } from "react-colorful";
import { cardPatterns, getPatternStyle } from "../utils/patterns";

/**
 * Returns the appropriate CSS class for dropdown animation state
 * @param {string|null} animationState - Current animation state ('in', 'out', or null)
 * @returns {string} CSS class name
 */
const getDropdownAnimationClass = (animationState) => {
  if (animationState === "in") return "dropdown-slide-in";
  if (animationState === "out") return "dropdown-slide-out";
  return "";
};

const Header = ({
  theme,
  toggleTheme,
  cardBackColor,
  setCardBackColor,
  cardBackPattern,
  setCardBackPattern,
  selectedRuleSet,
  setSelectedRuleSet,
  ruleSets,
  resetGame,
}) => {
  const settingsRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsFadeState, setSettingsFadeState] = useState("in");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isPatternOpen, setIsPatternOpen] = useState(false);
  const [showRuleDropdown, setShowRuleDropdown] = useState(false);
  const [dropdownAnimation, setDropdownAnimation] = useState(null);

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
    <div
      className="header-container p-3 sm:p-4 relative z-50"
      style={{
        background:
          "linear-gradient(180deg, var(--color-bg-elevated) 0%, var(--color-bg-surface) 100%)",
        borderBottom: "1px solid var(--color-border-subtle)",
      }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between">
        <h1
          onClick={resetGame}
          className="text-lg sm:text-xl md:text-2xl game-title flex items-center gap-2 sm:gap-3 cursor-pointer transition-all duration-300 hover:scale-105"
          title="Return to home"
        >
          <FaCrown
            className="header-crown text-base sm:text-lg md:text-xl"
            style={{ color: "var(--color-gold-light)" }}
          />
          <span className="gold-text whitespace-nowrap">Royal Card Game</span>
        </h1>

        <div className="flex items-center gap-1.5 sm:gap-2" ref={settingsRef}>
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-lg transition-all duration-300 hover:scale-105"
            style={{
              background: "var(--color-panel-dark)",
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border-subtle)",
            }}
            title={
              theme === "dark" ? "Switch to warm mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
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

          <div className="relative">
            <button
              onClick={handleSettingsClick}
              className="p-2 sm:p-2.5 rounded-lg transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--color-panel-dark)",
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-border-subtle)",
              }}
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
                  <div>
                    <label
                      className="block text-xs font-medium uppercase tracking-wider mb-2"
                      style={{ color: "var(--color-text-gold)" }}
                    >
                      Rule Set
                    </label>
                    <div className="relative">
                      <div
                        onClick={() => {
                          if (showRuleDropdown) {
                            setDropdownAnimation("out");
                            setTimeout(() => {
                              setShowRuleDropdown(false);
                              setDropdownAnimation(null);
                            }, 200);
                          } else {
                            setShowRuleDropdown(true);
                            setDropdownAnimation("in");
                          }
                        }}
                        className="rounded-lg overflow-hidden flex items-center gap-2 p-2 cursor-pointer"
                        style={{
                          background: "var(--color-panel-dark)",
                          border: "1px solid var(--color-border-default)",
                        }}
                      >
                        <span
                          className="text-sm font-medium flex-1"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {ruleSets[selectedRuleSet].name}
                        </span>
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${showRuleDropdown ? "rotate-180" : ""}`}
                          style={{ fill: "var(--color-text-muted)" }}
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                      {showRuleDropdown && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => {
                              setDropdownAnimation("out");
                              setTimeout(() => {
                                setShowRuleDropdown(false);
                                setDropdownAnimation(null);
                              }, 200);
                            }}
                          />
                          <div className="absolute z-50 w-full mt-1">
                            <div
                              className={`w-full rounded-lg overflow-hidden ${getDropdownAnimationClass(dropdownAnimation)}`}
                              style={{
                                background: "var(--color-panel-dark)",
                                border: "1px solid var(--color-border-default)",
                                boxShadow: "var(--shadow-lg)",
                              }}
                            >
                              {ruleSets.map((rule, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setSelectedRuleSet(index);
                                    setDropdownAnimation("out");
                                    setTimeout(() => {
                                      setShowRuleDropdown(false);
                                      setDropdownAnimation(null);
                                    }, 200);
                                  }}
                                  className="w-full px-3 py-2 text-sm text-left transition-all duration-200 border-b last:border-b-0"
                                  style={{
                                    background:
                                      selectedRuleSet === index
                                        ? "var(--color-panel-hover)"
                                        : "transparent",
                                    color: "var(--color-text-primary)",
                                    borderColor: "var(--color-border-subtle)",
                                  }}
                                >
                                  <div className="font-medium">{rule.name}</div>
                                  <div
                                    className="text-xs mt-0.5"
                                    style={{ color: "var(--color-text-gold)" }}
                                  >
                                    {rule.description}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium uppercase tracking-wider mb-2"
                      style={{ color: "var(--color-text-gold)" }}
                    >
                      Card Back Color
                    </label>
                    <div
                      className="rounded-lg overflow-hidden flex items-center gap-2 p-2 cursor-pointer"
                      onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                      style={{
                        background: "var(--color-panel-dark)",
                        border: "1px solid var(--color-border-default)",
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded flex-shrink-0"
                        style={{
                          backgroundColor: cardBackColor,
                          border: "2px solid var(--color-border-strong)",
                        }}
                      />
                      <span
                        className="text-sm font-medium flex-1"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {cardBackColor.toUpperCase()}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isColorPickerOpen ? "rotate-180" : ""}`}
                        style={{ fill: "var(--color-text-muted)" }}
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                    {isColorPickerOpen && (
                      <div
                        className="mt-2 p-2 rounded-lg"
                        style={{
                          background: "var(--color-panel-dark)",
                          border: "1px solid var(--color-border-default)",
                        }}
                      >
                        <HexColorPicker
                          color={cardBackColor}
                          onChange={setCardBackColor}
                          style={{ width: "100%", height: "120px" }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium uppercase tracking-wider mb-2"
                      style={{ color: "var(--color-text-gold)" }}
                    >
                      Card Pattern
                    </label>
                    <div
                      className="rounded-lg overflow-hidden flex items-center gap-2 p-2 cursor-pointer"
                      onClick={() => setIsPatternOpen(!isPatternOpen)}
                      style={{
                        background: "var(--color-panel-dark)",
                        border: "1px solid var(--color-border-default)",
                      }}
                    >
                      <div
                        className="w-5 h-7 rounded flex-shrink-0 pattern-preview"
                        style={{
                          backgroundColor: cardBackColor,
                          border: "1px solid var(--color-border-strong)",
                          backgroundImage: getPatternStyle(
                            cardBackPattern,
                            cardBackColor
                          ).backgroundImage,
                          backgroundSize: getPatternStyle(
                            cardBackPattern,
                            cardBackColor
                          ).backgroundSize,
                        }}
                      />
                      <span
                        className="text-sm font-medium flex-1"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {cardPatterns.find((p) => p.id === cardBackPattern)
                          ?.name || "Solid"}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isPatternOpen ? "rotate-180" : ""}`}
                        style={{ fill: "var(--color-text-muted)" }}
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                    {isPatternOpen && (
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
                              setIsPatternOpen(false);
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
                                backgroundImage: getPatternStyle(
                                  pattern.id,
                                  cardBackColor
                                ).backgroundImage,
                                backgroundSize: getPatternStyle(
                                  pattern.id,
                                  cardBackColor
                                ).backgroundSize,
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
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  cardBackColor: PropTypes.string.isRequired,
  setCardBackColor: PropTypes.func.isRequired,
  cardBackPattern: PropTypes.string.isRequired,
  setCardBackPattern: PropTypes.func.isRequired,
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

export default Header;
