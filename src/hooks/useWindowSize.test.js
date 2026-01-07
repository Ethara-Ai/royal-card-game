/**
 * Unit tests for useWindowSize custom hook
 * Tests window dimension tracking and resize event handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useWindowSize from "../useWindowSize";

describe("useWindowSize", () => {
  let originalInnerWidth;
  let originalInnerHeight;
  let resizeListeners;

  beforeEach(() => {
    // Save original values
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;

    // Track resize listeners
    resizeListeners = [];

    // Mock addEventListener
    vi.spyOn(window, "addEventListener").mockImplementation((event, handler) => {
      if (event === "resize") {
        resizeListeners.push(handler);
      }
    });

    // Mock removeEventListener
    vi.spyOn(window, "removeEventListener").mockImplementation((event, handler) => {
      if (event === "resize") {
        resizeListeners = resizeListeners.filter((h) => h !== handler);
      }
    });

    // Set default window size
    setWindowSize(1024, 768);
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });

    vi.restoreAllMocks();
    resizeListeners = [];
  });

  // Helper function to set window size
  function setWindowSize(width, height) {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: height,
    });
  }

  // Helper function to simulate resize
  function simulateResize(width, height) {
    setWindowSize(width, height);
    resizeListeners.forEach((handler) => handler());
  }

  describe("initialization", () => {
    it("should return an object with width and height", () => {
      const { result } = renderHook(() => useWindowSize());

      expect(result.current).toHaveProperty("width");
      expect(result.current).toHaveProperty("height");
    });

    it("should return initial window dimensions", () => {
      setWindowSize(1920, 1080);
      const { result } = renderHook(() => useWindowSize());

      expect(result.current.width).toBe(1920);
      expect(result.current.height).toBe(1080);
    });

    it("should have number type for width and height", () => {
      const { result } = renderHook(() => useWindowSize());

      expect(typeof result.current.width).toBe("number");
      expect(typeof result.current.height).toBe("number");
    });

    it("should add resize event listener on mount", () => {
      renderHook(() => useWindowSize());

      expect(window.addEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });
  });

  describe("resize handling", () => {
    it("should update width when window is resized", () => {
      const { result } = renderHook(() => useWindowSize());

      expect(result.current.width).toBe(1024);

      act(() => {
        simulateResize(1280, 768);
      });

      expect(result.current.width).toBe(1280);
    });

    it("should update height when window is resized", () => {
      const { result } = renderHook(() => useWindowSize());

      expect(result.current.height).toBe(768);

      act(() => {
        simulateResize(1024, 900);
      });

      expect(result.current.height).toBe(900);
    });

    it("should update both width and height on resize", () => {
      const { result } = renderHook(() => useWindowSize());

      act(() => {
        simulateResize(1600, 1200);
      });

      expect(result.current.width).toBe(1600);
      expect(result.current.height).toBe(1200);
    });

    it("should handle multiple resize events", () => {
      const { result } = renderHook(() => useWindowSize());

      const sizes = [
        { width: 800, height: 600 },
        { width: 1024, height: 768 },
        { width: 1920, height: 1080 },
        { width: 375, height: 667 },
      ];

      sizes.forEach(({ width, height }) => {
        act(() => {
          simulateResize(width, height);
        });

        expect(result.current.width).toBe(width);
        expect(result.current.height).toBe(height);
      });
    });

    it("should handle rapid resize events", () => {
      const { result } = renderHook(() => useWindowSize());

      act(() => {
        for (let i = 0; i < 100; i++) {
          simulateResize(800 + i, 600 + i);
        }
      });

      expect(result.current.width).toBe(899);
      expect(result.current.height).toBe(699);
    });
  });

  describe("cleanup", () => {
    it("should remove resize event listener on unmount", () => {
      const { unmount } = renderHook(() => useWindowSize());

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });

    it("should not respond to resize after unmount", () => {
      const { result, unmount } = renderHook(() => useWindowSize());

      const widthBeforeUnmount = result.current.width;

      unmount();

      // Simulate resize after unmount
      setWindowSize(2000, 1500);

      // The result should not change since hook is unmounted
      expect(result.current.width).toBe(widthBeforeUnmount);
    });

    it("should remove the correct listener on unmount", () => {
      const { unmount } = renderHook(() => useWindowSize());

      const listenerCount = resizeListeners.length;

      unmount();

      // One listener should have been removed
      expect(resizeListeners.length).toBe(listenerCount - 1);
    });
  });

  describe("edge cases", () => {
    it("should handle zero dimensions", () => {
      setWindowSize(0, 0);
      const { result } = renderHook(() => useWindowSize());

      expect(result.current.width).toBe(0);
      expect(result.current.height).toBe(0);
    });

    it("should handle very large dimensions", () => {
      setWindowSize(10000, 8000);
      const { result } = renderHook(() => useWindowSize());

      expect(result.current.width).toBe(10000);
      expect(result.current.height).toBe(8000);
    });

    it("should handle portrait orientation", () => {
      setWindowSize(375, 812);
      const { result } = renderHook(() => useWindowSize());

      expect(result.current.width).toBe(375);
      expect(result.current.height).toBe(812);
      expect(result.current.height).toBeGreaterThan(result.current.width);
    });

    it("should handle landscape orientation", () => {
      setWindowSize(1920, 1080);
      const { result } = renderHook(() => useWindowSize());

      expect(result.current.width).toBe(1920);
      expect(result.current.height).toBe(1080);
      expect(result.current.width).toBeGreaterThan(result.current.height);
    });

    it("should handle square dimensions", () => {
      setWindowSize(1000, 1000);
      const { result } = renderHook(() => useWindowSize());

      expect(result.current.width).toBe(1000);
      expect(result.current.height).toBe(1000);
      expect(result.current.width).toBe(result.current.height);
    });

    it("should handle resize to same dimensions", () => {
      setWindowSize(1024, 768);
      const { result } = renderHook(() => useWindowSize());

      const initialWidth = result.current.width;
      const initialHeight = result.current.height;

      act(() => {
        simulateResize(1024, 768);
      });

      expect(result.current.width).toBe(initialWidth);
      expect(result.current.height).toBe(initialHeight);
    });
  });

  describe("common device sizes", () => {
    const deviceSizes = [
      { name: "iPhone SE", width: 375, height: 667 },
      { name: "iPhone 12/13", width: 390, height: 844 },
      { name: "iPhone 14 Pro Max", width: 430, height: 932 },
      { name: "iPad", width: 768, height: 1024 },
      { name: "iPad Pro", width: 1024, height: 1366 },
      { name: "MacBook Air", width: 1280, height: 800 },
      { name: "MacBook Pro 14", width: 1512, height: 982 },
      { name: "1080p monitor", width: 1920, height: 1080 },
      { name: "4K monitor", width: 3840, height: 2160 },
    ];

    deviceSizes.forEach(({ name, width, height }) => {
      it(`should handle ${name} dimensions (${width}x${height})`, () => {
        setWindowSize(width, height);
        const { result } = renderHook(() => useWindowSize());

        expect(result.current.width).toBe(width);
        expect(result.current.height).toBe(height);
      });
    });
  });

  describe("hook stability", () => {
    it("should not cause unnecessary re-renders when size doesn't change", () => {
      let renderCount = 0;

      const { result, rerender } = renderHook(() => {
        renderCount++;
        return useWindowSize();
      });

      const initialRenderCount = renderCount;

      // Rerender without size change
      rerender();

      // Should only increment by 1 for the rerender
      expect(renderCount).toBe(initialRenderCount + 1);
    });

    it("should maintain stable reference structure", () => {
      const { result, rerender } = renderHook(() => useWindowSize());

      const initialKeys = Object.keys(result.current);

      rerender();

      expect(Object.keys(result.current)).toEqual(initialKeys);
    });
  });

  describe("return value structure", () => {
    it("should return exactly 2 properties", () => {
      const { result } = renderHook(() => useWindowSize());

      expect(Object.keys(result.current)).toHaveLength(2);
    });

    it("should have width and height as the only properties", () => {
      const { result } = renderHook(() => useWindowSize());

      expect(Object.keys(result.current).sort()).toEqual(["height", "width"]);
    });

    it("should return non-negative numbers", () => {
      const { result } = renderHook(() => useWindowSize());

      expect(result.current.width).toBeGreaterThanOrEqual(0);
      expect(result.current.height).toBeGreaterThanOrEqual(0);
    });

    it("should return integers", () => {
      setWindowSize(1024, 768);
      const { result } = renderHook(() => useWindowSize());

      expect(Number.isInteger(result.current.width)).toBe(true);
      expect(Number.isInteger(result.current.height)).toBe(true);
    });
  });

  describe("responsive breakpoint scenarios", () => {
    it("should correctly detect mobile breakpoint (< 640px)", () => {
      setWindowSize(375, 667);
      const { result } = renderHook(() => useWindowSize());

      expect(result.current.width).toBeLessThan(640);
    });

    it("should correctly detect tablet breakpoint (>= 640px && < 1024px)", () => {
      setWindowSize(768, 1024);
      const { result } = renderHook(() => useWindowSize());

      expect(result.current.width).toBeGreaterThanOrEqual(640);
      expect(result.current.width).toBeLessThan(1024);
    });

    it("should correctly detect desktop breakpoint (>= 1024px)", () => {
      setWindowSize(1920, 1080);
      const { result } = renderHook(() => useWindowSize());

      expect(result.current.width).toBeGreaterThanOrEqual(1024);
    });

    it("should update breakpoint category on resize", () => {
      setWindowSize(375, 667);
      const { result } = renderHook(() => useWindowSize());

      // Start at mobile
      expect(result.current.width).toBeLessThan(640);

      // Resize to tablet
      act(() => {
        simulateResize(768, 1024);
      });
      expect(result.current.width).toBeGreaterThanOrEqual(640);
      expect(result.current.width).toBeLessThan(1024);

      // Resize to desktop
      act(() => {
        simulateResize(1920, 1080);
      });
      expect(result.current.width).toBeGreaterThanOrEqual(1024);
    });
  });
});
