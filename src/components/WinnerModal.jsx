import PropTypes from "prop-types";
import { FaCrown, FaRedo } from "react-icons/fa";

/**
 * WinnerModal - Displays the game results and winner
 * Shows final scores sorted by rank and allows starting a new game
 *
 * @param {Object} props - Component props
 * @param {Array} props.players - Array of player objects
 * @param {Array} props.scores - Array of scores corresponding to players
 * @param {Object} props.winner - The winning player object with player and score
 * @param {Function} props.resetGame - Function to reset and start a new game
 */
const WinnerModal = ({ players, scores, winner, resetGame }) => {
  // Sort players by score for final standings
  const sortedPlayers = [...players]
    .map((player, idx) => ({
      ...player,
      score: scores[idx],
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4"
      style={{
        background: "var(--color-bg-overlay)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="max-w-sm sm:max-w-md w-full p-4 sm:p-6 rounded-2xl bounce-in"
        style={{
          background:
            "linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-base) 100%)",
          border: "1px solid var(--color-border-gold)",
          boxShadow: "var(--shadow-xl), var(--shadow-glow-gold)",
        }}
      >
        <div className="text-center">
          <FaCrown
            className="text-4xl sm:text-5xl mx-auto mb-2 sm:mb-3"
            style={{ color: "var(--color-gold-base)" }}
          />
          <h2
            className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 game-title"
            style={{ color: "var(--color-text-gold)" }}
          >
            Game Over!
          </h2>

          <div className="mb-4 sm:mb-6">
            <div
              className="text-xs sm:text-sm mb-2 sm:mb-3 font-medium uppercase tracking-wider"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Final Scores
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              {sortedPlayers.map((player) => {
                const isWinner = winner.player.id === player.id;
                return (
                  <div
                    key={player.id}
                    className="flex justify-between items-center p-2 sm:p-3 rounded-lg transition-all duration-300"
                    style={{
                      background: isWinner
                        ? "linear-gradient(135deg, var(--color-gold-base) 0%, var(--color-gold-dark) 100%)"
                        : "var(--color-panel-dark)",
                      boxShadow: isWinner ? "var(--shadow-glow-gold)" : "none",
                    }}
                  >
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <img
                        src={`https://robohash.org/${player.name}?set=set4&size=24x24`}
                        alt={player.name}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded pixel-art"
                        style={{
                          background: isWinner
                            ? "rgba(255,255,255,0.2)"
                            : "var(--color-bg-elevated)",
                        }}
                      />
                      <span
                        className="font-medium text-sm sm:text-base"
                        style={{
                          color: isWinner
                            ? "#ffffff"
                            : "var(--color-text-primary)",
                          textShadow: isWinner
                            ? "0 1px 2px rgba(0, 0, 0, 0.4)"
                            : "none",
                        }}
                      >
                        {player.name}
                      </span>
                      {isWinner && (
                        <FaCrown
                          className="text-sm sm:text-base"
                          style={{
                            color: "#ffffff",
                            filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
                          }}
                        />
                      )}
                    </span>
                    <span
                      className="font-bold text-sm sm:text-base"
                      style={{
                        color: isWinner
                          ? "#ffffff"
                          : "var(--color-text-primary)",
                        textShadow: isWinner
                          ? "0 1px 2px rgba(0, 0, 0, 0.4)"
                          : "none",
                      }}
                    >
                      {player.score}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={resetGame}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
            style={{
              background:
                "linear-gradient(135deg, var(--color-gold-base) 0%, var(--color-gold-dark) 100%)",
              color: "#ffffff",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <FaRedo /> Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

WinnerModal.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  scores: PropTypes.arrayOf(PropTypes.number).isRequired,
  winner: PropTypes.shape({
    player: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    score: PropTypes.number.isRequired,
  }).isRequired,
  resetGame: PropTypes.func.isRequired,
};

export default WinnerModal;
