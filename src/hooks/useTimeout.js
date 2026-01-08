/**
 * Custom hook for safe timeout management in React components
 * Automatically cleans up timeouts on unmount to prevent memory leaks
 * Provides methods to create, cancel, and clear timeouts
 */

import { useEffect, useRef, useCallback } from "react";

/**
 * Hook for managing timeouts with automatic cleanup
 * @returns {Object} Timeout management functions
 */
const useTimeout = () => {
  const timeoutsRef = useRef(new Set());
  const isMountedRef = useRef(true);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    isMountedRef.current = true;
    const timeouts = timeoutsRef.current;

    return () => {
      isMountedRef.current = false;
      // Clear all pending timeouts
      timeouts.forEach((id) => clearTimeout(id));
      timeouts.clear();
    };
  }, []);

  /**
   * Creates a safe timeout that only executes if component is still mounted
   * @param {Function} callback - Function to execute after delay
   * @param {number} delay - Delay in milliseconds
   * @returns {number} Timeout ID that can be used to cancel
   */
  const safeSetTimeout = useCallback((callback, delay) => {
    if (!isMountedRef.current) {
      return null;
    }

    const id = setTimeout(() => {
      // Remove this timeout from tracking
      timeoutsRef.current.delete(id);

      // Only execute callback if component is still mounted
      if (isMountedRef.current && callback) {
        callback();
      }
    }, delay);

    // Track this timeout
    timeoutsRef.current.add(id);

    return id;
  }, []);

  /**
   * Cancels a specific timeout
   * @param {number} id - Timeout ID to cancel
   */
  const cancelTimeout = useCallback((id) => {
    if (id && timeoutsRef.current.has(id)) {
      clearTimeout(id);
      timeoutsRef.current.delete(id);
    }
  }, []);

  /**
   * Clears all pending timeouts
   */
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current.clear();
  }, []);

  /**
   * Gets the count of active timeouts (for debugging)
   * @returns {number} Number of active timeouts
   */
  const getActiveCount = useCallback(() => timeoutsRef.current.size, []);

  /**
   * Checks if component is still mounted
   * @returns {boolean} True if mounted
   */
  const isMounted = useCallback(() => isMountedRef.current, []);

  /**
   * Creates a debounced timeout - cancels previous timeout with same key
   * @param {string} key - Unique key for this timeout
   * @param {Function} callback - Function to execute
   * @param {number} delay - Delay in milliseconds
   */
  const debouncedTimeouts = useRef(new Map());

  const setDebouncedTimeout = useCallback(
    (key, callback, delay) => {
      // Cancel previous timeout with this key if exists
      const previousId = debouncedTimeouts.current.get(key);
      if (previousId) {
        cancelTimeout(previousId);
      }

      // Create new timeout
      const id = safeSetTimeout(() => {
        debouncedTimeouts.current.delete(key);
        callback();
      }, delay);

      // Store for potential cancellation
      debouncedTimeouts.current.set(key, id);

      return id;
    },
    [safeSetTimeout, cancelTimeout],
  );

  /**
   * Creates a timeout that repeats until cancelled
   * @param {Function} callback - Function to execute repeatedly
   * @param {number} delay - Delay between executions
   * @returns {Function} Cancel function
   */
  const setRepeatingTimeout = useCallback(
    (callback, delay) => {
      let isCancelled = false;

      const repeatFunction = () => {
        if (isCancelled || !isMountedRef.current) return;

        callback();

        safeSetTimeout(() => {
          repeatFunction();
        }, delay);
      };

      // Start the first execution
      safeSetTimeout(() => {
        repeatFunction();
      }, delay);

      // Return cancel function
      return () => {
        isCancelled = true;
      };
    },
    [safeSetTimeout],
  );

  return {
    safeSetTimeout,
    cancelTimeout,
    clearAllTimeouts,
    getActiveCount,
    isMounted,
    setDebouncedTimeout,
    setRepeatingTimeout,
  };
};

export default useTimeout;
