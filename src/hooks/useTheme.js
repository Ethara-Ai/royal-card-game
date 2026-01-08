import { useState, useEffect, useCallback } from "react";
import { THEMES } from "../constants";

/**
 * Custom hook for managing theme state and persistence
 * Handles theme initialization, toggling, and localStorage sync
 *
 * @returns {Object} Theme state and toggle function
 */
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || THEMES.DARK;
    }
    return THEMES.DARK;
  });

  // Sync theme with document and localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle between dark and light themes
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK));
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === THEMES.DARK,
    isLight: theme === THEMES.LIGHT,
  };
};

export default useTheme;
