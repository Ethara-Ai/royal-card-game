import PropTypes from "prop-types";
import Card from "./Card";

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
      className="player-panel"
      style={{
        background:
          "linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-base) 100%)",
        borderRadius: "var(--radius-md)",
        padding: "clamp(4px, 1vw, 10px) clamp(6px, 1.5vw, 14px)",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--color-border-default)",
      }}
    >
      <div className="player-header flex items-center gap-1.5 mb-1">
        <img
          src={`https://robohash.org/${player.name}?set=set4&size=24x24`}
          alt={player.name}
          className="player-avatar rounded pixel-art"
          style={{
            background: "var(--color-bg-elevated)",
            width: "clamp(16px, 4vw, 24px)",
            height: "clamp(16px, 4vw, 24px)",
          }}
        />
        <div className="flex-1 min-w-0">
          <div
            className="font-semibold truncate"
            style={{
              color: "var(--color-text-primary)",
              fontSize: "clamp(9px, 2.5vw, 12px)",
            }}
          >
            {player.name}
          </div>
          <div
            style={{
              color: isMyTurn
                ? "var(--color-accent-success)"
                : "var(--color-text-muted)",
              fontSize: "clamp(8px, 2vw, 10px)",
            }}
          >
            {isMyTurn ? "Your turn" : "Waiting..."}
          </div>
        </div>
        <div
          className="font-bold"
          style={{
            color: "var(--color-gold-light)",
            fontSize: "clamp(9px, 2.5vw, 12px)",
          }}
        >
          {player.hand.length}
        </div>
      </div>

      <div
        className="player-cards flex justify-center items-end"
        style={{
          paddingTop: "clamp(2px, 1vw, 8px)",
          paddingBottom: "clamp(2px, 0.5vw, 4px)",
        }}
      >
        {player.hand.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            totalCards={player.hand.length}
            isPlayable={isMyTurn && gamePhase === "playing"}
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
