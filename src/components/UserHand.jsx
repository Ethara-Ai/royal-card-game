import { useMemo } from "react";
import PropTypes from "prop-types";
import Card from "./Card";
import { GAME_PHASES } from "../constants";
import { getPlayerDisplayName } from "../utils/playerUtils";
import { calculatePlayerRank } from "../utils/rankUtils";

const UserHand = ({
  player,
  playerIndex,
  currentPlayer,
  gamePhase,
  selectedCard,
  dealingAnimation,
  onCardSelect,
  players = [],
  scores = [],
}) => {
  const isMyTurn = currentPlayer === playerIndex;

  // Calculate player rank based on scores
  const playerRank = useMemo(
    () => calculatePlayerRank(players, scores, playerIndex),
    [players, scores, playerIndex],
  );

  const playerScore = scores[playerIndex] || 0;

  // Get rank indicator style based on position
  const getRankIndicator = (rank) => {
    const baseStyle = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "700",
      fontSize: "clamp(8px, 2vw, 10px)",
      padding: "1px 4px",
      borderRadius: "4px",
      minWidth: "clamp(14px, 3vw, 18px)",
      height: "clamp(13px, 2.8vw, 16px)",
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
      className="player-panel user-hand-panel"
      style={{
        background:
          "linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-base) 100%)",
        borderRadius: "var(--radius-lg)",
        padding: "clamp(6px, 1.4vw, 14px) clamp(10px, 2vw, 20px)",
        boxShadow: "var(--shadow-lg)",
        border: "1px solid var(--color-border-default)",
      }}
    >
      <div className="player-header flex items-center gap-2 mb-2">
        <img
          src={`https://robohash.org/${player.name}?set=set4&size=32x32`}
          alt={player.name}
          className="player-avatar rounded-lg pixel-art shrink-0"
          style={{
            background: "var(--color-bg-elevated)",
            width: "clamp(22px, 5vw, 32px)",
            height: "clamp(22px, 5vw, 32px)",
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
                fontSize: "clamp(11px, 3vw, 15px)",
                lineHeight: 1.2,
              }}
            >
              {getPlayerDisplayName(player)}
            </span>
            {playerRank && (
              <span style={getRankIndicator(playerRank)}>#{playerRank}</span>
            )}
            <span
              className="shrink-0"
              style={{
                color: "var(--color-gold-light)",
                fontSize: "clamp(10px, 2.5vw, 13px)",
                fontWeight: "600",
              }}
              title={`${playerScore} points`}
            >
              • {playerScore}pt
            </span>
          </div>
          {/* Status row */}
          <div
            className="mt-0.5"
            style={{
              color: isMyTurn
                ? "var(--color-accent-success)"
                : "var(--color-text-muted)",
              fontSize: "clamp(9px, 2.4vw, 12px)",
              fontWeight: isMyTurn ? "600" : "400",
              lineHeight: 1.2,
            }}
          >
            {isMyTurn ? "Your turn" : "Waiting..."}
          </div>
        </div>
      </div>

      <div
        className="player-cards flex justify-center items-end"
        style={{
          paddingTop: "clamp(4px, 1.2vw, 10px)",
          paddingBottom: "clamp(4px, 0.8vw, 6px)",
        }}
      >
        {player.hand.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            totalCards={player.hand.length}
            isPlayable={isMyTurn && gamePhase === GAME_PHASES.PLAYING}
            isSelected={selectedCard?.id === card.id}
            isDealing={dealingAnimation}
            onSelect={onCardSelect}
          />
        ))}
      </div>
    </div>
  );
};

UserHand.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    hand: PropTypes.array.isRequired,
  }).isRequired,
  playerIndex: PropTypes.number.isRequired,
  currentPlayer: PropTypes.number.isRequired,
  gamePhase: PropTypes.string.isRequired,
  selectedCard: PropTypes.object,
  dealingAnimation: PropTypes.bool.isRequired,
  onCardSelect: PropTypes.func.isRequired,
  players: PropTypes.array,
  scores: PropTypes.array,
};

export default UserHand;
