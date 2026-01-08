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
  username,
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

  const handleKeyPress = (e) => {
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
        minHeight: "calc(100vh - 120px)",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <div
        className="waiting-room-panel max-w-md p-4 sm:p-6 rounded-2xl bounce-in"
        style={{
          background:
            "linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-base) 100%)",
          border: "1px solid var(--color-border-default)",
          boxShadow: "var(--shadow-xl)",
          width: "100%",
          maxWidth: "28rem",
        }}
      >
        <h2
          className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6 game-title"
          style={{ color: "var(--color-text-gold)" }}
        >
          Waiting Room
        </h2>

        {/* Username Input Field */}
        <div className="mb-4 sm:mb-5">
          <label
            htmlFor="username-input"
            className="block text-xs font-medium uppercase tracking-wider mb-2"
            style={{ color: "var(--color-text-gold)" }}
          >
            Your Name{" "}
            <span style={{ color: "var(--color-accent-error)" }}>*</span>
          </label>
          <input
            id="username-input"
            type="text"
            value={username || ""}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter your name..."
            maxLength={20}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-all duration-200 focus:outline-none"
            style={{
              background: "var(--color-panel-dark)",
              border: showError
                ? "1px solid var(--color-accent-error)"
                : "1px solid var(--color-border-default)",
              color: "var(--color-text-primary)",
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          />
          <p
            className="text-xs mt-1.5"
            style={{ color: "var(--color-text-primary)" }}
          >
            This name will appear in scoreboards and victory messages
          </p>
        </div>

        {/* Game Rule Selection - Custom Dropdown */}
        <div className="mb-4 sm:mb-5">
          <label
            className="block text-xs font-medium uppercase tracking-wider mb-2"
            style={{ color: "var(--color-text-gold)" }}
          >
            Select Game Mode
          </label>
          <div className="relative">
            {/* Dropdown Trigger */}
            <button
              id="rule-set-select"
              type="button"
              onClick={handleToggleDropdown}
              className="w-full rounded-lg overflow-hidden flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer transition-all duration-200 hover:brightness-110"
              style={{
                background: "var(--color-panel-dark)",
                border: "1px solid var(--color-border-default)",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
              aria-haspopup="listbox"
              aria-expanded={showDropdown}
            >
              <span
                className="text-sm font-medium flex-1 text-left"
                style={{ color: "var(--color-text-primary)" }}
              >
                {currentRuleSet?.name || "Select a rule set"}
              </span>
              <FaChevronDown
                className={`transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                style={{ color: "var(--color-text-muted)", fontSize: "12px" }}
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
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200"
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
                              style={{ color: "#1a1a2e", fontSize: "10px" }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className="font-semibold text-sm transition-colors duration-200"
                            style={{
                              color:
                                selectedRuleSet === index
                                  ? "var(--color-text-gold)"
                                  : "var(--color-text-primary)",
                            }}
                          >
                            {rule.name}
                          </div>
                          <div
                            className="text-xs mt-1 leading-relaxed"
                            style={{ color: "var(--color-text-primary)" }}
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
              className="text-xs mt-1.5 flex items-center gap-1.5"
              style={{ color: "var(--color-text-primary)" }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--color-gold-base)" }}
              />
              {currentRuleSet.description}
            </p>
          )}
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="p-2 sm:p-4 rounded-xl transition-all duration-500 hover:scale-105"
              style={{
                background: "var(--color-panel-dark)",
                border:
                  index === 0
                    ? "1px solid var(--color-border-gold)"
                    : "1px solid var(--color-border-subtle)",
                boxShadow:
                  index === 0 ? "0 0 12px rgba(201, 162, 39, 0.1)" : "none",
              }}
            >
              <div className="text-center">
                <img
                  src={`https://robohash.org/${player.name}?set=set4&size=48x48`}
                  alt={player.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-lg pixel-art"
                  style={{ background: "var(--color-bg-elevated)" }}
                />
                <div
                  className="font-semibold text-xs sm:text-sm truncate"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {getPlayerDisplayName(player)}
                </div>
                <div
                  className="text-xs flex items-center justify-center gap-1 mt-1"
                  style={{ color: "var(--color-accent-success)" }}
                >
                  {index === 0 ? (
                    <FaUser className="text-xs" />
                  ) : (
                    <FaRobot className="text-xs" />
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
          className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 start-game-btn"
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
          <span>{isUsernameValid ? "Start Game" : "Enter Name to Start"}</span>
        </button>
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

WaitingRoom.defaultProps = {
  username: "",
};

export default WaitingRoom;
