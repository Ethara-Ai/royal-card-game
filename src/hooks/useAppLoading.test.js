/**
 * Unit tests for useAppLoading custom hook
 * Tests app loading state management and font loading handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useAppLoading from "./useAppLoading";
import { ANIMATION_TIMINGS } from "./../constants";

describe("useAppLoading", () => {
  beforeEach(() => {
    // Use fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("initialization", () => {
    it("should return an object with loading state and handler", () => {
      const { result } = renderHook(() => useAppLoading());

      expect(result.current).toHaveProperty("isAppLoading");
      expect(result.current).toHaveProperty("showLoadingScreen");
      expect(result.current).toHaveProperty("handleLoadingComplete");
    });

    it("should start with isAppLoading as true", () => {
      const { result } = renderHook(() => useAppLoading());

      expect(result.current.isAppLoading).toBe(true);
    });

    it("should start with showLoadingScreen as true", () => {
      const { result } = renderHook(() => useAppLoading());

      expect(result.current.showLoadingScreen).toBe(true);
    });

    it("should have handleLoadingComplete as a function", () => {
      const { result } = renderHook(() => useAppLoading());

      expect(typeof result.current.handleLoadingComplete).toBe("function");
    });
  });

  describe("loading completion", () => {
    it("should set isAppLoading to false after default delay", async () => {
      const { result } = renderHook(() => useAppLoading());

      expect(result.current.isAppLoading).toBe(true);

      // Flush promises and advance timers
      await act(async () => {
        await Promise.resolve();
        vi.advanceTimersByTime(ANIMATION_TIMINGS.appLoadDelay + 100);
      });

      expect(result.current.isAppLoading).toBe(false);
    });

    it("should set isAppLoading to false after custom delay", async () => {
      const customDelay = 1000;
      const { result } = renderHook(() => useAppLoading(customDelay));

      expect(result.current.isAppLoading).toBe(true);

      await act(async () => {
        await Promise.resolve();
        vi.advanceTimersByTime(customDelay + 100);
      });

      expect(result.current.isAppLoading).toBe(false);
    });

    it("should not set isAppLoading to false before delay completes", async () => {
      const customDelay = 1000;
      const { result } = renderHook(() => useAppLoading(customDelay));

      await act(async () => {
        await Promise.resolve();
        vi.advanceTimersByTime(customDelay - 100);
      });

      expect(result.current.isAppLoading).toBe(true);
    });
  });

  describe("handleLoadingComplete", () => {
    it("should set showLoadingScreen to false when called", () => {
      const { result } = renderHook(() => useAppLoading());

      expect(result.current.showLoadingScreen).toBe(true);

      act(() => {
        result.current.handleLoadingComplete();
      });

      expect(result.current.showLoadingScreen).toBe(false);
    });

    it("should be callable multiple times without error", () => {
      const { result } = renderHook(() => useAppLoading());

      expect(() => {
        act(() => {
          result.current.handleLoadingComplete();
          result.current.handleLoadingComplete();
          result.current.handleLoadingComplete();
        });
      }).not.toThrow();

      expect(result.current.showLoadingScreen).toBe(false);
    });

    it("should maintain showLoadingScreen as false after multiple calls", () => {
      const { result } = renderHook(() => useAppLoading());

      act(() => {
        result.current.handleLoadingComplete();
      });

      expect(result.current.showLoadingScreen).toBe(false);

      act(() => {
        result.current.handleLoadingComplete();
      });

      expect(result.current.showLoadingScreen).toBe(false);
    });
  });

  describe("parameter handling", () => {
    it("should use default delay from ANIMATION_TIMINGS when no parameter provided", async () => {
      const { result } = renderHook(() => useAppLoading());

      // Before default delay
      await act(async () => {
        await Promise.resolve();
        vi.advanceTimersByTime(ANIMATION_TIMINGS.appLoadDelay - 100);
      });
      expect(result.current.isAppLoading).toBe(true);

      // After default delay
      await act(async () => {
        vi.advanceTimersByTime(200);
      });
      expect(result.current.isAppLoading).toBe(false);
    });

    it("should accept zero as a valid delay", async () => {
      const { result } = renderHook(() => useAppLoading(0));

      await act(async () => {
        await Promise.resolve();
        vi.advanceTimersByTime(1);
      });

      expect(result.current.isAppLoading).toBe(false);
    });

    it("should handle very short delay", async () => {
      const { result } = renderHook(() => useAppLoading(50));

      await act(async () => {
        await Promise.resolve();
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isAppLoading).toBe(false);
    });

    it("should handle very long delay", async () => {
      const longDelay = 10000;
      const { result } = renderHook(() => useAppLoading(longDelay));

      await act(async () => {
        await Promise.resolve();
        vi.advanceTimersByTime(longDelay - 100);
      });
      expect(result.current.isAppLoading).toBe(true);

      await act(async () => {
        vi.advanceTimersByTime(200);
      });
      expect(result.current.isAppLoading).toBe(false);
    });
  });

  describe("state independence", () => {
    it("should have independent isAppLoading and showLoadingScreen states", async () => {
      const { result } = renderHook(() => useAppLoading(100));

      // Complete loading
      await act(async () => {
        await Promise.resolve();
        vi.advanceTimersByTime(200);
      });

      // isAppLoading should be false, but showLoadingScreen should still be true
      expect(result.current.isAppLoading).toBe(false);
      expect(result.current.showLoadingScreen).toBe(true);

      // Now complete the loading screen animation
      act(() => {
        result.current.handleLoadingComplete();
      });

      expect(result.current.isAppLoading).toBe(false);
      expect(result.current.showLoadingScreen).toBe(false);
    });

    it("should allow handleLoadingComplete before isAppLoading becomes false", () => {
      const { result } = renderHook(() => useAppLoading(10000));

      // Call handleLoadingComplete before loading completes
      act(() => {
        result.current.handleLoadingComplete();
      });

      expect(result.current.showLoadingScreen).toBe(false);
      expect(result.current.isAppLoading).toBe(true);
    });
  });

  describe("hook stability", () => {
    it("should maintain stable handleLoadingComplete reference", () => {
      const { result, rerender } = renderHook(() => useAppLoading());

      const firstHandler = result.current.handleLoadingComplete;

      rerender();

      expect(result.current.handleLoadingComplete).toBe(firstHandler);
    });

    it("should not cause infinite loops on re-render", () => {
      const { rerender } = renderHook(() => useAppLoading());

      expect(() => {
        for (let i = 0; i < 10; i++) {
          rerender();
        }
      }).not.toThrow();
    });

    it("should handle unmount during loading", () => {
      const { unmount } = renderHook(() => useAppLoading(1000));

      // Unmount before loading completes
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe("return value structure", () => {
    it("should return exactly 3 properties", () => {
      const { result } = renderHook(() => useAppLoading());

      expect(Object.keys(result.current)).toHaveLength(3);
    });

    it("should have correct types for all properties", () => {
      const { result } = renderHook(() => useAppLoading());

      expect(typeof result.current.isAppLoading).toBe("boolean");
      expect(typeof result.current.showLoadingScreen).toBe("boolean");
      expect(typeof result.current.handleLoadingComplete).toBe("function");
    });

    it("should have the expected property names", () => {
      const { result } = renderHook(() => useAppLoading());

      expect(result.current).toHaveProperty("isAppLoading");
      expect(result.current).toHaveProperty("showLoadingScreen");
      expect(result.current).toHaveProperty("handleLoadingComplete");
    });
  });

  describe("typical usage flow", () => {
    it("should support typical app loading flow", async () => {
      const { result } = renderHook(() => useAppLoading(100));

      // Initial state - everything loading
      expect(result.current.isAppLoading).toBe(true);
      expect(result.current.showLoadingScreen).toBe(true);

      // After fonts load and delay passes
      await act(async () => {
        await Promise.resolve();
        vi.advanceTimersByTime(200);
      });

      // App is loaded, but loading screen still showing (for animation)
      expect(result.current.isAppLoading).toBe(false);
      expect(result.current.showLoadingScreen).toBe(true);

      // Animation completes
      act(() => {
        result.current.handleLoadingComplete();
      });

      // Everything complete
      expect(result.current.isAppLoading).toBe(false);
      expect(result.current.showLoadingScreen).toBe(false);
    });
  });
});
