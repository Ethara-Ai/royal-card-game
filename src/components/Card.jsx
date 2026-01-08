import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getSuitIcon, getRankDisplay } from "../utils/cardHelpers";
import styles from "./Card.module.css";

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
  const isRed = card.suit === "hearts" || card.suit === "diamonds";
  const middleIndex = (totalCards - 1) / 2;
  const rotation = (index - middleIndex) * 5;
  const yOffset = Math.abs(index - middleIndex) * 4;
  const [hasDealt, setHasDealt] = useState(!isDealing);

  // Helper to combine class names
  const getClassNames = (...classes) => classes.filter(Boolean).join(" ");

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
      className={getClassNames(
        styles.handCard,
        isPlayable ? styles.playable : styles.disabled,
        isDragging && styles.dragging,
        showDealAnimation && styles.cardDealIn,
      )}
      style={{
        "--card-rotation": `${rotation}deg`,
        "--card-y-offset": `${yOffset}px`,
        "--card-delay": `${index * 0.08}s`,
        marginLeft: index === 0 ? "0" : "-10px",
        zIndex: isDragging ? 100 : 10 + index,
      }}
      role="button"
      tabIndex={isPlayable ? 0 : -1}
      aria-label={`${rank} of ${card.suit}`}
      aria-disabled={!isPlayable}
    >
      <div
        className={getClassNames(
          styles.cardInner,
          isRed ? styles.cardRed : styles.cardBlack,
        )}
      >
        <div className={styles.rank}>{rank}</div>
        <div className={styles.suit}>{suit}</div>
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
