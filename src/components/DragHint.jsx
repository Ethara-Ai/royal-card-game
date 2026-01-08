import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const DragHint = ({ visible, hasSelectedCard }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (visible && !hasShown) {
      const showTimer = setTimeout(() => {
        setIsVisible(true);
        setHasShown(true);
      }, 500);

      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [visible, hasShown]);

  const shouldHide = hasSelectedCard && isVisible;
  if (shouldHide && isVisible) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <div
      className="drag-hint"
      style={{
        position: "absolute",
        bottom: "32%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          animation: "hintFadeIn 0.5s ease-out forwards",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: "hintBounce 1.5s ease-in-out infinite",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{ opacity: 0.7 }}
          >
            <circle cx="12" cy="12" r="8" fill="var(--color-gold-light)" />
            <circle cx="12" cy="12" r="4" fill="var(--color-gold-dark)" />
          </svg>
        </div>

        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(11px, 2.5vw, 13px)",
            fontWeight: 500,
            color: "var(--color-text-on-felt)",
            textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
            background: "rgba(0, 0, 0, 0.3)",
            padding: "6px 12px",
            borderRadius: "var(--radius-md)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            letterSpacing: "0.02em",
          }}
        >
          Tap a card to select it
        </div>
      </div>
    </div>
  );
};

DragHint.propTypes = {
  visible: PropTypes.bool.isRequired,
  hasSelectedCard: PropTypes.bool,
};

export default DragHint;
