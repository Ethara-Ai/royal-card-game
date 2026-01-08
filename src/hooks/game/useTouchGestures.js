/**
 * Advanced Touch Gestures Hook
 * Provides comprehensive touch gesture support for mobile interactions
 * Includes swipe, long press, drag, pinch, and tap detection
 */

import { useState, useCallback, useRef, useEffect, useMemo } from "react";

/**
 * Default configuration for touch gestures
 */
const DEFAULT_CONFIG = {
  swipeThreshold: 50, // Minimum distance for swipe (pixels)
  swipeVelocityThreshold: 0.3, // Minimum velocity for swipe (pixels/ms)
  longPressDelay: 500, // Long press duration (ms)
  tapThreshold: 10, // Maximum movement for tap (pixels)
  doubleTapDelay: 300, // Maximum time between taps (ms)
  dragThreshold: 5, // Minimum movement to start drag (pixels)
  pinchThreshold: 10, // Minimum distance change for pinch (pixels)
  preventDefaultEvents: true, // Prevent default touch behavior
};

/**
 * Custom hook for advanced touch gestures
 * @param {Object} options - Configuration options
 * @param {Function} options.onSwipe - Callback for swipe gesture (direction, velocity, distance)
 * @param {Function} options.onSwipeLeft - Callback for left swipe
 * @param {Function} options.onSwipeRight - Callback for right swipe
 * @param {Function} options.onSwipeUp - Callback for up swipe
 * @param {Function} options.onSwipeDown - Callback for down swipe
 * @param {Function} options.onTap - Callback for tap gesture
 * @param {Function} options.onDoubleTap - Callback for double tap gesture
 * @param {Function} options.onLongPress - Callback for long press gesture
 * @param {Function} options.onDragStart - Callback when drag starts
 * @param {Function} options.onDragMove - Callback during drag (delta, position)
 * @param {Function} options.onDragEnd - Callback when drag ends
 * @param {Function} options.onPinch - Callback for pinch gesture (scale, center)
 * @param {Object} options.config - Custom configuration overrides
 * @param {boolean} options.enabled - Whether gestures are enabled
 * @returns {Object} Touch event handlers and state
 */
export const useTouchGestures = ({
  onSwipe,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onDoubleTap,
  onLongPress,
  onDragStart,
  onDragMove,
  onDragEnd,
  onPinch,
  config: customConfig = {},
  enabled = true,
} = {}) => {
  const config = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...customConfig }),
    [customConfig],
  );

  // Touch state
  const [touchState, setTouchState] = useState({
    isTouching: false,
    isDragging: false,
    isPinching: false,
  });

  // Refs for tracking touch data
  const touchStartRef = useRef(null);
  const touchCurrentRef = useRef(null);
  const longPressTimerRef = useRef(null);
  const lastTapTimeRef = useRef(0);
  const tapCountRef = useRef(0);
  const initialPinchDistanceRef = useRef(null);
  const hasDragStartedRef = useRef(false);

  /**
   * Calculates distance between two points
   */
  const getDistance = useCallback((point1, point2) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  /**
   * Calculates distance between two touches (for pinch)
   */
  const getTouchDistance = useCallback((touch1, touch2) => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  /**
   * Gets the center point between two touches
   */
  const getTouchCenter = useCallback(
    (touch1, touch2) => ({
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    }),
    [],
  );

  /**
   * Determines swipe direction
   */
  const getSwipeDirection = useCallback((deltaX, deltaY) => {
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY) {
      return deltaX > 0 ? "right" : "left";
    }
    return deltaY > 0 ? "down" : "up";
  }, []);

  /**
   * Clears the long press timer
   */
  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  /**
   * Handle touch start event
   */
  const handleTouchStart = useCallback(
    (event) => {
      if (!enabled) return;

      const touch = event.touches[0];
      const touchData = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      touchStartRef.current = touchData;
      touchCurrentRef.current = touchData;
      hasDragStartedRef.current = false;

      setTouchState((prev) => ({
        ...prev,
        isTouching: true,
        isPinching: event.touches.length === 2,
      }));

      // Handle pinch start
      if (event.touches.length === 2) {
        const distance = getTouchDistance(event.touches[0], event.touches[1]);
        initialPinchDistanceRef.current = distance;
      } else {
        // Start long press timer for single touch
        longPressTimerRef.current = setTimeout(() => {
          if (onLongPress && touchStartRef.current) {
            const distance = getDistance(
              touchStartRef.current,
              touchCurrentRef.current,
            );
            if (distance < config.tapThreshold) {
              onLongPress(event, touchStartRef.current);
            }
          }
        }, config.longPressDelay);
      }

      if (config.preventDefaultEvents && event.cancelable) {
        event.preventDefault();
      }
    },
    [enabled, config, onLongPress, getDistance, getTouchDistance],
  );

  /**
   * Handle touch move event
   */
  const handleTouchMove = useCallback(
    (event) => {
      if (!enabled || !touchStartRef.current) return;

      const touch = event.touches[0];
      const currentPoint = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      touchCurrentRef.current = currentPoint;

      // Handle pinch gesture
      if (event.touches.length === 2 && onPinch) {
        const currentDistance = getTouchDistance(
          event.touches[0],
          event.touches[1],
        );
        const center = getTouchCenter(event.touches[0], event.touches[1]);

        if (initialPinchDistanceRef.current) {
          const scale = currentDistance / initialPinchDistanceRef.current;
          const deltaDistance =
            currentDistance - initialPinchDistanceRef.current;

          if (Math.abs(deltaDistance) > config.pinchThreshold) {
            onPinch({
              scale,
              distance: currentDistance,
              deltaDistance,
              center,
            });

            setTouchState((prev) => ({ ...prev, isPinching: true }));
          }
        }

        clearLongPressTimer();
        return;
      }

      // Calculate movement
      const deltaX = currentPoint.x - touchStartRef.current.x;
      const deltaY = currentPoint.y - touchStartRef.current.y;
      const distance = getDistance(touchStartRef.current, currentPoint);

      // Check if drag threshold exceeded
      if (distance > config.dragThreshold) {
        clearLongPressTimer();

        // Trigger drag start if not already dragging
        if (!hasDragStartedRef.current && onDragStart) {
          hasDragStartedRef.current = true;
          onDragStart(event, touchStartRef.current);
          setTouchState((prev) => ({ ...prev, isDragging: true }));
        }

        // Trigger drag move
        if (hasDragStartedRef.current && onDragMove) {
          onDragMove({
            delta: { x: deltaX, y: deltaY },
            position: currentPoint,
            distance,
          });
        }
      }

      if (config.preventDefaultEvents && event.cancelable) {
        event.preventDefault();
      }
    },
    [
      enabled,
      config.preventDefaultEvents,
      config.dragThreshold,
      config.pinchThreshold,
      onPinch,
      onDragStart,
      onDragMove,
      getDistance,
      getTouchDistance,
      getTouchCenter,
      clearLongPressTimer,
    ],
  );

  /**
   * Handle touch end event
   */
  const handleTouchEnd = useCallback(
    (event) => {
      if (!enabled || !touchStartRef.current) return;

      clearLongPressTimer();

      const touchEnd = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
        time: Date.now(),
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;
      const distance = getDistance(touchStartRef.current, touchEnd);
      const duration = touchEnd.time - touchStartRef.current.time;
      const velocity = duration > 0 ? distance / duration : 0;

      // Handle drag end
      if (hasDragStartedRef.current && onDragEnd) {
        onDragEnd({
          delta: { x: deltaX, y: deltaY },
          distance,
          duration,
          velocity,
        });
      }

      // Handle tap (no significant movement)
      if (distance < config.tapThreshold && !hasDragStartedRef.current) {
        const now = Date.now();
        const timeSinceLastTap = now - lastTapTimeRef.current;

        // Check for double tap
        if (
          timeSinceLastTap < config.doubleTapDelay &&
          tapCountRef.current === 1
        ) {
          if (onDoubleTap) {
            onDoubleTap(event, touchStartRef.current);
          }
          tapCountRef.current = 0;
        } else {
          // Single tap
          if (onTap) {
            onTap(event, touchStartRef.current);
          }
          tapCountRef.current = 1;
          lastTapTimeRef.current = now;

          // Reset tap count after delay
          setTimeout(() => {
            tapCountRef.current = 0;
          }, config.doubleTapDelay);
        }
      }

      // Handle swipe (sufficient distance and velocity)
      if (
        distance > config.swipeThreshold &&
        velocity > config.swipeVelocityThreshold &&
        !hasDragStartedRef.current
      ) {
        const direction = getSwipeDirection(deltaX, deltaY);

        // Call general swipe handler
        if (onSwipe) {
          onSwipe({
            direction,
            distance,
            velocity,
            deltaX,
            deltaY,
            duration,
          });
        }

        // Call direction-specific handlers
        switch (direction) {
          case "left":
            if (onSwipeLeft) onSwipeLeft({ distance, velocity });
            break;
          case "right":
            if (onSwipeRight) onSwipeRight({ distance, velocity });
            break;
          case "up":
            if (onSwipeUp) onSwipeUp({ distance, velocity });
            break;
          case "down":
            if (onSwipeDown) onSwipeDown({ distance, velocity });
            break;
          default:
            // No specific handler for this direction
            break;
        }
      }

      // Reset state
      setTouchState({
        isTouching: false,
        isDragging: false,
        isPinching: false,
      });

      touchStartRef.current = null;
      touchCurrentRef.current = null;
      initialPinchDistanceRef.current = null;
      hasDragStartedRef.current = false;

      if (config.preventDefaultEvents && event.cancelable) {
        event.preventDefault();
      }
    },
    [
      enabled,
      config,
      onSwipe,
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      onTap,
      onDoubleTap,
      onDragEnd,
      getDistance,
      getSwipeDirection,
      clearLongPressTimer,
    ],
  );

  /**
   * Handle touch cancel event
   */
  const handleTouchCancel = useCallback(
    (event) => {
      if (!enabled) return;

      clearLongPressTimer();

      setTouchState({
        isTouching: false,
        isDragging: false,
        isPinching: false,
      });

      touchStartRef.current = null;
      touchCurrentRef.current = null;
      initialPinchDistanceRef.current = null;
      hasDragStartedRef.current = false;

      if (config.preventDefaultEvents && event.cancelable) {
        event.preventDefault();
      }
    },
    [enabled, config.preventDefaultEvents, clearLongPressTimer],
  );

  /**
   * Cleanup on unmount
   */
  useEffect(
    () => () => {
      clearLongPressTimer();
    },
    [clearLongPressTimer],
  );

  /**
   * Get props to spread on a touchable element
   */
  const getTouchHandlers = useCallback(
    () => ({
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel,
    }),
    [handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel],
  );

  return {
    // State
    ...touchState,

    // Event handlers
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,

    // Convenience getter
    getTouchHandlers,
  };
};

/**
 * Hook for card-specific gestures (simplified interface)
 * Optimized for playing cards in the game
 */
export const useCardGestures = ({
  onCardPlay,
  onCardSelect,
  onCardPreview,
  enabled = true,
} = {}) =>
  useTouchGestures({
    enabled,
    onTap: (event, position) => {
      if (onCardSelect) {
        onCardSelect(event, position);
      }
    },
    onLongPress: (event, position) => {
      if (onCardPreview) {
        onCardPreview(event, position);
      }
    },
    onDragEnd: (data) => {
      if (onCardPlay && data.distance > 50) {
        onCardPlay(data);
      }
    },
    onSwipeUp: (data) => {
      if (onCardPlay && data.distance > 60) {
        onCardPlay(data);
      }
    },
    config: {
      swipeThreshold: 60,
      longPressDelay: 400,
      dragThreshold: 10,
    },
  });

export default useTouchGestures;
