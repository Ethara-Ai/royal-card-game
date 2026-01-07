import { useState } from "react";
import { Toaster } from "sonner";
import Confetti from "react-confetti";

// Hooks
import { useTheme, useWindowSize, useAppLoading, useGameLogic } from "./hooks";

// Components
import {
  Header,
  LoadingScreen,
  WaitingRoom,
  Leaderboard,
  GameTable,
  WinnerModal,
} from "./components";

// Config
import ruleSets from "./config/ruleSets";

// Constants
import {
  DEFAULT_CARD_BACK_COLOR,
  DEFAULT_CARD_BACK_PATTERN,
  CONFETTI_COLORS,
  GAME_PHASES,
} from "./constants";

// Styles
import "./styles/gameStyles.css";

function App() {
  // Theme management
  const { theme, toggleTheme } = useTheme();

  // Window size for confetti
  const windowSize = useWindowSize();

  // App loading state
  const { isAppLoading, showLoadingScreen, handleLoadingComplete } =
    useAppLoading();

  // Card customization state
  const [cardBackColor, setCardBackColor] = useState(DEFAULT_CARD_BACK_COLOR);
  const [cardBackPattern, setCardBackPattern] = useState(
    DEFAULT_CARD_BACK_PATTERN
  );
  const [selectedRuleSet, setSelectedRuleSet] = useState(0);

  // Game logic hook
  const {
    gameState,
    players,
    playAreaCards,
    cardPositions,
    draggedCard,
    dealingAnimation,
    trickWinner,
    showWinnerModal,
    showConfetti,
    startGame,
    resetGame,
    getGameWinner,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useGameLogic(selectedRuleSet);

  // Check if game is in active play state
  const isGameActive =
    gameState.phase === GAME_PHASES.DEALING ||
    gameState.phase === GAME_PHASES.PLAYING ||
    gameState.phase === GAME_PHASES.EVALUATING;

  return (
    <>
      {/* Loading Screen */}
      {showLoadingScreen && (
        <LoadingScreen
          isLoading={isAppLoading}
          onLoadingComplete={handleLoadingComplete}
          minDisplayTime={1800}
          theme={theme}
        />
      )}

      {/* Main App Container */}
      <div
        className={`min-h-screen transition-all duration-500 relative ${
          showLoadingScreen ? "opacity-0" : "opacity-100"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at top, var(--color-bg-surface) 0%, var(--color-bg-base) 50%, var(--color-bg-deep) 100%)",
          transition: "opacity 400ms ease-in",
        }}
      >
        {/* Winner Confetti */}
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
            colors={CONFETTI_COLORS}
          />
        )}

        {/* Toast Notifications */}
        <Toaster
          theme="dark"
          position="bottom-right"
          closeButton={false}
          richColors
          expand={false}
          visibleToasts={2}
          gap={4}
          toastOptions={{
            style: {
              background: "var(--color-panel-base)",
              border: "1px solid var(--color-border-default)",
              color: "var(--color-text-primary)",
              fontSize: "0.75rem",
              maxWidth: "200px",
              padding: "8px 12px",
              backdropFilter: "blur(8px)",
              boxShadow: "var(--shadow-md)",
            },
            duration: 1500,
          }}
        />

        {/* Header with Settings */}
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          cardBackColor={cardBackColor}
          setCardBackColor={setCardBackColor}
          cardBackPattern={cardBackPattern}
          setCardBackPattern={setCardBackPattern}
          selectedRuleSet={selectedRuleSet}
          setSelectedRuleSet={setSelectedRuleSet}
          ruleSets={ruleSets}
          resetGame={resetGame}
        />

        {/* Main Content Area */}
        <div
          className="max-w-7xl mx-auto px-3 py-4 min-h-[calc(100vh-80px)] flex flex-col"
          style={{
            paddingLeft: "max(12px, env(safe-area-inset-left))",
            paddingRight: "max(12px, env(safe-area-inset-right))",
          }}
        >
          {/* Waiting Room - Before Game Starts */}
          {gameState.phase === GAME_PHASES.WAITING && (
            <WaitingRoom players={players} startGame={startGame} />
          )}

          {/* Active Game Area */}
          {isGameActive && (
            <div className="game-layout flex-1 flex flex-row gap-4">
              {/* Leaderboard Sidebar */}
              <Leaderboard
                players={players}
                scores={gameState.scores}
                currentPlayer={gameState.currentPlayer}
                trickWinner={trickWinner}
                ruleSetName={ruleSets[selectedRuleSet].name}
              />

              {/* Game Table */}
              <GameTable
                players={players}
                gameState={gameState}
                playAreaCards={playAreaCards}
                cardPositions={cardPositions}
                trickWinner={trickWinner}
                cardBackColor={cardBackColor}
                cardBackPattern={cardBackPattern}
                dealingAnimation={dealingAnimation}
                draggedCard={draggedCard}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                handleTouchStart={handleTouchStart}
                handleTouchMove={handleTouchMove}
                handleTouchEnd={handleTouchEnd}
              />
            </div>
          )}

          {/* Winner Modal */}
          {showWinnerModal && (
            <WinnerModal
              players={players}
              scores={gameState.scores}
              getGameWinner={getGameWinner}
              resetGame={resetGame}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
