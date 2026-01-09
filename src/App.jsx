import { useState } from "react";
import { Toaster } from "sonner";
import Confetti from "react-confetti";

import { useTheme, useWindowSize, useAppLoading, useGameLogic } from "./hooks";

import {
  Header,
  LandscapeMenu,
  HowToPlayModal,
  LoadingScreen,
  WaitingRoom,
  Leaderboard,
  GameTable,
  WinnerModal,
  TurnTimer,
} from "./components";
import ErrorBoundary from "./components/ErrorBoundary";

import { CardCustomizationProvider } from "./context";

import ruleSets from "./config/ruleSets";

import { CONFETTI_COLORS, GAME_PHASES } from "./constants";

import "./styles/gameStyles.css";

function AppContent() {
  const { theme, toggleTheme } = useTheme();

  const windowSize = useWindowSize();

  const { isAppLoading, showLoadingScreen, handleLoadingComplete } =
    useAppLoading();

  const [selectedRuleSet, setSelectedRuleSet] = useState(0);
  const [isLandscapeHelpOpen, setIsLandscapeHelpOpen] = useState(false);

  const {
    gameState,
    players,
    playAreaCards,
    cardPositions,
    selectedCard,
    dealingAnimation,
    trickWinner,
    showWinnerModal,
    showConfetti,
    startGame,
    resetGame,
    getGameWinner,
    handleCardSelect,
    handlePlaySelectedCard,
    autoPlayCard,
    username,
    setUsername,
  } = useGameLogic(selectedRuleSet);

  const isGameActive =
    gameState.phase === GAME_PHASES.DEALING ||
    gameState.phase === GAME_PHASES.PLAYING ||
    gameState.phase === GAME_PHASES.EVALUATING;

  const winner = showWinnerModal ? getGameWinner() : null;

  return (
    <>
      {showLoadingScreen && (
        <LoadingScreen
          isLoading={isAppLoading}
          onLoadingComplete={handleLoadingComplete}
          minDisplayTime={1800}
          theme={theme}
        />
      )}

      <div
        className={`min-h-screen transition-all duration-500 relative flex flex-col ${
          showLoadingScreen ? "opacity-0" : "opacity-100"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at top, var(--color-bg-surface) 0%, var(--color-bg-base) 50%, var(--color-bg-deep) 100%)",
          transition: "opacity 400ms ease-in",
        }}
      >
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

        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          selectedRuleSet={selectedRuleSet}
          setSelectedRuleSet={setSelectedRuleSet}
          ruleSets={ruleSets}
          resetGame={resetGame}
        />

        <LandscapeMenu
          theme={theme}
          toggleTheme={toggleTheme}
          ruleSets={ruleSets}
          selectedRuleSet={selectedRuleSet}
          setSelectedRuleSet={setSelectedRuleSet}
          resetGame={resetGame}
          onHelpClick={() => setIsLandscapeHelpOpen(true)}
        />

        <HowToPlayModal
          isOpen={isLandscapeHelpOpen}
          onClose={() => setIsLandscapeHelpOpen(false)}
          ruleSetName={ruleSets[selectedRuleSet]?.name || "Highest Card Wins"}
        />

        {isGameActive && (
          <div
            className="game-info-banner w-full text-center py-2 px-4"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, var(--color-panel-base) 20%, var(--color-panel-base) 80%, transparent 100%)",
              borderBottom: "1px solid var(--color-border-default)",
            }}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
              <span
                className="font-semibold"
                style={{
                  color: "var(--color-gold-base)",
                  fontSize: "clamp(12px, 2.5vw, 14px)",
                  fontFamily: "var(--font-display)",
                  textShadow:
                    theme === "dark"
                      ? "0 0 8px rgba(212, 175, 55, 0.3)"
                      : "none",
                }}
              >
                {ruleSets[selectedRuleSet].name}
              </span>
              <span
                style={{
                  color: "var(--color-text-primary)",
                  fontSize: "clamp(10px, 2vw, 12px)",
                  opacity: 0.5,
                }}
              >
                •
              </span>
              <span
                style={{
                  color: "var(--color-text-primary)",
                  fontSize: "clamp(10px, 2vw, 12px)",
                }}
              >
                {ruleSets[selectedRuleSet].description}
              </span>
            </div>
          </div>
        )}

        <div
          className="main-content-area max-w-7xl mx-auto px-3 py-2 flex flex-col w-full"
          style={{
            paddingLeft: "max(12px, env(safe-area-inset-left))",
            paddingRight: "max(12px, env(safe-area-inset-right))",
          }}
        >
          {gameState.phase === GAME_PHASES.WAITING && (
            <WaitingRoom
              players={players}
              startGame={startGame}
              username={username}
              setUsername={setUsername}
              ruleSets={ruleSets}
              selectedRuleSet={selectedRuleSet}
              setSelectedRuleSet={setSelectedRuleSet}
            />
          )}

          {isGameActive && (
            <div className="game-layout flex-1 relative">
              <GameTable
                players={players}
                gameState={gameState}
                playAreaCards={playAreaCards}
                cardPositions={cardPositions}
                trickWinner={trickWinner}
                dealingAnimation={dealingAnimation}
                selectedCard={selectedCard}
                handleCardSelect={handleCardSelect}
                handlePlaySelectedCard={handlePlaySelectedCard}
                ruleSetName={ruleSets[selectedRuleSet].name}
                ruleSetDescription={ruleSets[selectedRuleSet].description}
                scores={gameState.scores}
              />

              <Leaderboard
                players={players}
                scores={gameState.scores}
                currentPlayer={gameState.currentPlayer}
                trickWinner={trickWinner}
                ruleSetName={ruleSets[selectedRuleSet].name}
              />

              <div
                className="turn-timer-container"
                style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "0",
                  zIndex: 30,
                }}
              >
                <TurnTimer
                  isActive={
                    gameState.phase === GAME_PHASES.PLAYING &&
                    gameState.currentPlayer === 0 &&
                    !dealingAnimation
                  }
                  onTimeUp={autoPlayCard}
                  isPaused={gameState.phase !== GAME_PHASES.PLAYING}
                />
              </div>
            </div>
          )}

          {showWinnerModal && winner && (
            <WinnerModal
              players={players}
              scores={gameState.scores}
              winner={winner}
              resetGame={resetGame}
            />
          )}
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary componentName="App" showDetails={true}>
      <CardCustomizationProvider>
        <AppContent />
      </CardCustomizationProvider>
    </ErrorBoundary>
  );
}

export default App;
