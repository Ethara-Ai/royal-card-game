import { useState } from "react";
import PropTypes from "prop-types";

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

/**
 * RuleSetSelector - Dropdown component for selecting game rule sets
 * Handles its own open/close state and animations
 */
const RuleSetSelector = ({ selectedRuleSet, setSelectedRuleSet, ruleSets }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownAnimation, setDropdownAnimation] = useState(null);

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

  return (
    <div>
      <label
        className="block text-xs font-medium uppercase tracking-wider mb-2"
        style={{ color: "var(--color-text-gold)" }}
      >
        Rule Set
      </label>
      <div className="relative">
        <div
          onClick={handleToggleDropdown}
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
            className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
            style={{ fill: "var(--color-text-muted)" }}
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={closeDropdown}
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
                    onClick={() => handleSelectRule(index)}
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
  );
};

RuleSetSelector.propTypes = {
  selectedRuleSet: PropTypes.number.isRequired,
  setSelectedRuleSet: PropTypes.func.isRequired,
  ruleSets: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RuleSetSelector;
