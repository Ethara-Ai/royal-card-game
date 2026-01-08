/**
 * Keyboard Navigation Hook
 * Provides comprehensive keyboard accessibility for the card game
 * Supports arrow keys, Enter/Space for selection, Tab navigation, and Escape
 */

import {
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  useState,
} from "react";

/**
 * Custom hook for keyboard navigation and accessibility
 * @param {Object} options - Configuration options
 * @param {Array} options.items - Array of items to navigate (e.g., cards)
 * @param {Function} options.onSelect - Callback when item is selected (Enter/Space)
 * @param {Function} options.onEscape - Callback when Escape is pressed
 * @param {boolean} options.enabled - Whether keyboard navigation is enabled
 * @param {boolean} options.circular - Whether navigation wraps around
 * @param {string} options.orientation - 'horizontal' or 'vertical' for arrow keys
 * @returns {Object} Navigation state and methods
 */
export const useKeyboardNavigation = ({
  items = [],
  onSelect,
  onEscape,
  enabled = true,
  circular = true,
  orientation = "horizontal",
} = {}) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isNavigating, setIsNavigating] = useState(false);
  const itemRefs = useRef([]);

  // Initialize refs array
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items.length]);

  /**
   * Move focus to a specific index (DOM manipulation only)
   */
  const focusItemDOM = useCallback(
    (index) => {
      if (index >= 0 && index < items.length && itemRefs.current[index]) {
        itemRefs.current[index]?.focus();
      }
    },
    [items.length],
  );

  /**
   * Move focus to a specific index (with state update)
   */
  const focusItem = useCallback(
    (index) => {
      if (index >= 0 && index < items.length && itemRefs.current[index]) {
        setFocusedIndex(index);
        itemRefs.current[index]?.focus();
      }
    },
    [items.length],
  );

  /**
   * Move focus forward
   */
  const focusNext = useCallback(() => {
    setIsNavigating(true);
    setFocusedIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= items.length) {
        return circular ? 0 : prev;
      }
      return nextIndex;
    });
  }, [items.length, circular]);

  /**
   * Move focus backward
   */
  const focusPrevious = useCallback(() => {
    setIsNavigating(true);
    setFocusedIndex((prev) => {
      const prevIndex = prev - 1;
      if (prevIndex < 0) {
        return circular ? items.length - 1 : 0;
      }
      return prevIndex;
    });
  }, [items.length, circular]);

  /**
   * Move focus to first item
   */
  const focusFirst = useCallback(() => {
    setIsNavigating(true);
    setFocusedIndex(0);
  }, []);

  /**
   * Move focus to last item
   */
  const focusLast = useCallback(() => {
    setIsNavigating(true);
    setFocusedIndex(items.length - 1);
  }, [items.length]);

  /**
   * Handle item selection (Enter or Space)
   */
  const handleSelect = useCallback(() => {
    if (focusedIndex >= 0 && focusedIndex < items.length && onSelect) {
      onSelect(items[focusedIndex], focusedIndex);
    }
  }, [focusedIndex, items, onSelect]);

  /**
   * Main keyboard event handler
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (!enabled) return;

      const { key, shiftKey, ctrlKey, metaKey } = event;

      // Ignore if modifier keys are pressed (except Shift for Tab)
      if ((ctrlKey || metaKey) && key !== "Tab") return;

      switch (key) {
        case "ArrowRight":
          if (orientation === "horizontal") {
            event.preventDefault();
            focusNext();
          }
          break;

        case "ArrowLeft":
          if (orientation === "horizontal") {
            event.preventDefault();
            focusPrevious();
          }
          break;

        case "ArrowDown":
          if (orientation === "vertical") {
            event.preventDefault();
            focusNext();
          }
          break;

        case "ArrowUp":
          if (orientation === "vertical") {
            event.preventDefault();
            focusPrevious();
          }
          break;

        case "Home":
          event.preventDefault();
          focusFirst();
          break;

        case "End":
          event.preventDefault();
          focusLast();
          break;

        case "Enter":
        case " ":
        case "Spacebar": // For older browsers
          event.preventDefault();
          handleSelect();
          break;

        case "Escape":
        case "Esc": // For older browsers
          event.preventDefault();
          if (onEscape) {
            onEscape();
          }
          setFocusedIndex(-1);
          break;

        case "Tab":
          // Allow natural tab navigation
          // Reset our internal focus tracking when tabbing away
          if (!shiftKey && focusedIndex === items.length - 1) {
            setFocusedIndex(-1);
          } else if (shiftKey && focusedIndex === 0) {
            setFocusedIndex(-1);
          }
          break;

        default:
          break;
      }
    },
    [
      enabled,
      orientation,
      focusedIndex,
      items.length,
      focusNext,
      focusPrevious,
      focusFirst,
      focusLast,
      handleSelect,
      onEscape,
    ],
  );

  /**
   * Compute safe focused index (derived state)
   */
  const safeFocusedIndex = focusedIndex >= items.length ? -1 : focusedIndex;

  /**
   * Focus the item when focusedIndex changes (uses layoutEffect for DOM synchronization)
   */
  useLayoutEffect(() => {
    if (
      isNavigating &&
      safeFocusedIndex >= 0 &&
      safeFocusedIndex < items.length
    ) {
      focusItemDOM(safeFocusedIndex);
    }
  }, [safeFocusedIndex, items.length, focusItemDOM, isNavigating]);

  /**
   * Get props for a specific item
   */
  const getItemProps = useCallback(
    (index) => ({
      ref: (el) => {
        itemRefs.current[index] = el;
      },
      tabIndex: safeFocusedIndex === index ? 0 : -1,
      role: "button",
      "aria-label": items[index]?.ariaLabel || `Item ${index + 1}`,
      "aria-pressed": safeFocusedIndex === index,
      onKeyDown: handleKeyDown,
      onFocus: () => {
        if (!isNavigating) {
          setFocusedIndex(index);
        }
        setIsNavigating(false);
      },
      onBlur: () => {
        // Small delay to check if focus moved to another item
        setTimeout(() => {
          const activeElement = document.activeElement;
          const isItemFocused = itemRefs.current.some(
            (ref) => ref === activeElement,
          );
          if (!isItemFocused) {
            setFocusedIndex(-1);
          }
        }, 0);
      },
      "data-keyboard-focus": safeFocusedIndex === index ? "true" : "false",
    }),
    [safeFocusedIndex, items, handleKeyDown, isNavigating],
  );

  /**
   * Get props for the container element
   */
  const getContainerProps = useCallback(
    () => ({
      role: "toolbar",
      "aria-label": "Keyboard navigation",
      "aria-orientation": orientation,
      onKeyDown: handleKeyDown,
    }),
    [orientation, handleKeyDown],
  );

  return {
    // State
    focusedIndex: safeFocusedIndex,
    isNavigating,

    // Methods
    focusItem,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    setFocusedIndex,

    // Prop getters
    getItemProps,
    getContainerProps,

    // Event handlers
    handleKeyDown,
  };
};

/**
 * Hook for managing focus trap in modals
 * Keeps focus within a container (useful for modals and dialogs)
 */
export const useFocusTrap = (isActive = false) => {
  const containerRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    // Store the previously focused element
    previouslyFocusedElement.current = document.activeElement;

    // Get all focusable elements within the container
    const getFocusableElements = () => {
      if (!containerRef.current) return [];

      const focusableSelectors = [
        "a[href]",
        "button:not([disabled])",
        "textarea:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
      ].join(", ");

      return Array.from(
        containerRef.current.querySelectorAll(focusableSelectors),
      );
    };

    const handleKeyDown = (event) => {
      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else if (document.activeElement === lastElement) {
        // Tab
        event.preventDefault();
        firstElement.focus();
      }
    };

    // Focus the first element when trap activates
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Restore focus to previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
};

/**
 * Hook for skip links (skip to main content)
 */
export const useSkipLink = () => {
  const skipToMain = useCallback(() => {
    const mainContent =
      document.querySelector("main") || document.querySelector('[role="main"]');
    if (mainContent) {
      mainContent.setAttribute("tabindex", "-1");
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const getSkipLinkProps = useCallback(
    () => ({
      href: "#main-content",
      onClick: (e) => {
        e.preventDefault();
        skipToMain();
      },
      className: "skip-link",
      "aria-label": "Skip to main content",
    }),
    [skipToMain],
  );

  return {
    skipToMain,
    getSkipLinkProps,
  };
};

export default useKeyboardNavigation;
