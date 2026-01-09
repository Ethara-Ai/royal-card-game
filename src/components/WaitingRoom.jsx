import { useState } from "react";
import PropTypes from "prop-types";
import {
  FaPlay,
  FaUser,
  FaRobot,
  FaChevronDown,
  FaCheck,
} from "react-icons/fa";
import { getPlayerDisplayName } from "../utils/playerUtils";
import { sanitizeUsername } from "../utils/sanitize";

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

const WaitingRoom = ({
  players,
  startGame,
  username = "",
  setUsername,
  ruleSets,
  selectedRuleSet,
  setSelectedRuleSet,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownAnimation, setDropdownAnimation] = useState(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const isUsernameValid = (username || "").trim().length > 0;
  const showError = hasAttemptedSubmit && !isUsernameValid;

  const handleInputChange = (e) => {
    const sanitized = sanitizeUsername(e.target.value, {
      maxLength: 20,
      allowSpaces: true,
      allowNumbers: true,
      allowSpecialChars: false,
    });
    setUsername(sanitized);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setHasAttemptedSubmit(true);
      if (isUsernameValid) {
        startGame();
      }
    }
  };

  const handleToggleDropdown = () => {
    if (showDropdown) {
      setDropdownAnimation("out");
      setTimeout(() => {
        setShowDropdown(false);
        setDropdownAnimation(null);
      }, 200);
    } else {
      setShowDropdown(true);
      setDropdownAnimation("in");
    }
  };

  const handleSelectRule = (index) => {
    setSelectedRuleSet(index);
    setDropdownAnimation("out");
    setTimeout(() => {
      setShowDropdown(false);
      setDropdownAnimation(null);
    }, 200);
  };

  const closeDropdown = () => {
    setDropdownAnimation("out");
    setTimeout(() => {
      setShowDropdown(false);
      setDropdownAnimation(null);
    }, 200);
  };

  const currentRuleSet = ruleSets[selectedRuleSet] || ruleSets[0];

  return (
    <div
      className="waiting-room-container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        minHeight: "calc(100dvh - 120px)",
        padding: "clamp(0.5rem, 2vh, 1rem)",
        paddingTop:
          "max(clamp(0.5rem, 2vh, 1rem), env(safe-area-inset-top, 0px))",
        paddingBottom:
          "max(clamp(0.5rem, 2vh, 1rem), env(safe-area-inset-bottom, 0px))",
        boxSizing: "border-box",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Parent container: clips content with border-radius + overflow:hidden */}
      <div
        className="waiting-room-wrapper max-w-md rounded-2xl overflow-hidden bounce-in"
        style={{
          background:
            "linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-base) 100%)",
          border: "1px solid var(--color-border-default)",
          boxShadow: "var(--shadow-xl)",
          width: "100%",
          maxWidth: "24rem",
          maxHeight:
            "calc(100dvh - 100px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* Child container: handles scrolling inside the clipped area */}
        <div
          className="waiting-room-panel w-full h-full overflow-y-auto overflow-x-hidden"
          style={{
            padding: "clamp(1rem, 2.5vh, 1.5rem) clamp(1.25rem, 3vw, 1.5rem)",
            maxHeight:
              "calc(100dvh - 100px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <h2
            className="font-semibold text-center game-title"
            style={{
              color: "var(--color-text-gold)",
              fontSize: "clamp(1.375rem, 3vh, 1.5rem)",
              marginBottom: "clamp(0.75rem, 2vh, 1.5rem)",
            }}
          >
            Waiting Room
          </h2>

          {/* Username Input Field */}
          <div style={{ marginBottom: "clamp(0.75rem, 1.5vh, 1.25rem)" }}>
            <label
              htmlFor="username-input"
              className="block font-medium uppercase tracking-wider"
              style={{
                color: "var(--color-text-gold)",
                fontSize: "clamp(0.75rem, 1.4vh, 0.8125rem)",
                marginBottom: "clamp(0.375rem, 0.8vh, 0.5rem)",
              }}
            >
              Your Name{" "}
              <span style={{ color: "var(--color-accent-error)" }}>*</span>
            </label>
            <input
              id="username-input"
              type="text"
              value={username || ""}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your name..."
              maxLength={20}
              className="w-full rounded-lg transition-all duration-200 focus:outline-none"
              style={{
                background: "var(--color-panel-dark)",
                border: showError
                  ? "1px solid var(--color-accent-error)"
                  : "1px solid var(--color-border-default)",
                color: "var(--color-text-primary)",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                padding:
                  "clamp(0.625rem, 1.4vh, 0.75rem) clamp(0.75rem, 1.5vw, 1rem)",
                fontSize: "clamp(0.9375rem, 1.8vh, 1rem)",
              }}
            />
            <p
              style={{
                color: "var(--color-text-primary)",
                fontSize: "clamp(0.75rem, 1.3vh, 0.8125rem)",
                marginTop: "clamp(0.25rem, 0.5vh, 0.375rem)",
                lineHeight: "1.4",
              }}
            >
              This name will appear in scoreboards and victory messages
            </p>
          </div>

          {/* Game Rule Selection - Custom Dropdown */}
          <div style={{ marginBottom: "clamp(0.75rem, 1.5vh, 1.25rem)" }}>
            <label
              className="block font-medium uppercase tracking-wider"
              style={{
                color: "var(--color-text-gold)",
                fontSize: "clamp(0.75rem, 1.4vh, 0.8125rem)",
                marginBottom: "clamp(0.375rem, 0.8vh, 0.5rem)",
              }}
            >
              Select Game Mode
            </label>
            <div className="relative">
              {/* Dropdown Trigger */}
              <button
                id="rule-set-select"
                type="button"
                onClick={handleToggleDropdown}
                className="w-full rounded-lg overflow-hidden flex items-center gap-2 cursor-pointer transition-all duration-200 hover:brightness-110"
                style={{
                  background: "var(--color-panel-dark)",
                  border: "1px solid var(--color-border-default)",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                  padding:
                    "clamp(0.625rem, 1.4vh, 0.75rem) clamp(0.75rem, 1.5vw, 1rem)",
                }}
                aria-haspopup="listbox"
                aria-expanded={showDropdown}
              >
                <span
                  className="font-medium flex-1 text-left"
                  style={{
                    color: "var(--color-text-primary)",
                    fontSize: "clamp(0.9375rem, 1.8vh, 1rem)",
                  }}
                >
                  {currentRuleSet?.name || "Select a rule set"}
                </span>
                <FaChevronDown
                  className={`transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "clamp(0.625rem, 1.1vh, 0.75rem)",
                  }}
                />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={closeDropdown}
                    aria-hidden="true"
                  />
                  <div className="absolute z-50 w-full mt-2">
                    <div
                      className={`w-full rounded-xl overflow-hidden ${getDropdownAnimationClass(dropdownAnimation)}`}
                      style={{
                        background:
                          "linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-base) 100%)",
                        border: "1px solid var(--color-border-gold)",
                        boxShadow:
                          "var(--shadow-xl), 0 0 20px rgba(201, 162, 39, 0.15)",
                      }}
                      role="listbox"
                    >
                      {ruleSets.map((rule, index) => (
                        <button
                          key={rule.id}
                          onClick={() => handleSelectRule(index)}
                          className="w-full px-4 py-3 text-left transition-all duration-200 border-b last:border-b-0 flex items-start gap-3 group"
                          style={{
                            background:
                              selectedRuleSet === index
                                ? "linear-gradient(90deg, rgba(201, 162, 39, 0.15) 0%, transparent 100%)"
                                : "transparent",
                            borderColor: "var(--color-border-subtle)",
                          }}
                          role="option"
                          aria-selected={selectedRuleSet === index}
                        >
                          {/* Selection indicator */}
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200"
                            style={{
                              background:
                                selectedRuleSet === index
                                  ? "linear-gradient(135deg, var(--color-gold-base) 0%, var(--color-gold-dark) 100%)"
                                  : "var(--color-panel-dark)",
                              border:
                                selectedRuleSet === index
                                  ? "none"
                                  : "1px solid var(--color-border-subtle)",
                              boxShadow:
                                selectedRuleSet === index
                                  ? "0 0 8px rgba(201, 162, 39, 0.4)"
                                  : "none",
                            }}
                          >
                            {selectedRuleSet === index && (
                              <FaCheck
                                style={{
                                  color: "#1a1a1a",
                                  fontSize: "clamp(0.5rem, 1vh, 0.625rem)",
                                }}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className="font-semibold transition-colors duration-200"
                              style={{
                                color:
                                  selectedRuleSet === index
                                    ? "var(--color-text-gold)"
                                    : "var(--color-text-primary)",
                                fontSize: "clamp(0.8125rem, 1.5vh, 0.9375rem)",
                              }}
                            >
                              {rule.name}
                            </div>
                            <div
                              className="mt-1 leading-relaxed"
                              style={{
                                color: "var(--color-text-primary)",
                                fontSize: "clamp(0.75rem, 1.3vh, 0.8125rem)",
                              }}
                            >
                              {rule.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* Current rule description shown below dropdown when closed */}
            {!showDropdown && currentRuleSet && (
              <p
                style={{
                  color: "var(--color-text-primary)",
                  fontSize: "clamp(0.75rem, 1.3vh, 0.8125rem)",
                  marginTop: "clamp(0.25rem, 0.5vh, 0.375rem)",
                  lineHeight: "1.4",
                }}
              >
                {currentRuleSet.description}
              </p>
            )}
          </div>

          {/* Players Grid */}
          <div
            className="grid grid-cols-2"
            style={{
              gap: "clamp(0.5rem, 1.2vh, 0.75rem)",
              marginBottom: "clamp(0.75rem, 1.5vh, 1.5rem)",
            }}
          >
            {players.map((player, index) => (
              <div
                key={player.id}
                className="rounded-xl transition-all duration-500 hover:scale-105"
                style={{
                  background: "var(--color-panel-dark)",
                  border:
                    index === 0
                      ? "1px solid var(--color-border-gold)"
                      : "1px solid var(--color-border-subtle)",
                  boxShadow:
                    index === 0 ? "0 0 12px rgba(201, 162, 39, 0.1)" : "none",
                  padding: "clamp(0.5rem, 1.2vh, 1rem)",
                }}
              >
                <div className="text-center">
                  <img
                    src={`https://robohash.org/${player.name}?set=set4&size=48x48`}
                    alt={player.name}
                    className="mx-auto rounded-lg pixel-art"
                    style={{
                      background: "var(--color-bg-elevated)",
                      width: "clamp(2.5rem, 5vh, 3rem)",
                      height: "clamp(2.5rem, 5vh, 3rem)",
                      marginBottom: "clamp(0.375rem, 0.8vh, 0.5rem)",
                    }}
                  />
                  <div
                    className="font-medium truncate"
                    style={{
                      color: "var(--color-text-primary)",
                      fontSize: "clamp(0.8125rem, 1.5vh, 0.9375rem)",
                    }}
                  >
                    {getPlayerDisplayName(player)}
                  </div>
                  <div
                    className="flex items-center justify-center gap-1 font-normal"
                    style={{
                      color: "var(--color-accent-success)",
                      fontSize: "clamp(0.75rem, 1.3vh, 0.8125rem)",
                      marginTop: "clamp(0.1875rem, 0.4vh, 0.25rem)",
                    }}
                  >
                    {index === 0 ? (
                      <FaUser
                        style={{ fontSize: "clamp(0.625rem, 1.1vh, 0.75rem)" }}
                      />
                    ) : (
                      <FaRobot
                        style={{ fontSize: "clamp(0.625rem, 1.1vh, 0.75rem)" }}
                      />
                    )}
                    Ready
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Start Game Button */}
          <button
            onClick={() => {
              setHasAttemptedSubmit(true);
              if (isUsernameValid) {
                startGame();
              }
            }}
            disabled={false}
            className="w-full rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 start-game-btn"
            style={{
              background: isUsernameValid
                ? "linear-gradient(135deg, var(--color-felt-light) 0%, var(--color-felt-base) 100%)"
                : "var(--color-panel-dark)",
              color: isUsernameValid ? "#ffffff" : "var(--color-text-muted)",
              boxShadow: isUsernameValid
                ? "var(--shadow-md), var(--shadow-glow-success)"
                : "none",
              cursor: isUsernameValid ? "pointer" : "not-allowed",
              opacity: isUsernameValid ? 1 : 0.6,
              transform: "scale(1)",
              border: isUsernameValid
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid var(--color-border-subtle)",
              padding:
                "clamp(0.625rem, 1.4vh, 0.875rem) clamp(0.75rem, 1.5vw, 1rem)",
              fontSize: "clamp(0.9375rem, 1.8vh, 1rem)",
            }}
            onMouseEnter={(e) => {
              if (isUsernameValid) {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "var(--shadow-lg), var(--shadow-glow-success), 0 0 20px rgba(26, 115, 96, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              if (isUsernameValid) {
                e.currentTarget.style.boxShadow =
                  "var(--shadow-md), var(--shadow-glow-success)";
              }
            }}
          >
            <FaPlay className="text-sm" />
            <span>
              {isUsernameValid ? "Start Game" : "Enter Name to Start"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

WaitingRoom.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  startGame: PropTypes.func.isRequired,
  username: PropTypes.string,
  setUsername: PropTypes.func.isRequired,
  ruleSets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectedRuleSet: PropTypes.number.isRequired,
  setSelectedRuleSet: PropTypes.func.isRequired,
};

export default WaitingRoom;
