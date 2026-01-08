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

const useGameLogic = (selectedRuleSet = 0) => {
  const [username, setUsername] = useState("");
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [basePlayers, setBasePlayers] = useState(INITIAL_PLAYERS);
  const [playArea, setPlayArea] = useState({});
  const [leadPlayerId, setLeadPlayerId] = useState(null);

  const players = useMemo(
    () =>
      basePlayers.map((player) =>
        player.id === "player1" && username.trim()
          ? { ...player, name: username.trim() }
          : player,
      ),
    [basePlayers, username],
  );

  const [selectedCard, setSelectedCard] = useState(null);
  const [dealingAnimation, setDealingAnimation] = useState(false);
  const [trickWinner, setTrickWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const playAICardRef = useRef(null);
  const timeoutIdsRef = useRef([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      timeoutIdsRef.current.forEach((id) => clearTimeout(id));
      timeoutIdsRef.current = [];
    };
  }, []);

  const safeSetTimeout = useCallback((callback, delay) => {
    const id = setTimeout(() => {
      timeoutIdsRef.current = timeoutIdsRef.current.filter((tid) => tid !== id);
      if (isMountedRef.current) {
        callback();
      }
    }, delay);
    timeoutIdsRef.current.push(id);
    return id;
  }, []);

  const shuffleDeck = (cards) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const createDeck = useCallback(() => {
    const newDeck = [];
    SUITS.forEach((suit) => {
      for (let rank = 1; rank <= 13; rank++) {
        newDeck.push({
          id: `${suit}-${rank}`,
          suit,
          rank,
          value: rank === 1 ? 14 : rank,
        });
      }
    });
    return shuffleDeck(newDeck);
  }, []);

  const dealCards = useCallback(() => {
    const newDeck = createDeck();
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

  const getCardPositions = useCallback(
    (cardCount) => CARD_POSITIONS.slice(0, cardCount),
    [],
  );

  const getRandomCard = (hand) => {
    const randomIndex = Math.floor(Math.random() * hand.length);
    return hand[randomIndex];
  };

  const getGameWinner = useCallback(
    (scores = gameState.scores) => {
      const maxScore = Math.max(...scores);
      const winnerIndex = scores.findIndex((score) => score === maxScore);
      return { player: players[winnerIndex], score: maxScore };
    },
    [gameState.scores, players],
  );

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
        setSelectedCard(null);

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
      getGameWinner,
      leadPlayerId,
      safeSetTimeout,
    ],
  );

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

      if (Object.keys(currentPlayArea).length === 0) {
        setLeadPlayerId(player.id);
      }

      if (Object.keys(newPlayArea).length === 4) {
        const isLastTrick = player.hand.length === 1;
        safeSetTimeout(() => {
          evaluateTrick(newPlayArea, isLastTrick);
        }, ANIMATION_TIMINGS.cardPlayDelay);
      } else {
        const nextPlayer = (playerIndex + 1) % 4;
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
    [players, gameState.phase, evaluateTrick, safeSetTimeout],
  );

  useEffect(() => {
    playAICardRef.current = playAICard;
  }, [playAICard]);

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

      if (Object.keys(playArea).length === 0) {
        setLeadPlayerId(playerId);
      }

      if (playerIndex === 0) {
        toast.success("Card played!");
        setSelectedCard(null);
      }

      if (Object.keys(newPlayArea).length === 4) {
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

  const handleCardSelect = useCallback(
    (card) => {
      if (
        gameState.currentPlayer !== 0 ||
        gameState.phase !== GAME_PHASES.PLAYING
      ) {
        return;
      }

      if (selectedCard?.id === card.id) {
        setSelectedCard(null);
      } else {
        setSelectedCard(card);
      }
    },
    [gameState, selectedCard],
  );

  const handlePlaySelectedCard = useCallback(() => {
    if (!selectedCard || gameState.currentPlayer !== 0) return;
    playCard(selectedCard, "player1");
  }, [selectedCard, gameState.currentPlayer, playCard]);

  const autoPlayCard = useCallback(() => {
    if (gameState.currentPlayer !== 0 || gameState.phase !== GAME_PHASES.PLAYING) return;
    
    const playerHand = players[0]?.hand;
    if (!playerHand || playerHand.length === 0) return;

    const randomCard = getRandomCard(playerHand);
    toast.info("Time's up! Auto-playing a card...");
    playCard(randomCard, "player1");
  }, [gameState.currentPlayer, gameState.phase, players, playCard]);

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
        toast.info("Your turn! Tap a card to select, then tap the table to play");
      }, ANIMATION_TIMINGS.dealingAnimation);
    }, ANIMATION_TIMINGS.dealingDelay);
  }, [gameState.phase, dealCards, safeSetTimeout]);

  const resetGame = useCallback(() => {
    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current = [];

    setGameState(INITIAL_GAME_STATE);
    setPlayArea({});
    setLeadPlayerId(null);
    setShowWinnerModal(false);
    setTrickWinner(null);
    setShowConfetti(false);
    setSelectedCard(null);
    const resetPlayers = basePlayers.map((p) => ({ ...p, hand: [], score: 0 }));
    setBasePlayers(resetPlayers);
    toast.info("Game reset! Ready for a new game?");
  }, [basePlayers]);

  const playAreaCards = Object.entries(playArea);
  const cardPositions = getCardPositions(playAreaCards.length);

  return {
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

    startGame,
    resetGame,
    playCard,
    getGameWinner,

    handleCardSelect,
    handlePlaySelectedCard,
    autoPlayCard,

    setShowWinnerModal,
    setShowConfetti,

    username,
    setUsername,
  };
};

export default useGameLogic;
