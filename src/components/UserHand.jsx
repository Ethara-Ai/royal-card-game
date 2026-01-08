import PropTypes from "prop-types";
import Card from "./Card";
import { GAME_PHASES } from "../constants";
import { getPlayerDisplayName } from "../utils/playerUtils";

const UserHand = ({
  player,
  playerIndex,
  currentPlayer,
  gamePhase,
  draggedCard,
  dealingAnimation,
  onDragStart,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => {
  const isMyTurn = currentPlayer === playerIndex;
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
          className="player-avatar rounded-lg pixel-art"
          style={{
            background: "var(--color-bg-elevated)",
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
              fontSize: "clamp(11px, 3vw, 15px)",
            }}
          >
            {getPlayerDisplayName(player)}
          </div>
          <div
            style={{
              color: isMyTurn
                ? "var(--color-accent-success)"
                : "var(--color-text-muted)",
              fontSize: "clamp(9px, 2.4vw, 12px)",
              fontWeight: isMyTurn ? "600" : "400",
            }}
          >
            {isMyTurn ? "Your turn" : "Waiting..."}
          </div>
        </div>
        <div
          className="font-bold"
          style={{
            color: "var(--color-gold-light)",
            fontSize: "clamp(11px, 3vw, 15px)",
          }}
        >
          {player.hand.length}
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
            isDragging={draggedCard?.id === card.id}
            isDealing={dealingAnimation}
            onDragStart={(e) => onDragStart(e, card)}
            onDragEnd={onDragEnd}
            onTouchStart={(e) => onTouchStart(e, card)}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
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
  draggedCard: PropTypes.object,
  dealingAnimation: PropTypes.bool.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  onTouchMove: PropTypes.func.isRequired,
  onTouchEnd: PropTypes.func.isRequired,
};

export default UserHand;
