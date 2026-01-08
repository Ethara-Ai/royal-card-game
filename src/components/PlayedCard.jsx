import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getSuitIcon,
  getRankDisplay,
  getCardColor,
} from "../utils/cardHelpers";

const PlayedCard = ({ card, position, isWinner, useFlexLayout = false }) => {
  const rank = getRankDisplay(card.rank);
  const suit = getSuitIcon(card.suit);
  const color = getCardColor(card.suit);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Small rotation for visual interest in flex layout
  const flexRotation = useFlexLayout ? position.rotation * 0.5 : 0;

  return (
    <div
      className={`played-card-flex ${isAnimating ? "card-enter-flex" : ""} ${isWinner ? "winner-glow" : ""}`}
      style={{
        position: useFlexLayout ? "relative" : "absolute",
        transform: useFlexLayout 
          ? `rotate(${flexRotation}deg)` 
          : `translate(${position.x}px, ${position.y}px) rotate(${position.rotation}deg)`,
        zIndex: position.zIndex,
        transition: "transform 0.3s ease-out",
        flexShrink: 0,
      }}
    >
      <div
        className="card-face"
        style={{
          width: "clamp(28px, 8vw, 68px)",
          height: "clamp(40px, 11vw, 96px)",
          background: "var(--color-card-white)",
          border: "1px solid var(--color-card-border)",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1px",
          padding: "2px",
          boxShadow: "var(--shadow-card)",
          overflow: "hidden",
        }}
      >
        <div
          className="font-bold"
          style={{
            color,
            fontSize: "clamp(9px, 2.5vw, 20px)",
            lineHeight: 1,
          }}
        >
          {rank}
        </div>
        <div
          style={{
            fontSize: "clamp(11px, 3vw, 28px)",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {suit}
        </div>
      </div>
    </div>
  );
};

PlayedCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    suit: PropTypes.string.isRequired,
    rank: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    rotation: PropTypes.number.isRequired,
    zIndex: PropTypes.number.isRequired,
  }).isRequired,
  isWinner: PropTypes.bool.isRequired,
  useFlexLayout: PropTypes.bool,
};

PlayedCard.defaultProps = {
  useFlexLayout: false,
};

export default PlayedCard;
