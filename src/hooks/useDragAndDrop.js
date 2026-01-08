import { useState, useCallback } from "react";
import { GAME_PHASES } from "../constants";

/**
 * Custom hook for managing drag and drop interactions for cards
 * Handles both mouse drag and touch events for mobile support
 *
 * @param {Object} gameState - Current game state with phase and currentPlayer
 * @param {Function} playCard - Function to play a card
 * @returns {Object} Drag state and event handlers
 */
const useDragAndDrop = (gameState, playCard) => {
  const [draggedCard, setDraggedCard] = useState(null);
  const [touchStartPos, setTouchStartPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Check if the current player can drag cards
   */
  const canDrag = useCallback(
    () =>
      gameState.currentPlayer === 0 && gameState.phase === GAME_PHASES.PLAYING,
    [gameState.currentPlayer, gameState.phase],
  );

  /**
   * Handle mouse drag start
   */
  const handleDragStart = useCallback(
    (e, card) => {
      if (!canDrag()) {
        e.preventDefault();
        return;
      }
      setDraggedCard(card);
    },
    [canDrag],
  );

  /**
   * Handle drag over event (allows drop)
   */
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  /**
   * Handle drop event - plays the dragged card
   */
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (!draggedCard || gameState.currentPlayer !== 0) return;
      playCard(draggedCard, "player1");
      setDraggedCard(null);
    },
    [draggedCard, gameState.currentPlayer, playCard],
  );

  /**
   * Handle drag end - cleanup
   */
  const handleDragEnd = useCallback(() => {
    setDraggedCard(null);
  }, []);

  /**
   * Handle touch start for mobile devices
   */
  const handleTouchStart = useCallback(
    (e, card) => {
      if (!canDrag()) {
        return;
      }
      const touch = e.touches[0];
      setTouchStartPos({ x: touch.clientX, y: touch.clientY });
      setDraggedCard(card);
      setIsDragging(true);
    },
    [canDrag],
  );

  /**
   * Handle touch move - prevent default scrolling while dragging
   */
  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging || !touchStartPos) return;
      e.preventDefault();
    },
    [isDragging, touchStartPos],
  );

  /**
   * Handle touch end - check if dropped in play area
   */
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

      // Reset state
      setTouchStartPos(null);
      setDraggedCard(null);
      setIsDragging(false);
    },
    [isDragging, draggedCard, touchStartPos, playCard],
  );

  return {
    // State
    draggedCard,
    isDragging,

    // Mouse drag handlers
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,

    // Touch handlers
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};

export default useDragAndDrop;
