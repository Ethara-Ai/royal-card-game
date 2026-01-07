import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PlayerPanel from "./PlayerPanel";
import PlayedCard from "./PlayedCard";
import UserHand from "./UserHand";

const DragHint = ({ visible }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (visible && !hasShown) {
      const showTimer = setTimeout(() => {
        setIsVisible(true);
        setHasShown(true);
      }, 500);

      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [visible, hasShown]);

  if (!isVisible) return null;

  return (
    <div
      className="drag-hint"
      style={{
        position: "absolute",
        bottom: "32%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          animation: "hintFadeIn 0.5s ease-out forwards",
        }}
      >
        {/* Animated arrow pointing up */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: "hintBounce 1.5s ease-in-out infinite",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{ opacity: 0.7 }}
          >
            <path
              d="M12 4L6 10H10V20H14V10H18L12 4Z"
              fill="var(--color-gold-light)"
            />
          </svg>
        </div>

        {/* Hint text */}
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(11px, 2.5vw, 13px)",
            fontWeight: 500,
            color: "var(--color-text-on-felt)",
            textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
            background: "rgba(0, 0, 0, 0.3)",
            padding: "6px 12px",
            borderRadius: "var(--radius-md)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            letterSpacing: "0.02em",
          }}
        >
          Drag a card to the play area
        </div>
      </div>
    </div>
  );
};

DragHint.propTypes = {
  visible: PropTypes.bool.isRequired,
};

const GameTable = ({
  players,
  gameState,
  playAreaCards,
  cardPositions,
  trickWinner,
  cardBackColor,
  cardBackPattern,
  dealingAnimation,
  draggedCard,
  handleDragOver,
  handleDrop,
  handleDragStart,
  handleDragEnd,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
}) => {
  // Show hint when it's player's turn, no cards in play area, and not dealing
  const shouldShowHint =
    gameState.phase === "playing" &&
    gameState.currentPlayer === 0 &&
    playAreaCards.length === 0 &&
    !dealingAnimation;

  return (
    <div
      className="game-table-area flex-1 relative"
      style={{ minHeight: "clamp(280px, 60vh, 600px)" }}
    >
      <div
        className="poker-table absolute felt-gradient"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(85%, 75vw, 75%)",
          maxWidth: "700px",
          aspectRatio: "1.8 / 1",
          borderRadius: "50%",
          boxShadow: "var(--shadow-table-rim)",
        }}
      />

      <div
        className="play-area-drop absolute rounded-xl flex items-center justify-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "240px",
          height: "140px",
          backgroundColor: "transparent",
          border:
            playAreaCards.length === 0
              ? "2px dashed var(--color-text-on-felt-muted)"
              : "none",
        }}
      >
        {playAreaCards.length === 0 ? (
          <div
            className="text-sm font-medium text-center"
            style={{ color: "var(--color-text-on-felt)" }}
          >
            Play cards here
          </div>
        ) : (
          <div className="relative w-full h-full">
            {playAreaCards.map(([playerId, card], index) => (
              <PlayedCard
                key={`${playerId}-${card.id}`}
                card={card}
                position={cardPositions[index]}
                isWinner={trickWinner === playerId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Subtle drag instruction hint - key resets the component when game restarts */}
      <DragHint
        key={`hint-${gameState.phase}-${gameState.currentPlayer}`}
        visible={shouldShowHint}
      />

      <div
        className="absolute opponent-top"
        style={{
          top: "18%",
          left: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          zIndex: 10,
        }}
      >
        <PlayerPanel
          player={players[2]}
          index={2}
          currentPlayer={gameState.currentPlayer}
          cardBackColor={cardBackColor}
          cardBackPattern={cardBackPattern}
          isDealing={dealingAnimation}
        />
      </div>

      <div
        className="absolute opponent-left"
        style={{
          left: "clamp(1%, 2%, 4%)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        <PlayerPanel
          player={players[1]}
          index={1}
          currentPlayer={gameState.currentPlayer}
          cardBackColor={cardBackColor}
          cardBackPattern={cardBackPattern}
          isDealing={dealingAnimation}
        />
      </div>

      <div
        className="absolute opponent-right"
        style={{
          right: "clamp(1%, 2%, 4%)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        <PlayerPanel
          player={players[3]}
          index={3}
          currentPlayer={gameState.currentPlayer}
          cardBackColor={cardBackColor}
          cardBackPattern={cardBackPattern}
          isDealing={dealingAnimation}
        />
      </div>

      <div
        className="absolute user-hand-area"
        style={{
          bottom: "18%",
          left: "50%",
          transform: "translateX(-50%) translateY(50%)",
          zIndex: 10,
        }}
      >
        <UserHand
          player={players[0]}
          playerIndex={0}
          currentPlayer={gameState.currentPlayer}
          gamePhase={gameState.phase}
          draggedCard={draggedCard}
          dealingAnimation={dealingAnimation}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      <style>{`
        @keyframes hintFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes hintBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
};

GameTable.propTypes = {
  players: PropTypes.array.isRequired,
  gameState: PropTypes.shape({
    phase: PropTypes.string.isRequired,
    currentPlayer: PropTypes.number.isRequired,
  }).isRequired,
  playAreaCards: PropTypes.array.isRequired,
  cardPositions: PropTypes.array.isRequired,
  trickWinner: PropTypes.string,
  cardBackColor: PropTypes.string.isRequired,
  cardBackPattern: PropTypes.string.isRequired,
  dealingAnimation: PropTypes.bool.isRequired,
  draggedCard: PropTypes.object,
  handleDragOver: PropTypes.func.isRequired,
  handleDrop: PropTypes.func.isRequired,
  handleDragStart: PropTypes.func.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
  handleTouchStart: PropTypes.func.isRequired,
  handleTouchMove: PropTypes.func.isRequired,
  handleTouchEnd: PropTypes.func.isRequired,
};

export default GameTable;
