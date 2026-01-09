import { useMemo, memo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { getPatternStyle } from "../utils/patterns";
import { useCardCustomization } from "../context";
import { getPlayerDisplayName } from "../utils/playerUtils";
import { calculatePlayerRank } from "../utils/rankUtils";

/**
 * Avatar component with fallback support
 * Shows initials if the external avatar service fails
 */
const Avatar = memo(({ name, size = 30 }) => {
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
        className="rounded-lg flex items-center justify-center shrink-0"
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
      src={`https://robohash.org/${encodeURIComponent(name)}?set=set4&size=${size}x${size}`}
      alt={name}
      className="rounded-lg pixel-art shrink-0"
      onError={handleError}
      loading="lazy"
      style={{
        backgroundColor: "var(--color-panel-dark)",
        padding: "2px",
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
 * PlayerPanel component - displays opponent player info and cards
 * Memoized for performance optimization
 */
const PlayerPanel = memo(
  ({ player, index, currentPlayer, isDealing, players = [], scores = [] }) => {
    const { cardBackColor, cardBackPattern } = useCardCustomization();

    // Calculate player rank based on scores
    const playerRank = useMemo(
      () => calculatePlayerRank(players, scores, index),
      [players, scores, index],
    );

    const playerScore = scores[index] || 0;
    const isPlaying = currentPlayer === index;

    // Get rank indicator style based on position
    const getRankIndicator = useCallback((rank) => {
      const baseStyle = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        fontSize: "clamp(7px, 1.5vw, 9px)",
        padding: "1px 3px",
        borderRadius: "3px",
        minWidth: "clamp(14px, 2.5vw, 18px)",
        height: "clamp(12px, 2.2vw, 15px)",
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
    }, []);

    return (
      <div
        className={`opponent-panel transition-all duration-300 ${
          isPlaying ? "player-turn-indicator" : ""
        }`}
        style={{
          background:
            "linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-base) 100%)",
          borderRadius: "var(--radius-lg)",
          padding: "clamp(6px, 1.2vw, 10px) clamp(8px, 1.5vw, 14px)",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--color-border-default)",
          minWidth: "clamp(100px, 14vw, 150px)",
          maxWidth: "clamp(130px, 18vw, 180px)",
        }}
      >
        {/* Player Info Row */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <Avatar name={player.name} size="clamp(24px, 4vw, 30px)" />
          <div className="flex-1 min-w-0 overflow-hidden">
            {/* Name row with rank badge */}
            <div className="flex items-center gap-1.5">
              <span
                className="font-semibold truncate"
                style={{
                  color: "var(--color-text-primary)",
                  fontSize: "clamp(10px, 2.2vw, 13px)",
                  lineHeight: 1.2,
                }}
              >
                {getPlayerDisplayName(player)}
              </span>
              {playerRank && (
                <span style={getRankIndicator(playerRank)}>#{playerRank}</span>
              )}
            </div>
            {/* Status row with score */}
            <div
              className="flex items-center gap-1 mt-0.5"
              style={{
                fontSize: "clamp(8px, 1.8vw, 10px)",
                lineHeight: 1.2,
              }}
            >
              <span
                style={{
                  color: isPlaying
                    ? "var(--color-accent-success)"
                    : "var(--color-text-secondary)",
                  fontWeight: isPlaying ? "600" : "400",
                }}
              >
                {isPlaying ? "Playing" : "Waiting"}
              </span>
              <span
                style={{
                  color: "var(--color-gold-light)",
                  fontWeight: "600",
                }}
                title={`${playerScore} points`}
              >
                • {playerScore}pt
              </span>
            </div>
          </div>
        </div>

        {/* Card Backs Row - Compact Deck Display */}
        <div className="card-backs flex justify-center items-center">
          <div
            className="card-deck-container"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(6px, 1.5vw, 10px)",
            }}
          >
            {/* Stacked Card Deck Visual */}
            <div
              style={{
                position: "relative",
                width: "clamp(28px, 5vw, 36px)",
                height: "clamp(36px, 6.5vw, 48px)",
              }}
            >
              {/* Show max 4 cards for the stack effect */}
              {Array.from(
                { length: Math.min(player.hand.length, 4) },
                (_, i) => {
                  const patternStyles = getPatternStyle(
                    cardBackPattern,
                    cardBackColor,
                  );
                  const stackOffset = i * 2; // 2px offset per card
                  const isTopCard = i === Math.min(player.hand.length, 4) - 1;

                  return (
                    <div
                      key={i}
                      className={`card-stack-item ${isDealing ? "card-deal-in" : ""}`}
                      style={{
                        position: "absolute",
                        left: `${stackOffset}px`,
                        top: `${stackOffset}px`,
                        backgroundColor: cardBackColor,
                        backgroundImage: patternStyles.backgroundImage,
                        backgroundSize: patternStyles.backgroundSize,
                        animationDelay: `${i * 0.1}s`,
                        width: "clamp(22px, 4vw, 28px)",
                        height: "clamp(30px, 5.5vw, 40px)",
                        borderRadius: "clamp(2px, 0.4vw, 3px)",
                        border: "1px solid var(--color-border-default)",
                        boxShadow: isTopCard
                          ? "0 2px 6px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
                          : "0 1px 2px rgba(0, 0, 0, 0.2)",
                        zIndex: i,
                        transition: "all 0.3s ease",
                      }}
                    />
                  );
                },
              )}
            </div>

            {/* Card Count Display */}
            {player.hand.length > 0 && (
              <div
                className="card-count-display"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "clamp(4px, 0.8vw, 6px)",
                  padding: "clamp(3px, 0.6vw, 5px) clamp(6px, 1vw, 10px)",
                  minWidth: "clamp(24px, 4vw, 32px)",
                }}
                title={`${player.hand.length} cards in hand`}
              >
                <span
                  className="card-count-number"
                  style={{
                    fontSize: "clamp(11px, 2.2vw, 15px)",
                    fontWeight: "800",
                    lineHeight: 1,
                  }}
                >
                  {player.hand.length}
                </span>
                <span
                  className="card-count-label"
                  style={{
                    fontSize: "clamp(6px, 1.2vw, 8px)",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                    lineHeight: 1,
                    marginTop: "1px",
                  }}
                >
                  cards
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

PlayerPanel.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    hand: PropTypes.array.isRequired,
    score: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  currentPlayer: PropTypes.number.isRequired,
  isDealing: PropTypes.bool.isRequired,
  players: PropTypes.array,
  scores: PropTypes.array,
};

export default PlayerPanel;
