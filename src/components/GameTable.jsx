import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import PlayerPanel from "./PlayerPanel";
import PlayedCard from "./PlayedCard";
import UserHand from "./UserHand";
import DragHint from "./DragHint";
import TurnInstructionOverlay from "./TurnInstructionOverlay";
import { GAME_PHASES } from "../constants";

const useTableBounds = () => {
  const [bounds, setBounds] = useState({
    topOffset: "15%",
    bottomOffset: "16%",
    leftOffset: "5%",
    rightOffset: "5%",
  });

  useEffect(() => {
    const calculateBounds = () => {
      const container = document.querySelector(".game-table-area");
      const table = document.querySelector(".poker-table");
      const topPanel = document.querySelector(".opponent-top .opponent-panel");
      const userHand = document.querySelector(".user-hand-panel");
      const leftPanel = document.querySelector(
        ".opponent-left .opponent-panel",
      );
      const rightPanel = document.querySelector(
        ".opponent-right .opponent-panel",
      );

      if (!container || !table) return;

      const containerRect = container.getBoundingClientRect();
      const tableRect = table.getBoundingClientRect();
      const containerHeight = containerRect.height;
      const containerWidth = containerRect.width;

      const gap = 4;
      const minEdgePadding = 4;

      const tableTopRelative = tableRect.top - containerRect.top;
      const topPanelHeight = topPanel?.getBoundingClientRect().height || 60;
      const topPosition = Math.max(
        2,
        ((tableTopRelative - topPanelHeight - gap) / containerHeight) * 100,
      );

      const tableBottomRelative = tableRect.bottom - containerRect.top;
      const userHandHeight = userHand?.getBoundingClientRect().height || 120;
      const bottomPosition = Math.max(
        2,
        ((containerHeight - tableBottomRelative - userHandHeight - gap) /
          containerHeight) *
          100,
      );

      const leftPanelWidth = leftPanel?.getBoundingClientRect().width || 80;
      const rightPanelWidth = rightPanel?.getBoundingClientRect().width || 80;

      const tableLeftRelative = tableRect.left - containerRect.left;
      const tableRightRelative = containerRect.right - tableRect.right;

      const spaceOnLeft = tableLeftRelative;
      const spaceOnRight = tableRightRelative;

      let leftPosition, rightPosition;

      if (spaceOnLeft < leftPanelWidth + minEdgePadding) {
        leftPosition =
          ((minEdgePadding + leftPanelWidth / 2) / containerWidth) * 100;
      } else {
        leftPosition =
          ((tableLeftRelative - gap) / containerWidth) * 100 -
          (leftPanelWidth / 2 / containerWidth) * 100;
      }

      if (spaceOnRight < rightPanelWidth + minEdgePadding) {
        rightPosition =
          ((minEdgePadding + rightPanelWidth / 2) / containerWidth) * 100;
      } else {
        rightPosition =
          ((tableRightRelative - gap) / containerWidth) * 100 -
          (rightPanelWidth / 2 / containerWidth) * 100;
      }

      leftPosition = Math.max(
        (minEdgePadding / containerWidth) * 100 +
          (leftPanelWidth / 2 / containerWidth) * 100,
        leftPosition,
      );
      rightPosition = Math.max(
        (minEdgePadding / containerWidth) * 100 +
          (rightPanelWidth / 2 / containerWidth) * 100,
        rightPosition,
      );

      setBounds({
        topOffset: `${topPosition}%`,
        bottomOffset: `${bottomPosition}%`,
        leftOffset: `${leftPosition}%`,
        rightOffset: `${rightPosition}%`,
      });
    };

    const timer = setTimeout(calculateBounds, 150);
    const resizeTimerRef = { current: null };

    const handleResize = () => {
      clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(calculateBounds, 100);
    };

    const handleOrientationChange = () => {
      setTimeout(calculateBounds, 200);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    // Safety check for test environment where matchMedia may not be fully implemented
    const mediaQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(orientation: portrait)")
        : null;
    mediaQuery?.addEventListener?.("change", handleOrientationChange);

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimerRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      mediaQuery?.removeEventListener?.("change", handleOrientationChange);
    };
  }, []);

  return bounds;
};

const getBorderStyle = (cardCount, selectedCard) => {
  if (cardCount > 0) return "none";
  if (selectedCard) return "2px solid var(--color-gold-base)";
  return "2px dashed var(--color-text-on-felt-muted)";
};

const PlayArea = ({
  playAreaCards,
  cardPositions,
  trickWinner,
  selectedCard,
  onPlayCard,
}) => {
  const handleClick = () => {
    if (selectedCard && onPlayCard) {
      onPlayCard();
    }
  };

  return (
    <div
      className={`play-area-drop absolute rounded-xl flex items-center justify-center ${selectedCard ? "play-area-ready" : ""}`}
      onClick={handleClick}
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "clamp(140px, 55vw, 320px)",
        height: "clamp(60px, 20vw, 160px)",
        backgroundColor: "transparent",
        border: getBorderStyle(playAreaCards.length, selectedCard),
        cursor: selectedCard ? "pointer" : "default",
        overflow: "visible",
      }}
    >
      {playAreaCards.length === 0 ? (
        <div
          className="text-sm font-medium text-center play-area-text"
          style={{
            color: selectedCard ? "#ffffff" : "var(--color-text-on-felt)",
            textShadow: selectedCard
              ? "0 0 12px rgba(255, 255, 255, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)"
              : "none",
            fontWeight: selectedCard ? 600 : 500,
            letterSpacing: selectedCard ? "0.02em" : "normal",
          }}
        >
          {selectedCard ? "Tap here to play" : "Select a card"}
        </div>
      ) : (
        <div
          className="played-cards-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(2px, 1.5vw, 10px)",
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
        >
          {playAreaCards.map(([playerId, card], index) => (
            <PlayedCard
              key={`${playerId}-${card.id}`}
              card={card}
              position={cardPositions[index]}
              isWinner={trickWinner === playerId}
              useFlexLayout={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

PlayArea.propTypes = {
  playAreaCards: PropTypes.array.isRequired,
  cardPositions: PropTypes.array.isRequired,
  trickWinner: PropTypes.string,
  selectedCard: PropTypes.object,
  onPlayCard: PropTypes.func.isRequired,
};

const PokerTable = () => (
  <div
    className="poker-table absolute felt-gradient"
    style={{
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      boxShadow: "var(--shadow-table-rim)",
    }}
  />
);

const OpponentPosition = ({
  player,
  index,
  currentPlayer,
  isDealing,
  position,
  topOffset,
  leftOffset,
  rightOffset,
  players,
  scores,
}) => {
  const positionStyles = {
    top: {
      top: topOffset || "15%",
      left: "50%",
      transform: "translateX(-50%)",
    },
    left: {
      left: leftOffset || "5%",
      top: "50%",
      transform: "translateY(-50%)",
    },
    right: {
      right: rightOffset || "5%",
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
        players={players}
        scores={scores}
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
  topOffset: PropTypes.string,
  leftOffset: PropTypes.string,
  rightOffset: PropTypes.string,
  players: PropTypes.array.isRequired,
  scores: PropTypes.array.isRequired,
};

const GameTable = ({
  players,
  gameState,
  playAreaCards,
  cardPositions,
  trickWinner,
  dealingAnimation,
  selectedCard,
  handleCardSelect,
  handlePlaySelectedCard,
  ruleSetName = "Highest Card Wins",
  ruleSetDescription = "The highest card value wins the trick",
  scores = [],
}) => {
  const [instructionDismissed, setInstructionDismissed] = useState(false);
  const { topOffset, bottomOffset, leftOffset, rightOffset } = useTableBounds();

  const isPlayerTurn =
    gameState.phase === GAME_PHASES.PLAYING &&
    gameState.currentPlayer === 0 &&
    !dealingAnimation;

  const shouldShowInstruction =
    isPlayerTurn && playAreaCards.length === 0 && !instructionDismissed;

  const shouldShowHint =
    gameState.phase === GAME_PHASES.PLAYING &&
    gameState.currentPlayer === 0 &&
    playAreaCards.length === 0 &&
    !dealingAnimation &&
    instructionDismissed;

  const handleInstructionDismiss = useCallback(() => {
    setInstructionDismissed(true);
  }, []);

  const handleCardSelectWithDismiss = useCallback(
    (card) => {
      setInstructionDismissed(true);
      handleCardSelect(card);
    },
    [handleCardSelect],
  );

  return (
    <div className="game-table-area flex-1 relative" style={{ minHeight: 0 }}>
      <PokerTable />

      <PlayArea
        playAreaCards={playAreaCards}
        cardPositions={cardPositions}
        trickWinner={trickWinner}
        selectedCard={selectedCard}
        onPlayCard={handlePlaySelectedCard}
      />

      <TurnInstructionOverlay
        visible={shouldShowInstruction}
        ruleSetName={ruleSetName}
        ruleSetDescription={ruleSetDescription}
        onDismiss={handleInstructionDismiss}
      />

      <DragHint
        key={`hint-${gameState.phase}-${gameState.currentPlayer}`}
        visible={shouldShowHint}
        hasSelectedCard={!!selectedCard}
      />

      <OpponentPosition
        player={players[2]}
        index={2}
        currentPlayer={gameState.currentPlayer}
        isDealing={dealingAnimation}
        position="top"
        topOffset={topOffset}
        players={players}
        scores={scores}
      />

      <OpponentPosition
        player={players[1]}
        index={1}
        currentPlayer={gameState.currentPlayer}
        isDealing={dealingAnimation}
        position="left"
        leftOffset={leftOffset}
        players={players}
        scores={scores}
      />

      <OpponentPosition
        player={players[3]}
        index={3}
        currentPlayer={gameState.currentPlayer}
        isDealing={dealingAnimation}
        position="right"
        rightOffset={rightOffset}
        players={players}
        scores={scores}
      />

      <div
        className="absolute user-hand-area"
        style={{
          bottom: bottomOffset,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <UserHand
          player={players[0]}
          playerIndex={0}
          currentPlayer={gameState.currentPlayer}
          gamePhase={gameState.phase}
          selectedCard={selectedCard}
          dealingAnimation={dealingAnimation}
          onCardSelect={handleCardSelectWithDismiss}
          players={players}
          scores={scores}
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
  selectedCard: PropTypes.object,
  handleCardSelect: PropTypes.func.isRequired,
  handlePlaySelectedCard: PropTypes.func.isRequired,
  ruleSetName: PropTypes.string,
  ruleSetDescription: PropTypes.string,
  scores: PropTypes.array,
};

export default GameTable;
