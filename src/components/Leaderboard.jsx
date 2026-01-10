import { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { FaTrophy, FaTimes } from "react-icons/fa";
import { getPlayerDisplayName } from "../utils/playerUtils";

const Leaderboard = ({
  players,
  scores,
  currentPlayer,
  trickWinner,
  ruleSetName,
}) => {
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
                <img
                  src={`https://robohash.org/${player.name}?set=set4&size=40x40`}
                  alt={player.name}
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
