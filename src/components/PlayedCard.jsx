import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getSuitIcon,
  getRankDisplay,
  getCardColor,
} from "../utils/cardHelpers";

const PlayedCard = ({ card, position, isWinner }) => {
  const rank = getRankDisplay(card.rank);
  const suit = getSuitIcon(card.suit);
  const color = getCardColor(card.suit);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`played-card ${isAnimating ? "card-enter" : "card-settled"} ${isWinner ? "winner-glow" : ""}`}
      style={{
        "--target-x": `${position.x}px`,
        "--target-y": `${position.y}px`,
        "--target-rotation": `${position.rotation}deg`,
        zIndex: position.zIndex,
      }}
    >
      <div
        className="card-face"
        style={{
          width: "clamp(36px, 10vw, 56px)",
          height: "clamp(50px, 14vw, 80px)",
          background: "var(--color-card-white)",
          border: "1px solid var(--color-card-border)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2px",
          padding: "3px",
          boxShadow: "var(--shadow-card)",
          overflow: "hidden",
        }}
      >
        <div
          className="font-bold"
          style={{
            color,
            fontSize: "clamp(11px, 3vw, 16px)",
            lineHeight: 1,
          }}
        >
          {rank}
        </div>
        <div
          style={{
            fontSize: "clamp(14px, 4vw, 22px)",
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
};

export default PlayedCard;
