import { useMemo } from "react";
import PropTypes from "prop-types";
import { getPatternStyle } from "../utils/patterns";
import { useCardCustomization } from "../context";
import { getPlayerDisplayName } from "../utils/playerUtils";
import { calculatePlayerRank } from "../utils/rankUtils";

const PlayerPanel = ({
  player,
  index,
  currentPlayer,
  isDealing,
  players = [],
  scores = [],
}) => {
  const { cardBackColor, cardBackPattern } = useCardCustomization();

  // Calculate player rank based on scores
  const playerRank = useMemo(
    () => calculatePlayerRank(players, scores, index),
    [players, scores, index],
  );

  const playerScore = scores[index] || 0;
  const isPlaying = currentPlayer === index;

  // Get rank indicator style based on position
  const getRankIndicator = (rank) => {
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
          color: "#1a1a2e",
          border: "1px solid rgba(255, 215, 0, 0.5)",
        };
      case 2:
        return {
          ...baseStyle,
          background: "linear-gradient(135deg, #E0E0E0 0%, #A8A8A8 100%)",
          color: "#1a1a2e",
          border: "1px solid rgba(192, 192, 192, 0.5)",
        };
      case 3:
        return {
          ...baseStyle,
          background: "linear-gradient(135deg, #D4A574 0%, #B8860B 100%)",
          color: "#1a1a2e",
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
        <img
          src={`https://robohash.org/${player.name}?set=set4&size=32x32`}
          alt={player.name}
          className="rounded-lg pixel-art shrink-0"
          style={{
            backgroundColor: "var(--color-panel-dark)",
            padding: "2px",
            width: "clamp(24px, 4vw, 30px)",
            height: "clamp(24px, 4vw, 30px)",
            boxShadow: "var(--shadow-sm)",
          }}
        />
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

      {/* Card Backs Row */}
      <div className="card-backs flex gap-0.5 justify-center">
        {Array.from({ length: Math.min(player.hand.length, 5) }, (_, i) => {
          const patternStyles = getPatternStyle(cardBackPattern, cardBackColor);
          return (
            <div
              key={i}
              className={`transition-all duration-300 ${isDealing ? "card-deal-in" : ""}`}
              style={{
                backgroundColor: cardBackColor,
                backgroundImage: patternStyles.backgroundImage,
                backgroundSize: patternStyles.backgroundSize,
                animationDelay: `${i * 0.1}s`,
                width: "clamp(14px, 3vw, 20px)",
                height: "clamp(20px, 4.2vw, 28px)",
                borderRadius: "2px",
                border: "1px solid var(--color-border-default)",
                boxShadow: "var(--shadow-sm)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

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
