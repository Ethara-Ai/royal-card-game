import PropTypes from "prop-types";
import { getPatternStyle } from "../utils/patterns";

const PlayerPanel = ({
  player,
  index,
  currentPlayer,
  cardBackColor,
  cardBackPattern,
  isDealing,
}) => (
    <div
      className={`opponent-panel transition-all duration-300 ${
        currentPlayer === index ? "player-turn-indicator" : ""
      }`}
      style={{
        background:
          "linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-base) 100%)",
        borderRadius: "var(--radius-md)",
        padding: "clamp(3px, 0.8vw, 8px) clamp(5px, 1.2vw, 12px)",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--color-border-default)",
      }}
    >
      <div className="flex items-center gap-1 mb-1">
        <img
          src={`https://robohash.org/${player.name}?set=set4&size=24x24`}
          alt={player.name}
          className="rounded pixel-art"
          style={{
            backgroundColor: "var(--color-panel-dark)",
            padding: "1px",
            width: "clamp(14px, 3.5vw, 20px)",
            height: "clamp(14px, 3.5vw, 20px)",
          }}
        />
        <div className="flex-1 min-w-0">
          <div
            className="font-semibold truncate"
            style={{
              color: "var(--color-text-primary)",
              fontSize: "clamp(8px, 2.2vw, 11px)",
            }}
          >
            {player.name}
          </div>
          <div
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "clamp(7px, 1.8vw, 9px)",
            }}
          >
            {currentPlayer === index ? "Playing..." : "Waiting"}
          </div>
        </div>
        <div
          className="font-bold"
          style={{
            color: "var(--color-gold-light)",
            fontSize: "clamp(8px, 2.2vw, 11px)",
          }}
        >
          {player.hand.length}
        </div>
      </div>

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
                width: "clamp(10px, 2.5vw, 14px)",
                height: "clamp(14px, 3.5vw, 20px)",
                borderRadius: "2px",
                border: "1px solid var(--color-border-default)",
              }}
            />
          );
        })}
      </div>
    </div>
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
  cardBackColor: PropTypes.string.isRequired,
  cardBackPattern: PropTypes.string.isRequired,
  isDealing: PropTypes.bool.isRequired,
};

export default PlayerPanel;
