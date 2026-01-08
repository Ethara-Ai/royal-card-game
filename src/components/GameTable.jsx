import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import PlayerPanel from "./PlayerPanel";
import PlayedCard from "./PlayedCard";
import UserHand from "./UserHand";
import DragHint from "./DragHint";
import TurnInstructionOverlay from "./TurnInstructionOverlay";
import { GAME_PHASES } from "../constants";

/**
 * PlayArea component - The center area where cards are played
 * Handles drop zone and displays played cards
 */
const PlayArea = ({
  playAreaCards,
  cardPositions,
  trickWinner,
  onDragOver,
  onDrop,
}) => (
  <div
    className="play-area-drop absolute rounded-xl flex items-center justify-center"
    onDragOver={onDragOver}
    onDrop={onDrop}
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
);

PlayArea.propTypes = {
  playAreaCards: PropTypes.array.isRequired,
  cardPositions: PropTypes.array.isRequired,
  trickWinner: PropTypes.string,
  onDragOver: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
};

/**
 * PokerTable component - The visual table surface
 */
const PokerTable = () => (
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
);

/**
 * OpponentPosition component - Positions opponent panels around the table
 */
const OpponentPosition = ({
  player,
  index,
  currentPlayer,
  isDealing,
  position,
}) => {
  const positionStyles = {
    top: {
      top: "18%",
      left: "50%",
      transform: "translateX(-50%) translateY(-50%)",
    },
    left: {
      left: "clamp(1%, 2%, 4%)",
      top: "50%",
      transform: "translateY(-50%)",
    },
    right: {
      right: "clamp(1%, 2%, 4%)",
      top: "50%",
      transform: "translateY(-50%)",
    },
  };

  return (
    <div
      className={`absolute opponent-${position}`}
      style={{ ...positionStyles[position], zIndex: 10 }}
    >
      <PlayerPanel
        player={player}
        index={index}
        currentPlayer={currentPlayer}
        isDealing={isDealing}
      />
    </div>
  );
};

OpponentPosition.propTypes = {
  player: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  currentPlayer: PropTypes.number.isRequired,
  isDealing: PropTypes.bool.isRequired,
  position: PropTypes.oneOf(["top", "left", "right"]).isRequired,
};

/**
 * GameTable component - Main game table orchestrating all game elements
 * Uses composition pattern for better organization and maintainability
 */
const GameTable = ({
  players,
  gameState,
  playAreaCards,
  cardPositions,
  trickWinner,
  dealingAnimation,
  draggedCard,
  handleDragOver,
  handleDrop,
  handleDragStart,
  handleDragEnd,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  ruleSetName,
  ruleSetDescription,
}) => {
  // Track if instruction overlay has been dismissed this turn
  const [instructionDismissed, setInstructionDismissed] = useState(false);

  // Reset dismissed state when it becomes player's turn again
  const isPlayerTurn =
    gameState.phase === GAME_PHASES.PLAYING &&
    gameState.currentPlayer === 0 &&
    !dealingAnimation;

  // Show instruction overlay at start of player's turn
  const shouldShowInstruction =
    isPlayerTurn && playAreaCards.length === 0 && !instructionDismissed;

  // Show hint when it's player's turn, no cards in play area, and not dealing
  const shouldShowHint =
    gameState.phase === GAME_PHASES.PLAYING &&
    gameState.currentPlayer === 0 &&
    playAreaCards.length === 0 &&
    !dealingAnimation &&
    instructionDismissed; // Only show hint after instruction is dismissed

  // Dismiss instruction overlay
  const handleInstructionDismiss = useCallback(() => {
    setInstructionDismissed(true);
  }, []);

  // Reset dismissed state when turn changes or new trick starts
  const handleDragStartWithDismiss = useCallback(
    (e, card) => {
      setInstructionDismissed(true);
      handleDragStart(e, card);
    },
    [handleDragStart],
  );

  const handleTouchStartWithDismiss = useCallback(
    (e, card) => {
      setInstructionDismissed(true);
      handleTouchStart(e, card);
    },
    [handleTouchStart],
  );

  return (
    <div
      className="game-table-area flex-1 relative"
      style={{ minHeight: "clamp(280px, 60vh, 600px)" }}
    >
      {/* Poker table surface */}
      <PokerTable />

      {/* Central play area */}
      <PlayArea
        playAreaCards={playAreaCards}
        cardPositions={cardPositions}
        trickWinner={trickWinner}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />

      {/* Turn instruction overlay */}
      <TurnInstructionOverlay
        visible={shouldShowInstruction}
        ruleSetName={ruleSetName}
        ruleSetDescription={ruleSetDescription}
        onDismiss={handleInstructionDismiss}
      />

      {/* Drag instruction hint */}
      <DragHint
        key={`hint-${gameState.phase}-${gameState.currentPlayer}`}
        visible={shouldShowHint}
      />

      {/* Opponent panels */}
      <OpponentPosition
        player={players[2]}
        index={2}
        currentPlayer={gameState.currentPlayer}
        isDealing={dealingAnimation}
        position="top"
      />

      <OpponentPosition
        player={players[1]}
        index={1}
        currentPlayer={gameState.currentPlayer}
        isDealing={dealingAnimation}
        position="left"
      />

      <OpponentPosition
        player={players[3]}
        index={3}
        currentPlayer={gameState.currentPlayer}
        isDealing={dealingAnimation}
        position="right"
      />

      {/* User's hand at the bottom */}
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
          onDragStart={handleDragStartWithDismiss}
          onDragEnd={handleDragEnd}
          onTouchStart={handleTouchStartWithDismiss}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
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
  dealingAnimation: PropTypes.bool.isRequired,
  draggedCard: PropTypes.object,
  handleDragOver: PropTypes.func.isRequired,
  handleDrop: PropTypes.func.isRequired,
  handleDragStart: PropTypes.func.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
  handleTouchStart: PropTypes.func.isRequired,
  handleTouchMove: PropTypes.func.isRequired,
  handleTouchEnd: PropTypes.func.isRequired,
  ruleSetName: PropTypes.string,
  ruleSetDescription: PropTypes.string,
};

GameTable.defaultProps = {
  ruleSetName: "Highest Card Wins",
  ruleSetDescription: "The highest card value wins the trick",
};

export default GameTable;
