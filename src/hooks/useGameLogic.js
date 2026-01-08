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
} from "../constants";
import ruleSets from "../config/ruleSets";
import { getPlayerDisplayName } from "../utils/playerUtils";

/**
 * Custom hook for managing all game logic and state
 * Handles card dealing, playing, AI turns, trick evaluation, and game flow
 *
 * @param {number} selectedRuleSet - Index of the selected rule set
 * @returns {Object} Game state, players, and handler functions
 */
const useGameLogic = (selectedRuleSet = 0) => {
  // Username state for the human player
  const [username, setUsername] = useState("");

  // Core game state
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [basePlayers, setBasePlayers] = useState(INITIAL_PLAYERS);
  const [playArea, setPlayArea] = useState({});
  const [leadPlayerId, setLeadPlayerId] = useState(null);

  // Compute players with username applied to player1
  const players = useMemo(
    () =>
      basePlayers.map((player) =>
        player.id === "player1" && username.trim()
          ? { ...player, name: username.trim() }
          : player,
      ),
    [basePlayers, username],
  );

  // UI state
  const [draggedCard, setDraggedCard] = useState(null);
  const [dealingAnimation, setDealingAnimation] = useState(false);
  const [trickWinner, setTrickWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Touch interaction state
  const [touchStartPos, setTouchStartPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Refs for handling circular dependencies and cleanup
  const playAICardRef = useRef(null);
  const timeoutIdsRef = useRef([]);
  const isMountedRef = useRef(true);

  // Cleanup timeouts on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clear all pending timeouts
      timeoutIdsRef.current.forEach((id) => clearTimeout(id));
      timeoutIdsRef.current = [];
    };
  }, []);

  /**
   * Safe setTimeout that tracks IDs for cleanup and checks mount status
   */
  const safeSetTimeout = useCallback((callback, delay) => {
    const id = setTimeout(() => {
      // Remove this timeout from tracking
      timeoutIdsRef.current = timeoutIdsRef.current.filter((tid) => tid !== id);
      // Only execute if still mounted
      if (isMountedRef.current) {
        callback();
      }
    }, delay);
    timeoutIdsRef.current.push(id);
    return id;
  }, []);

  /**
   * Shuffles an array of cards using Fisher-Yates algorithm
   */
  const shuffleDeck = (cards) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  /**
   * Creates and shuffles a new deck of cards
   */
  const createDeck = useCallback(() => {
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
    return shuffleDeck(newDeck);
  }, []);

  /**
   * Deals cards to all players (immutable update)
   */
  const dealCards = useCallback(() => {
    const newDeck = createDeck();
    // Create new player objects instead of mutating existing ones
    const newPlayers = basePlayers.map((player, index) => ({
      ...player,
      hand: newDeck.slice(
        index * CARDS_PER_PLAYER,
        (index + 1) * CARDS_PER_PLAYER,
      ),
      score: 0,
    }));
    setBasePlayers(newPlayers);
    setPlayArea({});
  }, [createDeck, basePlayers]);

  /**
   * Gets card positions for played cards in the center
   */
  const getCardPositions = useCallback(
    (cardCount) => CARD_POSITIONS.slice(0, cardCount),
    [],
  );

  /**
   * Gets a random card from a player's hand
   */
  const getRandomCard = (hand) => {
    const randomIndex = Math.floor(Math.random() * hand.length);
    return hand[randomIndex];
  };

  /**
   * Determines the game winner based on scores
   */
  const getGameWinner = useCallback(
    (scores = gameState.scores) => {
      const maxScore = Math.max(...scores);
      const winnerIndex = scores.findIndex((score) => score === maxScore);
      return { player: players[winnerIndex], score: maxScore };
    },
    [gameState.scores, players],
  );

  /**
   * Evaluates the trick and determines the winner
   * @param {Object} trickCards - Cards played in the current trick
   * @param {boolean} isLastTrick - Whether this is the final trick of the game
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

      const newScores = [...gameState.scores];
      newScores[winnerIndex] += 1;

      safeSetTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          scores: newScores,
          currentPlayer: winnerIndex,
          phase: isLastTrick ? GAME_PHASES.GAME_OVER : GAME_PHASES.PLAYING,
        }));
        setPlayArea({});
        setLeadPlayerId(null);
        setTrickWinner(null);

        if (isLastTrick) {
          const winner = getGameWinner(newScores);
          setShowWinnerModal(true);
          if (winner.player.id === "player1") {
            setShowConfetti(true);
            toast.success(`Congratulations! You won the game!`);
            safeSetTimeout(
              () => setShowConfetti(false),
              ANIMATION_TIMINGS.confettiDuration,
            );
          } else {
            toast.info(`${getPlayerDisplayName(winner.player)} wins the game!`);
          }
        } else if (!isLastTrick && winnerIndex !== 0) {
          safeSetTimeout(() => {
            // Use ref to get the latest playAICard function
            if (playAICardRef.current) {
              playAICardRef.current(winnerIndex, {});
            }
          }, ANIMATION_TIMINGS.dealingAnimation);
        }
      }, ANIMATION_TIMINGS.trickEvaluationDelay);
    },
    [
      selectedRuleSet,
      players,
      gameState.scores,
      leadPlayerId,
      getGameWinner,
      safeSetTimeout,
    ],
  );

  /**
   * Plays a card for an AI player
   */
  const playAICard = useCallback(
    (playerIndex, currentPlayArea) => {
      const player = players[playerIndex];
      if (player.hand.length === 0 || gameState.phase !== GAME_PHASES.PLAYING) {
        return;
      }

      const randomCard = getRandomCard(player.hand);
      const newPlayers = [...players];
      newPlayers[playerIndex].hand = newPlayers[playerIndex].hand.filter(
        (c) => c.id !== randomCard.id,
      );
      setBasePlayers(newPlayers);

      const newPlayArea = { ...currentPlayArea, [player.id]: randomCard };
      setPlayArea(newPlayArea);

      // Track who led the trick (first card played)
      if (Object.keys(currentPlayArea).length === 0) {
        setLeadPlayerId(player.id);
      }

      if (Object.keys(newPlayArea).length === 4) {
        // Calculate if this is the last trick (all players will have 0 cards after this)
        const isLastTrick = player.hand.length === 1;
        safeSetTimeout(() => {
          evaluateTrick(newPlayArea, isLastTrick);
        }, ANIMATION_TIMINGS.cardPlayDelay);
      } else {
        const nextPlayer = (playerIndex + 1) % 4;
        setGameState((prev) => ({ ...prev, currentPlayer: nextPlayer }));
        if (nextPlayer !== 0) {
          safeSetTimeout(() => {
            // Use ref to get the latest playAICard function for recursive calls
            if (playAICardRef.current) {
              playAICardRef.current(nextPlayer, newPlayArea);
            }
          }, ANIMATION_TIMINGS.aiPlayDelay);
        }
      }
    },
    [players, gameState.phase, evaluateTrick, safeSetTimeout],
  );

  // Keep the ref updated with the latest playAICard function
  useEffect(() => {
    playAICardRef.current = playAICard;
  }, [playAICard]);

  /**
   * Plays a card for the human player
   */
  const playCard = useCallback(
    (card, playerId) => {
      if (gameState.phase !== GAME_PHASES.PLAYING) return;

      const playerIndex = players.findIndex((p) => p.id === playerId);
      if (playerIndex !== gameState.currentPlayer) return;

      const newPlayers = [...players];
      newPlayers[playerIndex].hand = newPlayers[playerIndex].hand.filter(
        (c) => c.id !== card.id,
      );
      setBasePlayers(newPlayers);

      const newPlayArea = { ...playArea, [playerId]: card };
      setPlayArea(newPlayArea);

      // Track who led the trick (first card played)
      if (Object.keys(playArea).length === 0) {
        setLeadPlayerId(playerId);
      }

      if (playerIndex === 0) {
        toast.success("Card played!");
      }

      if (Object.keys(newPlayArea).length === 4) {
        // Calculate if this is the last trick (player will have 0 cards after playing this one)
        const playerObj = players.find((p) => p.id === playerId);
        const isLastTrick = playerObj.hand.length === 1;
        safeSetTimeout(() => {
          evaluateTrick(newPlayArea, isLastTrick);
        }, ANIMATION_TIMINGS.cardPlayDelay);
      } else {
        const nextPlayer = (gameState.currentPlayer + 1) % 4;
        setGameState((prev) => ({ ...prev, currentPlayer: nextPlayer }));
        if (nextPlayer !== 0) {
          safeSetTimeout(() => {
            if (playAICardRef.current) {
              playAICardRef.current(nextPlayer, newPlayArea);
            }
          }, ANIMATION_TIMINGS.aiPlayDelay);
        }
      }
    },
    [gameState, players, playArea, evaluateTrick, safeSetTimeout],
  );

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
        toast.info("Your turn! Drag a card to the center");
      }, ANIMATION_TIMINGS.dealingAnimation);
    }, ANIMATION_TIMINGS.dealingDelay);
  }, [gameState.phase, dealCards, safeSetTimeout]);

  /**
   * Resets the game to initial state
   */
  const resetGame = useCallback(() => {
    // Clear all pending timeouts
    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current = [];

    setGameState(INITIAL_GAME_STATE);
    setPlayArea({});
    setLeadPlayerId(null);
    setShowWinnerModal(false);
    setTrickWinner(null);
    setShowConfetti(false);
    // Immutable update for players
    const resetPlayers = basePlayers.map((p) => ({ ...p, hand: [], score: 0 }));
    setBasePlayers(resetPlayers);
    toast.info("Game reset! Ready for a new game?");
  }, [basePlayers]);

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e, card) => {
      if (
        gameState.currentPlayer !== 0 ||
        gameState.phase !== GAME_PHASES.PLAYING
      ) {
        return;
      }
      const touch = e.touches[0];
      setTouchStartPos({ x: touch.clientX, y: touch.clientY });
      setDraggedCard(card);
      setIsDragging(true);
    },
    [gameState],
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging || !touchStartPos) return;
      e.preventDefault();
    },
    [isDragging, touchStartPos],
  );

  const handleTouchEnd = useCallback(
    (e) => {
      if (!isDragging || !draggedCard || !touchStartPos) return;
      const touch = e.changedTouches[0];
      const dropZone = document.elementFromPoint(touch.clientX, touch.clientY);
      if (
        dropZone?.classList.contains("play-area-drop") ||
        dropZone?.closest(".play-area-drop")
      ) {
        playCard(draggedCard, "player1");
      }
      setTouchStartPos(null);
      setDraggedCard(null);
      setIsDragging(false);
    },
    [isDragging, draggedCard, touchStartPos, playCard],
  );

  // Drag event handlers
  const handleDragStart = useCallback(
    (e, card) => {
      if (
        gameState.currentPlayer !== 0 ||
        gameState.phase !== GAME_PHASES.PLAYING
      ) {
        e.preventDefault();
        return;
      }
      setDraggedCard(card);
    },
    [gameState],
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (!draggedCard || gameState.currentPlayer !== 0) return;
      playCard(draggedCard, "player1");
      setDraggedCard(null);
    },
    [draggedCard, gameState.currentPlayer, playCard],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedCard(null);
  }, []);

  // Computed values
  const playAreaCards = Object.entries(playArea);
  const cardPositions = getCardPositions(playAreaCards.length);

  return {
    // State
    gameState,
    players,
    playArea,
    playAreaCards,
    cardPositions,
    draggedCard,
    dealingAnimation,
    trickWinner,
    showWinnerModal,
    showConfetti,

    // Actions
    startGame,
    resetGame,
    playCard,
    getGameWinner,

    // Drag handlers
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,

    // Touch handlers
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,

    // Setters for external control
    setShowWinnerModal,
    setShowConfetti,

    // Username management
    username,
    setUsername,
  };
};

export default useGameLogic;
