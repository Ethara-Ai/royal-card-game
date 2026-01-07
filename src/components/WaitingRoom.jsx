import PropTypes from "prop-types";
import { FaPlay, FaUser, FaRobot } from "react-icons/fa";

const WaitingRoom = ({ players, startGame }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      minHeight: "calc(100vh - 120px)",
      padding: "1rem",
      boxSizing: "border-box",
    }}
  >
    <div
      className="max-w-md p-4 sm:p-6 rounded-2xl bounce-in"
      style={{
        background:
          "linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-base) 100%)",
        border: "1px solid var(--color-border-default)",
        boxShadow: "var(--shadow-xl)",
        width: "100%",
        maxWidth: "28rem",
      }}
    >
      <h2
        className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6 game-title"
        style={{ color: "var(--color-text-gold)" }}
      >
        Waiting Room
      </h2>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {players.map((player, index) => (
          <div
            key={player.id}
            className="p-2 sm:p-4 rounded-xl transition-all duration-500 hover:scale-105"
            style={{
              background: "var(--color-panel-dark)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <div className="text-center">
              <img
                src={`https://robohash.org/${player.name}?set=set4&size=48x48`}
                alt={player.name}
                className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-lg pixel-art"
                style={{ background: "var(--color-bg-elevated)" }}
              />
              <div
                className="font-semibold text-xs sm:text-sm truncate"
                style={{ color: "var(--color-text-primary)" }}
              >
                {player.name}
              </div>
              <div
                className="text-xs flex items-center justify-center gap-1 mt-1"
                style={{ color: "var(--color-accent-success)" }}
              >
                {index === 0 ? (
                  <FaUser className="text-xs" />
                ) : (
                  <FaRobot className="text-xs" />
                )}
                Ready
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={startGame}
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 start-game-btn"
        style={{
          background:
            "linear-gradient(135deg, var(--color-felt-light) 0%, var(--color-felt-base) 100%)",
          color: "#ffffff",
          boxShadow: "var(--shadow-md), var(--shadow-glow-success)",
        }}
      >
        <FaPlay className="text-sm" />
        <span>Start Game</span>
      </button>
    </div>
  </div>
);

WaitingRoom.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  startGame: PropTypes.func.isRequired,
};

export default WaitingRoom;
