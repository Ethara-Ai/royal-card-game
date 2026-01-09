import { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import {
  getSuitIcon,
  getRankDisplay,
  getCardColor,
} from "../utils/cardHelpers";

const Card = memo(
  ({
    card,
    index,
    totalCards,
    isPlayable,
    isSelected,
    isDealing,
    onSelect,
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

    const handleClick = () => {
      if (isPlayable && onSelect) {
        onSelect(card);
      }
    };

    return (
      <div
        onClick={handleClick}
        className={`hand-card ${isPlayable ? "playable" : "disabled"} ${isSelected ? "selected" : ""} ${showDealAnimation ? "card-deal-in" : ""}`}
        style={{
          "--card-rotation": `${rotation}deg`,
          "--card-y-offset": `${yOffset}px`,
          "--card-delay": `${index * 0.08}s`,
          marginLeft: index === 0 ? "0" : "-10px",
          zIndex: isSelected ? 100 : 10 + index,
        }}
      >
        <div
          className="card-inner"
          style={{
            width: "clamp(36px, 10vw, 54px)",
            height: "clamp(52px, 14vw, 76px)",
            background: "var(--color-card-white)",
            border: isSelected
              ? "2px solid var(--color-gold-base)"
              : "1px solid var(--color-card-border)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            padding: "4px",
            color: cardColor,
            boxShadow: isSelected
              ? "0 8px 20px rgba(0,0,0,0.25), 0 0 0 2px var(--color-gold-base)"
              : "0 3px 8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)",
            transformOrigin: "center bottom",
            overflow: "hidden",
          }}
        >
          <div
            className="font-bold"
            style={{
              fontSize: "clamp(12px, 3.2vw, 18px)",
              lineHeight: 1,
            }}
          >
            {rank}
          </div>
          <div
            style={{
              fontSize: "clamp(16px, 4vw, 24px)",
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
  },
);

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
  isSelected: PropTypes.bool.isRequired,
  isDealing: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default Card;
