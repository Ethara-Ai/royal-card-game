import { useState, useCallback, useRef, useLayoutEffect, memo } from "react";
import PropTypes from "prop-types";
import PlayerPanel from "./PlayerPanel";
import PlayedCard from "./PlayedCard";
import UserHand from "./UserHand";
import DragHint from "./DragHint";
import TurnInstructionOverlay from "./TurnInstructionOverlay";
import { GAME_PHASES } from "../constants";

/**
 * Custom hook for calculating table bounds using refs instead of DOM queries
 * @param {Object} refs - Object containing refs to key elements
 * @returns {Object} Calculated bounds for positioning elements
 */
const useTableBounds = (refs) => {
  const [bounds, setBounds] = useState({
    topOffset: "15%",
    bottomOffset: "16%",
    leftOffset: "5%",
    rightOffset: "5%",
  });

  useLayoutEffect(() => {
    const calculateBounds = () => {
      const container = refs.containerRef.current;
      const table = refs.tableRef.current;
      const topPanel = refs.topPanelRef.current;
      const userHand = refs.userHandRef.current;
      const leftPanel = refs.leftPanelRef.current;
      const rightPanel = refs.rightPanelRef.current;

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

    // Initial calculation with a small delay to ensure elements are rendered
    const timer = setTimeout(calculateBounds, 150);
    let resizeTimer = null;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculateBounds, 100);
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
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      mediaQuery?.removeEventListener?.("change", handleOrientationChange);
    };
  }, [refs]);

  return bounds;
};

/**
 * Get border style for play area based on state
 */
const getBorderStyle = (cardCount, selectedCard) => {
  if (cardCount > 0) return "none";
  if (selectedCard) return "2px solid var(--color-gold-base)";
  return "2px dashed var(--color-text-on-felt-muted)";
};

/**
 * Play Area component - center area where cards are played
 */
const PlayArea = memo(
  ({ playAreaCards, cardPositions, trickWinner, selectedCard, onPlayCard }) => {
    const handleClick = useCallback(() => {
      if (selectedCard && onPlayCard) {
        onPlayCard();
      }
    }, [selectedCard, onPlayCard]);

    return (
      <div
        className={`play-area-drop absolute rounded-xl flex items-center justify-center ${selectedCard ? "play-area-ready" : ""}`}
        onClick={handleClick}
        role="button"
        tabIndex={selectedCard ? 0 : -1}
        aria-label={selectedCard ? "Tap to play selected card" : "Play area"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick();
          }
        }}
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
  },
);

PlayArea.propTypes = {
  playAreaCards: PropTypes.array.isRequired,
  cardPositions: PropTypes.array.isRequired,
  trickWinner: PropTypes.string,
  selectedCard: PropTypes.object,
  onPlayCard: PropTypes.func.isRequired,
};

/**
 * Poker Table component - the felt table background
 */
const PokerTable = memo(({ tableRef }) => (
  <div
    ref={tableRef}
    className="poker-table absolute felt-gradient"
    style={{
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      boxShadow: "var(--shadow-table-rim)",
    }}
  />
));

PokerTable.propTypes = {
  tableRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
};

/**
 * Opponent Position component - wraps PlayerPanel with positioning
 */
const OpponentPosition = memo(
  ({
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
    panelRef,
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
        ref={panelRef}
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
  },
);

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
  panelRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
};

/**
 * GameTable component - main game table with all player positions
 * Memoized for performance optimization
 */
const GameTable = memo(
  ({
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
  }) => {
    const [instructionDismissed, setInstructionDismissed] = useState(false);

    // Create refs for all positioned elements
    const containerRef = useRef(null);
    const tableRef = useRef(null);
    const topPanelRef = useRef(null);
    const leftPanelRef = useRef(null);
    const rightPanelRef = useRef(null);
    const userHandRef = useRef(null);

    // Use refs for table bounds calculation
    const refs = {
      containerRef,
      tableRef,
      topPanelRef,
      leftPanelRef,
      rightPanelRef,
      userHandRef,
    };

    const { topOffset, bottomOffset, leftOffset, rightOffset } =
      useTableBounds(refs);

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

    // Get scores from gameState
    const scores = gameState.scores || [];

    return (
      <div
        ref={containerRef}
        className="game-table-area flex-1 relative"
        style={{ minHeight: 0 }}
      >
        <PokerTable tableRef={tableRef} />

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
          panelRef={topPanelRef}
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
          panelRef={leftPanelRef}
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
          panelRef={rightPanelRef}
        />

        <div
          ref={userHandRef}
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
          />
        </div>
      </div>
    );
  },
);

GameTable.propTypes = {
  players: PropTypes.array.isRequired,
  gameState: PropTypes.shape({
    phase: PropTypes.string.isRequired,
    currentPlayer: PropTypes.number.isRequired,
    scores: PropTypes.array,
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
};

export default GameTable;
