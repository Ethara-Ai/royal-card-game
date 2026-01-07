import { useState, useEffect } from "react";

/**
 * Custom hook for tracking window dimensions
 * Provides responsive width and height values that update on resize
 * @returns {{ width: number, height: number }} Current window dimensions
 */
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    updateWindowSize();

    // Listen for resize events
    window.addEventListener("resize", updateWindowSize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  return windowSize;
};

export default useWindowSize;
