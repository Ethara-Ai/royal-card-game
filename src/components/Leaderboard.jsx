import { useState, useMemo, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { FaTrophy, FaTimes } from "react-icons/fa";
import { getPlayerDisplayName } from "../utils/playerUtils";

/**
 * Avatar component with fallback support
 * Shows initials if the external avatar service fails
 */
const Avatar = memo(({ name, size = 40, className = "" }) => {
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
  const numericSize = typeof size === "number" ? size : 40;

  if (hasError) {
    return (
      <div
        className={`rounded-lg flex items-center justify-center shrink-0 ${className}`}
        style={{
          width: sizeValue,
          height: sizeValue,
          backgroundColor,
          color: "#ffffff",
          fontSize: `${numericSize * 0.4}px`,
          fontWeight: 700,
          textTransform: "uppercase",
        }}
        aria-label={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={`https://robohash.org/${encodeURIComponent(name)}?set=set4&size=${numericSize}x${numericSize}`}
      alt={name}
      className={`rounded-lg pixel-art shrink-0 ${className}`}
      onError={handleError}
      loading="lazy"
      style={{
        width: sizeValue,
        height: sizeValue,
      }}
    />
  );
});

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};

/**
 * Leaderboard component - displays player rankings and scores
 * Memoized for performance optimization
 */
const Leaderboard = memo(
  ({ players, scores, currentPlayer, trickWinner, ruleSetName }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
      setIsOpen((prev) => !prev);
    }, []);

    const sortedPlayers = useMemo(
      () =>
        [...players]
          .map((player, idx) => ({
            ...player,
            score: scores[idx],
            originalIndex: idx,
          }))
          .sort((a, b) => b.score - a.score),
      [players, scores],
    );

    // Collapsed button state
    if (!isOpen) {
      return (
        <div className="leaderboard-container">
          <button
            className="leaderboard-toggle-btn"
            onClick={toggleOpen}
            aria-label="Show leaderboard"
            aria-expanded="false"
          >
            <FaTrophy className="leaderboard-toggle-icon" />
            <span className="leaderboard-toggle-label">Scores</span>
          </button>
        </div>
      );
    }

    // Expanded panel state
    return (
      <div className="leaderboard-container leaderboard-expanded">
        <div className="leaderboard-panel">
          <div className="leaderboard-header">
            <div className="leaderboard-header-title">
              <FaTrophy className="leaderboard-header-icon" />
              <span className="leaderboard-title">Leaderboard</span>
            </div>
            <button
              className="leaderboard-close-btn"
              onClick={toggleOpen}
              aria-label="Hide leaderboard"
            >
              <FaTimes />
            </button>
          </div>

          <div className="leaderboard-rule-badge">{ruleSetName}</div>

          <div className="leaderboard-players">
            {sortedPlayers.map((player, index) => {
              const score = scores[player.originalIndex];
              const isCurrentPlayer = currentPlayer === player.originalIndex;
              const isWinner = trickWinner === player.id;

              return (
                <div
                  key={player.id}
                  className={`leaderboard-player ${isCurrentPlayer ? "leaderboard-player-active" : ""} ${isWinner ? "leaderboard-player-winner" : ""}`}
                >
                  <span className="leaderboard-rank" data-rank={index + 1}>
                    {index + 1}
                  </span>
                  <Avatar
                    name={player.name}
                    size={40}
                    className="leaderboard-avatar"
                  />
                  <span className="leaderboard-player-name">
                    {getPlayerDisplayName(player)}
                  </span>
                  <span
                    className={`leaderboard-player-score ${isWinner ? "score-update" : ""}`}
                  >
                    {score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

Leaderboard.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      hand: PropTypes.array.isRequired,
      score: PropTypes.number.isRequired,
      isActive: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  scores: PropTypes.arrayOf(PropTypes.number).isRequired,
  currentPlayer: PropTypes.number.isRequired,
  trickWinner: PropTypes.string,
  ruleSetName: PropTypes.string.isRequired,
};

export default Leaderboard;
