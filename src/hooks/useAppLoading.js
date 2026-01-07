import { useState, useEffect, useCallback } from "react";
import { ANIMATION_TIMINGS } from "../constants";

/**
 * Custom hook for managing app loading state
 * Handles initial loading including font loading and display timing
 *
 * @param {number} minDisplayTime - Minimum time to show loading screen (default from constants)
 * @returns {Object} Loading state and completion handler
 */
const useAppLoading = (minDisplayTime = ANIMATION_TIMINGS.appLoadDelay) => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  // Handle initial app loading (fonts, assets, etc.)
  useEffect(() => {
    const loadApp = async () => {
      // Wait for fonts to load
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Small delay to ensure smooth experience
      setTimeout(() => {
        setIsAppLoading(false);
      }, minDisplayTime);
    };

    loadApp();
  }, [minDisplayTime]);

  // Handler for when loading animation completes
  const handleLoadingComplete = useCallback(() => {
    setShowLoadingScreen(false);
  }, []);

  return {
    isAppLoading,
    showLoadingScreen,
    handleLoadingComplete,
  };
};

export default useAppLoading;
