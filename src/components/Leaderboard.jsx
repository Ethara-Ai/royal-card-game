import { useState, useMemo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { getPlayerDisplayName } from "../utils/playerUtils";

const DESKTOP_BREAKPOINT = 1024;

const Leaderboard = ({
  players,
  scores,
  currentPlayer,
  trickWinner,
  ruleSetName,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined"
      ? window.innerWidth >= DESKTOP_BREAKPOINT
      : false,
  );

  // Listen for window resize to determine if we're on desktop
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= DESKTOP_BREAKPOINT;
      setIsDesktop(desktop);
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = useCallback(() => {
    // Only allow collapsing on mobile
    if (!isDesktop) {
      setIsCollapsed((prev) => !prev);
    }
  }, [isDesktop]);

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

  // On mobile, show collapsed state if isCollapsed is true
  if (isCollapsed && !isDesktop) {
    return (
      <div className="leaderboard-container score-sidebar collapsed">
        <button
          className="leaderboard-collapsed-btn"
          onClick={toggleCollapse}
          aria-label="Show leaderboard"
          aria-expanded="false"
        >
          <svg
            className="leaderboard-collapsed-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
          </svg>
          <span className="leaderboard-collapsed-label">Leaderboard</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`leaderboard-container score-sidebar expanded ${isDesktop ? "desktop-always-visible" : ""}`}
    >
      <div className="leaderboard-panel">
        <div className="leaderboard-header">
          <span className="leaderboard-title">{ruleSetName}</span>
          {/* Only show close button on mobile */}
          {!isDesktop && (
            <button
              className="leaderboard-close-btn"
              onClick={toggleCollapse}
              aria-label="Hide leaderboard"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
        </div>
        <div className="leaderboard-players">
          {sortedPlayers.map((player, index) => {
            const score = scores[player.originalIndex];
            const isCurrentPlayer = currentPlayer === player.originalIndex;
            return (
              <div
                key={player.id}
                className={`leaderboard-player flex items-center rounded-lg transition-all duration-300 ${isCurrentPlayer ? "player-turn-indicator" : ""}`}
                style={{
                  background: "var(--color-panel-dark)",
                  border: isCurrentPlayer
                    ? "1px solid var(--color-border-gold)"
                    : "1px solid transparent",
                }}
              >
                <div className="leaderboard-rank">#{index + 1}</div>
                <img
                  src={`https://robohash.org/${player.name}?set=set4&size=24x24`}
                  alt={player.name}
                  className="leaderboard-avatar pixel-art"
                  style={{ background: "var(--color-bg-elevated)" }}
                />
                <div className="leaderboard-player-info">
                  <div className="leaderboard-player-name truncate">
                    {getPlayerDisplayName(player)}
                  </div>
                  <div
                    className={`leaderboard-player-score ${trickWinner === player.id ? "score-update" : ""}`}
                  >
                    {score}
                  </div>
                </div>
                {isCurrentPlayer && (
                  <div className="leaderboard-active-indicator animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

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
