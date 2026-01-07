import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getSuitIcon,
  getRankDisplay,
  getCardColor,
} from "../utils/cardHelpers";

const Card = ({
  card,
  index,
  totalCards,
  isPlayable,
  isDragging,
  isDealing,
  onDragStart,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => {
  const rank = getRankDisplay(card.rank);
  const suit = getSuitIcon(card.suit);
  const cardColor = getCardColor(card.suit);
  const middleIndex = (totalCards - 1) / 2;
  const rotation = (index - middleIndex) * 5;
  const yOffset = Math.abs(index - middleIndex) * 4;
  const [hasDealt, setHasDealt] = useState(!isDealing);

  useEffect(() => {
    if (isDealing) {
      const timer = setTimeout(() => setHasDealt(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isDealing]);

  const showDealAnimation = isDealing && !hasDealt;

  return (
    <div
      draggable={isPlayable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`hand-card ${isPlayable ? "playable" : "disabled"} ${isDragging ? "dragging" : ""} ${showDealAnimation ? "card-deal-in" : ""}`}
      style={{
        "--card-rotation": `${rotation}deg`,
        "--card-y-offset": `${yOffset}px`,
        "--card-delay": `${index * 0.08}s`,
        marginLeft: index === 0 ? "0" : "-8px",
        zIndex: isDragging ? 100 : 10 + index,
      }}
    >
      <div
        className="card-inner"
        style={{
          width: "clamp(28px, 8vw, 42px)",
          height: "clamp(40px, 11vw, 58px)",
          background: "var(--color-card-white)",
          border: "1px solid var(--color-card-border)",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1px",
          padding: "2px",
          color: cardColor,
          boxShadow: "0 2px 6px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
          transformOrigin: "center bottom",
          overflow: "hidden",
        }}
      >
        <div
          className="font-bold"
          style={{
            fontSize: "clamp(10px, 2.5vw, 14px)",
            lineHeight: 1,
          }}
        >
          {rank}
        </div>
        <div
          style={{
            fontSize: "clamp(12px, 3vw, 18px)",
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

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    suit: PropTypes.string.isRequired,
    rank: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  totalCards: PropTypes.number.isRequired,
  isPlayable: PropTypes.bool.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isDealing: PropTypes.bool.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  onTouchMove: PropTypes.func.isRequired,
  onTouchEnd: PropTypes.func.isRequired,
};

export default Card;
