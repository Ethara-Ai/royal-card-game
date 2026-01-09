import { useMemo, memo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Card from "./Card";
import { GAME_PHASES } from "../constants";
import { getPlayerDisplayName } from "../utils/playerUtils";

/**
 * Avatar component with fallback support
 * Shows initials if the external avatar service fails
 */
const Avatar = memo(({ name, size = 32 }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  // Generate initials from name
  const initials = useMemo(() => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

  // Generate a consistent color based on name
  const backgroundColor = useMemo(() => {
    if (!name) return "#6b7280";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 45%, 45%)`;
  }, [name]);

  const sizeValue = typeof size === "number" ? `${size}px` : size;

  if (hasError) {
    return (
      <div
        className="player-avatar rounded-lg flex items-center justify-center shrink-0"
        style={{
          width: sizeValue,
          height: sizeValue,
          backgroundColor,
          color: "#ffffff",
          fontSize: `calc(${sizeValue} * 0.4)`,
          fontWeight: 700,
          textTransform: "uppercase",
          boxShadow: "var(--shadow-sm)",
        }}
        aria-label={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={`https://robohash.org/${encodeURIComponent(name)}?set=set4&size=${typeof size === "number" ? size : 32}x${typeof size === "number" ? size : 32}`}
      alt={name}
      className="player-avatar rounded-lg pixel-art shrink-0"
      onError={handleError}
      loading="lazy"
      style={{
        background: "var(--color-bg-elevated)",
        width: sizeValue,
        height: sizeValue,
        boxShadow: "var(--shadow-sm)",
      }}
    />
  );
});

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

/**
 * UserHand component - displays the human player's hand and info
 * Memoized for performance optimization
 */
const UserHand = memo(({
  player,
  playerIndex,
  currentPlayer,
  gamePhase,
  selectedCard,
  dealingAnimation,
  onCardSelect,
}) => {
  const isMyTurn = currentPlayer === playerIndex;

  // Calculate player rank based on scores
  const playerRank = useMemo(
    () => calculatePlayerRank(players, scores, playerIndex),
    [players, scores, playerIndex],
  );

  const playerScore = scores[playerIndex] || 0;

  // Get rank indicator style based on position
  const getRankIndicator = (rank) => {
    const baseStyle = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "700",
      fontSize: "clamp(8px, 2vw, 10px)",
      padding: "1px 4px",
      borderRadius: "4px",
      minWidth: "clamp(14px, 3vw, 18px)",
      height: "clamp(13px, 2.8vw, 16px)",
      lineHeight: 1,
      flexShrink: 0,
    };

    switch (rank) {
      case 1:
        return {
          ...baseStyle,
          background: "linear-gradient(135deg, #FFD700 0%, #F4A020 100%)",
          color: "#1a1a1a",
          border: "1px solid rgba(255, 215, 0, 0.5)",
        };
      case 2:
        return {
          ...baseStyle,
          background: "linear-gradient(135deg, #E0E0E0 0%, #A8A8A8 100%)",
          color: "#1a1a1a",
          border: "1px solid rgba(192, 192, 192, 0.5)",
        };
      case 3:
        return {
          ...baseStyle,
          background: "linear-gradient(135deg, #D4A574 0%, #B8860B 100%)",
          color: "#1a1a1a",
          border: "1px solid rgba(205, 127, 50, 0.5)",
        };
      default:
        return {
          ...baseStyle,
          background: "var(--color-panel-dark)",
          color: "var(--color-text-muted)",
          border: "1px solid var(--color-border-subtle)",
        };
    }
  };

  return (
    <div
      className="player-panel user-hand-panel"
      style={{
        background:
          "linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-base) 100%)",
        borderRadius: "var(--radius-lg)",
        padding: "clamp(6px, 1.4vw, 14px) clamp(10px, 2vw, 20px)",
        boxShadow: "var(--shadow-lg)",
        border: "1px solid var(--color-border-default)",
      }}
    >
      <div className="player-header flex items-center gap-2 mb-2">
        <Avatar name={player.name} size="clamp(22px, 5vw, 32px)" />
        <div className="flex-1 min-w-0">
          <div
            className="font-semibold truncate"
            style={{
              color: "var(--color-text-primary)",
              fontSize: "clamp(11px, 3vw, 15px)",
            }}
          >
            {getPlayerDisplayName(player)}
          </div>
          <div
            style={{
              color: isMyTurn
                ? "var(--color-accent-success)"
                : "var(--color-text-muted)",
              fontSize: "clamp(9px, 2.4vw, 12px)",
              fontWeight: isMyTurn ? "600" : "400",
            }}
          >
            {isMyTurn ? "Your turn" : "Waiting..."}
          </div>
        </div>
        <div
          className="font-bold"
          style={{
            color: "var(--color-gold-light)",
            fontSize: "clamp(11px, 3vw, 15px)",
          }}
        >
          {player.hand.length}
        </div>
      </div>

      <div
        className="player-cards flex justify-center items-end"
        style={{
          paddingTop: "clamp(4px, 1.2vw, 10px)",
          paddingBottom: "clamp(4px, 0.8vw, 6px)",
        }}
      >
        {player.hand.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            totalCards={player.hand.length}
            isPlayable={isMyTurn && gamePhase === GAME_PHASES.PLAYING}
            isSelected={selectedCard?.id === card.id}
            isDealing={dealingAnimation}
            onSelect={onCardSelect}
          />
        ))}
      </div>
    </div>
  );
});

UserHand.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    hand: PropTypes.array.isRequired,
  }).isRequired,
  playerIndex: PropTypes.number.isRequired,
  currentPlayer: PropTypes.number.isRequired,
  gamePhase: PropTypes.string.isRequired,
  selectedCard: PropTypes.object,
  dealingAnimation: PropTypes.bool.isRequired,
  onCardSelect: PropTypes.func.isRequired,
};

export default UserHand;
