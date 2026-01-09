import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { FaLightbulb, FaHandPointer } from "react-icons/fa";

/**
 * TurnInstructionOverlay component - Shows turn instructions at the start of each turn
 * Displays the current rule set and basic instructions with a blur overlay
 * Disappears only when player taps on the overlay
 *
 * Theme Compliance:
 * - Uses CSS variables for all colors (supports light/dark themes)
 * - Background uses theme surface color with backdrop blur
 * - Text colors use theme text variables for proper contrast
 * - Border and shadow use theme-aware variables
 * - Meets WCAG AA contrast requirements in both themes
 */
const TurnInstructionOverlay = ({
  visible,
  ruleSetName,
  ruleSetDescription,
  onDismiss,
}) => {
  const [showState, setShowState] = useState("hidden"); // "hidden" | "visible" | "exiting"
  const timersRef = useRef({ show: null, exit: null });
  const lastVisibleRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    Object.values(timersRef.current).forEach((timer) => {
      if (timer) clearTimeout(timer);
    });
    timersRef.current = { show: null, exit: null };
  }, []);

  const handleDismiss = useCallback(() => {
    if (showState === "visible") {
      setShowState("exiting");
      clearAllTimers();
      timersRef.current.exit = setTimeout(() => {
        setShowState("hidden");
        if (onDismiss) onDismiss();
      }, 300);
    }
  }, [showState, onDismiss, clearAllTimers]);

  // Handle visibility prop changes
  useEffect(() => {
    const wasVisible = lastVisibleRef.current;
    lastVisibleRef.current = visible;

    // Becoming visible - start show sequence
    if (visible && !wasVisible) {
      clearAllTimers();
      // Use setTimeout to avoid synchronous setState
      timersRef.current.show = setTimeout(() => {
        setShowState("visible");
      }, 200);
    }

    // Becoming hidden - reset with minimal delay to avoid sync setState
    if (!visible && wasVisible) {
      clearAllTimers();
      setTimeout(() => {
        setShowState("hidden");
      }, 0);
    }

    return clearAllTimers;
  }, [visible, onDismiss, clearAllTimers]);

  // Cleanup on unmount
  useEffect(() => clearAllTimers, [clearAllTimers]);

  if (showState === "hidden") return null;

  const isExiting = showState === "exiting";
  const animationClass = isExiting ? "exiting" : "entering";

  return (
    <div
      className={`turn-instruction-backdrop ${animationClass}`}
      onClick={handleDismiss}
      onTouchEnd={handleDismiss}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleDismiss();
      }}
      aria-label="Tap to dismiss and start your turn"
    >
      {/* Blur overlay for the game */}
      <div className="turn-instruction-blur" aria-hidden="true" />

      {/* Main instruction content */}
      <div
        className={`turn-instruction-overlay ${animationClass}`}
        role="status"
        aria-live="polite"
        aria-label={`Your turn. ${ruleSetName || "Highest Card Wins"}. ${ruleSetDescription || "Play your highest value card to win the trick"}`}
      >
        <div className="turn-instruction-content">
          <div className="turn-instruction-header">
            <FaLightbulb className="turn-instruction-icon" aria-hidden="true" />
            <span className="turn-instruction-label">Your Turn</span>
          </div>

          <div className="turn-instruction-rule">
            {ruleSetName || "Highest Card Wins"}
          </div>

          <div className="turn-instruction-description">
            {ruleSetDescription ||
              "Play your highest value card to win the trick"}
          </div>

          <div className="turn-instruction-action">
            <span>Tap a card to select, then tap the table to play</span>
          </div>

          <div className="turn-instruction-dismiss">
            <span className="turn-instruction-dismiss-pulse" />
            Tap anywhere to start
          </div>
        </div>
      </div>

      {/* Card instruction pointer */}
      <div className="turn-instruction-card-pointer" aria-hidden="true">
        <div className="turn-instruction-pointer-content">
          <FaHandPointer className="turn-instruction-pointer-icon" />
          <span className="turn-instruction-pointer-text">
            Select a card from your hand
          </span>
        </div>
        <div className="turn-instruction-pointer-arrow" />
      </div>
    </div>
  );
};

TurnInstructionOverlay.propTypes = {
  visible: PropTypes.bool.isRequired,
  ruleSetName: PropTypes.string,
  ruleSetDescription: PropTypes.string,
  onDismiss: PropTypes.func,
};

TurnInstructionOverlay.defaultProps = {
  ruleSetName: "Highest Card Wins",
  ruleSetDescription: "Play your highest value card to win the trick",
  onDismiss: null,
};

export default TurnInstructionOverlay;
