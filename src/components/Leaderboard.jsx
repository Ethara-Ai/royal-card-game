import { useMemo } from "react";
import PropTypes from "prop-types";
import { getPlayerDisplayName } from "../utils/playerUtils";

const Leaderboard = ({
  players,
  scores,
  currentPlayer,
  trickWinner,
  ruleSetName,
}) => {
  // Memoize sorted players to avoid recalculating on every render
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

  return (
    <div className="score-sidebar w-full sm:w-44 shrink-0">
      <div
        className="p-3 sm:p-4 rounded-xl"
        style={{
          background:
            "linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-base) 100%)",
          border: "1px solid var(--color-border-subtle)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          className="text-xs font-medium uppercase tracking-wider mb-2 sm:mb-3"
          style={{ color: "var(--color-text)" }}
        >
          {ruleSetName}
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          {sortedPlayers.map((player, index) => {
            const score = scores[player.originalIndex];
            return (
              <div
                key={player.id}
                className={`flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${
                  currentPlayer === player.originalIndex
                    ? "player-turn-indicator"
                    : ""
                }`}
                style={{
                  background: "var(--color-panel-dark)",
                  border:
                    currentPlayer === player.originalIndex
                      ? "1px solid var(--color-border-gold)"
                      : "1px solid transparent",
                }}
              >
                <div
                  className="text-xs font-bold opacity-60"
                  style={{
                    color: "var(--color-text)",
                    width: "18px",
                    fontSize: "10px",
                  }}
                >
                  #{index + 1}
                </div>
                <img
                  src={`https://robohash.org/${player.name}?set=set4&size=24x24`}
                  alt={player.name}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded pixel-art"
                  style={{ background: "var(--color-bg-elevated)" }}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="text-xs font-medium truncate"
                    style={{
                      color: "var(--color-text-primary)",
                      fontSize: "11px",
                    }}
                  >
                    {getPlayerDisplayName(player)}
                  </div>
                  <div
                    className={`text-xs font-bold ${
                      trickWinner === player.id ? "score-update" : ""
                    }`}
                    style={{
                      color: "var(--color-gold-light)",
                      fontSize: "11px",
                    }}
                  >
                    {score}
                  </div>
                </div>
                {currentPlayer === player.originalIndex && (
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
                    style={{ background: "var(--color-accent-success)" }}
                  ></div>
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
