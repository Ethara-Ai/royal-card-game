import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  INITIAL_GAME_STATE,
  INITIAL_PLAYERS,
  SUITS,
  CARDS_PER_PLAYER,
  CARD_POSITIONS,
  ANIMATION_TIMINGS,
  GAME_PHASES,
  PLAYER_COUNT,
} from "../constants";
import ruleSets from "../config/ruleSets";
import { getPlayerDisplayName } from "../utils/playerUtils";

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Creates a standard 52-card deck
 * @returns {Array} Shuffled deck of cards
 */
const createDeck = () => {
  const newDeck = [];
  SUITS.forEach((suit) => {
    for (let rank = 1; rank <= 13; rank++) {
      newDeck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value: rank === 1 ? 14 : rank, // Ace is highest
      });
    }
  });
  return shuffleArray(newDeck);
};

/**
 * Gets a random card from a hand
 * @param {Array} hand - Array of cards
 * @returns {Object|null} Random card or null
 */
const getRandomCard = (hand) => {
  if (!hand || hand.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * hand.length);
  return hand[randomIndex];
};

/**
 * Custom hook for managing all game logic
 * @param {number} selectedRuleSet - Index of selected rule set
 * @returns {Object} Game state and handlers
 */
const useGameLogic = (selectedRuleSet = 0) => {
  // Player state
  const [username, setUsername] = useState("");
  const [basePlayers, setBasePlayers] = useState(INITIAL_PLAYERS);

  // Game state
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [playArea, setPlayArea] = useState({});
  const [leadPlayerId, setLeadPlayerId] = useState(null);

  // UI state
  const [selectedCard, setSelectedCard] = useState(null);
  const [dealingAnimation, setDealingAnimation] = useState(false);
  const [trickWinner, setTrickWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Refs for managing async operations and recursive callbacks
  const abortControllerRef = useRef(null);
  const timeoutIdsRef = useRef(new Set());
  const playAICardRef = useRef(null);

  // Compute players with username applied
  const players = useMemo(
    () =>
      basePlayers.map((player) =>
        player.id === "player1" && username.trim()
          ? { ...player, name: username.trim() }
          : player,
      ),
    [basePlayers, username],
  );

  // Cleanup function for timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current.clear();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    abortControllerRef.current = new AbortController();
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  /**
   * Safe timeout that automatically cleans up
   * @param {Function} callback - Function to call
   * @param {number} delay - Delay in ms
   * @returns {number} Timeout ID
   */
  const safeSetTimeout = useCallback((callback, delay) => {
    const id = setTimeout(() => {
      timeoutIdsRef.current.delete(id);
      // Check if component is still mounted via AbortController
      if (
        abortControllerRef.current &&
        !abortControllerRef.current.signal.aborted
      ) {
        callback();
      }
    }, delay);
    timeoutIdsRef.current.add(id);
    return id;
  }, []);

  /**
   * Deals cards to all players
   */
  const dealCards = useCallback(() => {
    const deck = createDeck();
    setBasePlayers((prevPlayers) =>
      prevPlayers.map((player, index) => ({
        ...player,
        hand: deck.slice(
          index * CARDS_PER_PLAYER,
          (index + 1) * CARDS_PER_PLAYER,
        ),
        score: 0,
      })),
    );
    setPlayArea({});
    setLeadPlayerId(null);
  }, []);

  /**
   * Get card positions based on count
   */
  const getCardPositions = useCallback(
    (cardCount) => CARD_POSITIONS.slice(0, cardCount),
    [],
  );

  /**
   * Gets the game winner based on scores
   * Uses functional form to ensure fresh state
   */
  const getGameWinner = useCallback(
    (scores) => {
      const currentScores = scores || gameState.scores;
      const maxScore = Math.max(...currentScores);
      const winnerIndex = currentScores.findIndex(
        (score) => score === maxScore,
      );
      return { player: players[winnerIndex], score: maxScore };
    },
    [gameState.scores, players],
  );

  /**
   * Evaluates the current trick and determines winner
   * Uses functional updates to avoid stale closures
   */
  const evaluateTrick = useCallback(
    (trickCards, isLastTrick = false) => {
      setGameState((prev) => ({ ...prev, phase: GAME_PHASES.EVALUATING }));

      const winnerPlayerId = ruleSets[selectedRuleSet].evaluateWinner(
        trickCards,
        leadPlayerId,
      );
      const winnerIndex = players.findIndex((p) => p.id === winnerPlayerId);
      const winnerPlayer = players[winnerIndex];
      const winnerDisplayName = getPlayerDisplayName(winnerPlayer);

      setTrickWinner(winnerPlayerId);
      toast.success(`${winnerDisplayName} wins the trick!`);

      safeSetTimeout(() => {
        // Use functional update to ensure fresh state
        setGameState((prev) => {
          const newScores = [...prev.scores];
          newScores[winnerIndex] += 1;

          return {
            ...prev,
            scores: newScores,
            currentPlayer: winnerIndex,
            phase: isLastTrick ? GAME_PHASES.GAME_OVER : GAME_PHASES.PLAYING,
          };
        });

        setPlayArea({});
        setLeadPlayerId(null);
        setTrickWinner(null);
        setSelectedCard(null);

        if (isLastTrick) {
          // Get winner using updated scores
          setGameState((prev) => {
            const maxScore = Math.max(...prev.scores);
            const gameWinnerIndex = prev.scores.findIndex(
              (score) => score === maxScore,
            );
            const gameWinner = players[gameWinnerIndex];

            setShowWinnerModal(true);

            if (gameWinner.id === "player1") {
              setShowConfetti(true);
              toast.success("Congratulations! You won the game!");
              safeSetTimeout(
                () => setShowConfetti(false),
                ANIMATION_TIMINGS.confettiDuration,
              );
            } else {
              toast.info(`${getPlayerDisplayName(gameWinner)} wins the game!`);
            }

            return prev;
          });
        } else if (winnerIndex !== 0) {
          // AI won the trick, they lead next
          safeSetTimeout(() => {
            if (playAICardRef.current) {
              playAICardRef.current(winnerIndex, {});
            }
          }, ANIMATION_TIMINGS.dealingAnimation);
        }
      }, ANIMATION_TIMINGS.trickEvaluationDelay);

      // Return winner index for AI to continue
      return winnerIndex;
    },
    [selectedRuleSet, players, leadPlayerId, safeSetTimeout],
  );

  /**
   * AI plays a card - uses refs for recursive calls to avoid stale closures
   */
  const playAICard = useCallback(
    (playerIndex, currentPlayArea) => {
      // Get current game state and players via functional access
      setGameState((prevGameState) => {
        if (prevGameState.phase !== GAME_PHASES.PLAYING) {
          return prevGameState;
        }

        setBasePlayers((prevPlayers) => {
          const player = prevPlayers[playerIndex];
          if (!player || player.hand.length === 0) {
            return prevPlayers;
          }

          const randomCard = getRandomCard(player.hand);
          if (!randomCard) {
            return prevPlayers;
          }

          // Update play area
          const newPlayArea = { ...currentPlayArea, [player.id]: randomCard };
          setPlayArea(newPlayArea);

          // Set lead player if first card
          if (Object.keys(currentPlayArea).length === 0) {
            setLeadPlayerId(player.id);
          }

          // Check if trick is complete
          if (Object.keys(newPlayArea).length === PLAYER_COUNT) {
            const isLastTrick = player.hand.length - 1 === 0;
            safeSetTimeout(() => {
              evaluateTrick(newPlayArea, isLastTrick);
            }, ANIMATION_TIMINGS.cardPlayDelay);
          } else {
            // Next player's turn
            const nextPlayer = (playerIndex + 1) % PLAYER_COUNT;
            setGameState((prev) => ({ ...prev, currentPlayer: nextPlayer }));

            if (nextPlayer !== 0) {
              safeSetTimeout(() => {
                // Use ref for recursive call to avoid stale closure
                if (playAICardRef.current) {
                  playAICardRef.current(nextPlayer, newPlayArea);
                }
              }, ANIMATION_TIMINGS.aiPlayDelay);
            }
          }

          // Return updated players with card removed
          return prevPlayers.map((p, idx) =>
            idx === playerIndex
              ? { ...p, hand: p.hand.filter((c) => c.id !== randomCard.id) }
              : p,
          );
        });

        return prevGameState;
      });
    },
    [safeSetTimeout, evaluateTrick],
  );

  // Keep ref updated with latest playAICard
  useEffect(() => {
    playAICardRef.current = playAICard;
  }, [playAICard]);

  /**
   * Human player plays a card
   */
  const playCard = useCallback(
    (card, playerId) => {
      setGameState((prevGameState) => {
        if (prevGameState.phase !== GAME_PHASES.PLAYING) {
          return prevGameState;
        }

        const playerIndex = players.findIndex((p) => p.id === playerId);
        if (playerIndex === -1 || playerIndex !== prevGameState.currentPlayer) {
          return prevGameState;
        }

        // Update players
        setBasePlayers((prevPlayers) => {
          const player = prevPlayers[playerIndex];
          if (!player) return prevPlayers;

          // Update play area
          setPlayArea((prevPlayArea) => {
            const newPlayArea = { ...prevPlayArea, [playerId]: card };

            // Set lead player if first card
            if (Object.keys(prevPlayArea).length === 0) {
              setLeadPlayerId(playerId);
            }

            // Check if trick is complete
            if (Object.keys(newPlayArea).length === PLAYER_COUNT) {
              const isLastTrick = player.hand.length - 1 === 0;
              safeSetTimeout(() => {
                evaluateTrick(newPlayArea, isLastTrick);
              }, ANIMATION_TIMINGS.cardPlayDelay);
            } else {
              // Next player's turn
              const nextPlayer =
                (prevGameState.currentPlayer + 1) % PLAYER_COUNT;
              setGameState((prev) => ({ ...prev, currentPlayer: nextPlayer }));

              if (nextPlayer !== 0) {
                safeSetTimeout(() => {
                  if (playAICardRef.current) {
                    playAICardRef.current(nextPlayer, newPlayArea);
                  }
                }, ANIMATION_TIMINGS.aiPlayDelay);
              }
            }

            return newPlayArea;
          });

          // Remove card from hand
          return prevPlayers.map((p, idx) =>
            idx === playerIndex
              ? { ...p, hand: p.hand.filter((c) => c.id !== card.id) }
              : p,
          );
        });

        if (playerIndex === 0) {
          toast.success("Card played!");
          setSelectedCard(null);
        }

        return prevGameState;
      });
    },
    [players, safeSetTimeout, evaluateTrick],
  );

  /**
   * Handles card selection by human player
   */
  const handleCardSelect = useCallback(
    (card) => {
      if (
        gameState.currentPlayer !== 0 ||
        gameState.phase !== GAME_PHASES.PLAYING
      ) {
        return;
      }

      setSelectedCard((prev) => (prev?.id === card.id ? null : card));
    },
    [gameState.currentPlayer, gameState.phase],
  );

  /**
   * Plays the currently selected card
   */
  const handlePlaySelectedCard = useCallback(() => {
    if (!selectedCard || gameState.currentPlayer !== 0) return;
    playCard(selectedCard, "player1");
  }, [selectedCard, gameState.currentPlayer, playCard]);

  /**
   * Auto-plays a random card (timeout scenario)
   */
  const autoPlayCard = useCallback(() => {
    if (
      gameState.currentPlayer !== 0 ||
      gameState.phase !== GAME_PHASES.PLAYING
    ) {
      return;
    }

    const playerHand = players[0]?.hand;
    if (!playerHand || playerHand.length === 0) return;

    const randomCard = getRandomCard(playerHand);
    if (!randomCard) return;

    toast.info("Time's up! Auto-playing a card...");
    playCard(randomCard, "player1");
  }, [gameState.currentPlayer, gameState.phase, players, playCard]);

  /**
   * Starts a new game
   */
  const startGame = useCallback(() => {
    if (gameState.phase !== GAME_PHASES.WAITING) return;

    setDealingAnimation(true);
    setGameState((prev) => ({ ...prev, phase: GAME_PHASES.DEALING }));
    toast.success("Game starting! Cards are being dealt...");

    safeSetTimeout(() => {
      dealCards();
      safeSetTimeout(() => {
        setDealingAnimation(false);
        setGameState((prev) => ({ ...prev, phase: GAME_PHASES.PLAYING }));
        toast.info(
          "Your turn! Tap a card to select, then tap the table to play",
        );
      }, ANIMATION_TIMINGS.dealingAnimation);
    }, ANIMATION_TIMINGS.dealingDelay);
  }, [gameState.phase, dealCards, safeSetTimeout]);

  /**
   * Resets the game to initial state
   */
  const resetGame = useCallback(() => {
    clearAllTimeouts();

    setGameState(INITIAL_GAME_STATE);
    setPlayArea({});
    setLeadPlayerId(null);
    setShowWinnerModal(false);
    setTrickWinner(null);
    setShowConfetti(false);
    setSelectedCard(null);
    setDealingAnimation(false);
    setBasePlayers((prev) => prev.map((p) => ({ ...p, hand: [], score: 0 })));

    toast.info("Game reset! Ready for a new game?");
  }, [clearAllTimeouts]);

  // Derived values
  const playAreaCards = Object.entries(playArea);
  const cardPositions = getCardPositions(playAreaCards.length);

  return {
    // State
    gameState,
    players,
    playArea,
    playAreaCards,
    cardPositions,
    selectedCard,
    dealingAnimation,
    trickWinner,
    showWinnerModal,
    showConfetti,

    // Actions
    startGame,
    resetGame,
    playCard,
    getGameWinner,

    // Handlers
    handleCardSelect,
    handlePlaySelectedCard,
    autoPlayCard,

    // Setters for UI control
    setShowWinnerModal,
    setShowConfetti,

    // Username
    username,
    setUsername,
  };
};

export default useGameLogic;
