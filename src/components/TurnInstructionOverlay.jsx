import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { FaLightbulb } from "react-icons/fa";

/**
 * TurnInstructionOverlay component - Shows turn instructions at the start of each turn
 * Displays the current rule set and basic instructions
 * Disappears when player interacts with their hand or after a timeout
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
  const timersRef = useRef({ show: null, hide: null, exit: null });
  const lastVisibleRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    Object.values(timersRef.current).forEach((timer) => {
      if (timer) clearTimeout(timer);
    });
    timersRef.current = { show: null, hide: null, exit: null };
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

      // Auto-dismiss after 5 seconds
      timersRef.current.hide = setTimeout(() => {
        setShowState("exiting");
        timersRef.current.exit = setTimeout(() => {
          setShowState("hidden");
          if (onDismiss) onDismiss();
        }, 300);
      }, 5000);
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

  // Listen for any interaction to dismiss
  useEffect(() => {
    if (showState !== "visible") return;

    const handleInteraction = () => {
      handleDismiss();
    };

    // Listen for mouse/touch events on the game area
    document.addEventListener("mousedown", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);
    document.addEventListener("dragstart", handleInteraction);

    return () => {
      document.removeEventListener("mousedown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("dragstart", handleInteraction);
    };
  }, [showState, handleDismiss]);

  // Cleanup on unmount
  useEffect(() => clearAllTimers, [clearAllTimers]);

  if (showState === "hidden") return null;

  const isExiting = showState === "exiting";
  const animationClass = isExiting ? "exiting" : "entering";

  return (
    <div
      className={`turn-instruction-overlay ${animationClass}`}
      role="status"
      aria-live="polite"
      aria-label={`Your turn. ${ruleSetName || "Highest Card Wins"}. ${ruleSetDescription || "Play your highest value card to win the trick"}`}
    >
      <div className="turn-instruction-content">
        {/* Header with icon */}
        <div className="turn-instruction-header">
          <FaLightbulb className="turn-instruction-icon" aria-hidden="true" />
          <span className="turn-instruction-label">Your Turn</span>
        </div>

        {/* Primary rule - highest contrast text */}
        <div className="turn-instruction-rule">
          {ruleSetName || "Highest Card Wins"}
        </div>

        {/* Rule description - secondary contrast */}
        <div className="turn-instruction-description">
          {ruleSetDescription ||
            "Play your highest value card to win the trick"}
        </div>

        {/* Divider - theme-aware gradient */}
        <div className="turn-instruction-divider" aria-hidden="true" />

        {/* Instruction */}
        <div className="turn-instruction-action">
          <span className="turn-instruction-action-icon" aria-hidden="true">
            👆
          </span>
          <span>Drag a card to play</span>
        </div>

        {/* Dismiss hint - muted text */}
        <div className="turn-instruction-dismiss">
          Click anywhere to dismiss
        </div>
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
