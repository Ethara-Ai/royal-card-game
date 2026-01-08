import PropTypes from "prop-types";
import { getPatternStyle } from "../utils/patterns";
import { useCardCustomization } from "../context";
import { getPlayerDisplayName } from "../utils/playerUtils";

const PlayerPanel = ({ player, index, currentPlayer, isDealing }) => {
  const { cardBackColor, cardBackPattern } = useCardCustomization();

  return (
    <div
      className={`opponent-panel transition-all duration-300 ${
        currentPlayer === index ? "player-turn-indicator" : ""
      }`}
      style={{
        background:
          "linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-base) 100%)",
        borderRadius: "var(--radius-lg)",
        padding: "clamp(6px, 1.2vw, 12px) clamp(8px, 1.6vw, 16px)",
        boxShadow: "var(--shadow-lg)",
        border: "1px solid var(--color-border-default)",
        minWidth: "clamp(90px, 15vw, 160px)",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <img
          src={`https://robohash.org/${player.name}?set=set4&size=32x32`}
          alt={player.name}
          className="rounded-lg pixel-art"
          style={{
            backgroundColor: "var(--color-panel-dark)",
            padding: "2px",
            width: "clamp(22px, 5vw, 32px)",
            height: "clamp(22px, 5vw, 32px)",
            boxShadow: "var(--shadow-sm)",
          }}
        />
        <div className="flex-1 min-w-0">
          <div
            className="font-semibold truncate"
            style={{
              color: "var(--color-text-primary)",
              fontSize: "clamp(10px, 2.8vw, 14px)",
            }}
          >
            {getPlayerDisplayName(player)}
          </div>
          <div
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "clamp(8px, 2.2vw, 11px)",
            }}
          >
            {currentPlayer === index ? "Playing..." : "Waiting"}
          </div>
        </div>
        <div
          className="font-bold"
          style={{
            color: "var(--color-gold-light)",
            fontSize: "clamp(10px, 2.8vw, 14px)",
          }}
        >
          {player.hand.length}
        </div>
      </div>

      <div className="card-backs flex gap-1 justify-center">
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
                width: "clamp(14px, 3.5vw, 20px)",
                height: "clamp(20px, 5vw, 28px)",
                borderRadius: "3px",
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
};

export default PlayerPanel;
