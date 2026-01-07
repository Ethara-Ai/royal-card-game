/**
 * Unit tests for useTheme custom hook
 * Tests theme state management, persistence, and toggle functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useTheme from "../useTheme";
import { THEMES } from "../../constants";

describe("useTheme", () => {
  let originalLocalStorage;
  let mockLocalStorage;

  beforeEach(() => {
    // Save original localStorage
    originalLocalStorage = window.localStorage;

    // Create mock localStorage
    mockLocalStorage = {
      store: {},
      getItem: vi.fn((key) => mockLocalStorage.store[key] || null),
      setItem: vi.fn((key, value) => {
        mockLocalStorage.store[key] = value.toString();
      }),
      removeItem: vi.fn((key) => {
        delete mockLocalStorage.store[key];
      }),
      clear: vi.fn(() => {
        mockLocalStorage.store = {};
      }),
    };

    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });

    // Reset document attribute
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    // Restore original localStorage
    Object.defineProperty(window, "localStorage", {
      value: originalLocalStorage,
      writable: true,
    });
    vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("should return an object with theme state and functions", () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current).toHaveProperty("theme");
      expect(result.current).toHaveProperty("setTheme");
      expect(result.current).toHaveProperty("toggleTheme");
      expect(result.current).toHaveProperty("isDark");
      expect(result.current).toHaveProperty("isLight");
    });

    it("should default to dark theme when localStorage is empty", () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe(THEMES.DARK);
    });

    it("should use theme from localStorage if available", () => {
      mockLocalStorage.store.theme = THEMES.LIGHT;
      mockLocalStorage.getItem.mockReturnValue(THEMES.LIGHT);

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe(THEMES.LIGHT);
    });

    it("should read from localStorage on mount", () => {
      renderHook(() => useTheme());

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("theme");
    });
  });

  describe("theme state", () => {
    it("should have theme as a string", () => {
      const { result } = renderHook(() => useTheme());

      expect(typeof result.current.theme).toBe("string");
    });

    it("should have isDark as true when theme is dark", () => {
      mockLocalStorage.getItem.mockReturnValue(THEMES.DARK);
      const { result } = renderHook(() => useTheme());

      expect(result.current.isDark).toBe(true);
      expect(result.current.isLight).toBe(false);
    });

    it("should have isLight as true when theme is light", () => {
      mockLocalStorage.store.theme = THEMES.LIGHT;
      mockLocalStorage.getItem.mockReturnValue(THEMES.LIGHT);

      const { result } = renderHook(() => useTheme());

      expect(result.current.isLight).toBe(true);
      expect(result.current.isDark).toBe(false);
    });

    it("should have isDark and isLight mutually exclusive", () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.isDark).not.toBe(result.current.isLight);
    });
  });

  describe("toggleTheme", () => {
    it("should be a function", () => {
      const { result } = renderHook(() => useTheme());

      expect(typeof result.current.toggleTheme).toBe("function");
    });

    it("should toggle from dark to light", () => {
      mockLocalStorage.getItem.mockReturnValue(THEMES.DARK);
      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe(THEMES.DARK);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe(THEMES.LIGHT);
    });

    it("should toggle from light to dark", () => {
      mockLocalStorage.store.theme = THEMES.LIGHT;
      mockLocalStorage.getItem.mockReturnValue(THEMES.LIGHT);

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe(THEMES.LIGHT);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe(THEMES.DARK);
    });

    it("should update isDark and isLight when toggled", () => {
      const { result } = renderHook(() => useTheme());

      const initialIsDark = result.current.isDark;
      const initialIsLight = result.current.isLight;

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.isDark).toBe(initialIsLight);
      expect(result.current.isLight).toBe(initialIsDark);
    });

    it("should toggle back to original after two toggles", () => {
      const { result } = renderHook(() => useTheme());

      const initialTheme = result.current.theme;

      act(() => {
        result.current.toggleTheme();
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe(initialTheme);
    });
  });

  describe("setTheme", () => {
    it("should be a function", () => {
      const { result } = renderHook(() => useTheme());

      expect(typeof result.current.setTheme).toBe("function");
    });

    it("should set theme to dark", () => {
      mockLocalStorage.store.theme = THEMES.LIGHT;
      mockLocalStorage.getItem.mockReturnValue(THEMES.LIGHT);

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme(THEMES.DARK);
      });

      expect(result.current.theme).toBe(THEMES.DARK);
    });

    it("should set theme to light", () => {
      mockLocalStorage.getItem.mockReturnValue(THEMES.DARK);
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme(THEMES.LIGHT);
      });

      expect(result.current.theme).toBe(THEMES.LIGHT);
    });

    it("should update derived values when theme is set", () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme(THEMES.LIGHT);
      });

      expect(result.current.isLight).toBe(true);
      expect(result.current.isDark).toBe(false);

      act(() => {
        result.current.setTheme(THEMES.DARK);
      });

      expect(result.current.isDark).toBe(true);
      expect(result.current.isLight).toBe(false);
    });
  });

  describe("localStorage persistence", () => {
    it("should save theme to localStorage when theme changes", () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("theme", expect.any(String));
    });

    it("should save dark theme to localStorage", () => {
      mockLocalStorage.store.theme = THEMES.LIGHT;
      mockLocalStorage.getItem.mockReturnValue(THEMES.LIGHT);

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme(THEMES.DARK);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("theme", THEMES.DARK);
    });

    it("should save light theme to localStorage", () => {
      mockLocalStorage.getItem.mockReturnValue(THEMES.DARK);
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme(THEMES.LIGHT);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("theme", THEMES.LIGHT);
    });
  });

  describe("document attribute", () => {
    it("should set data-theme attribute on document element", () => {
      const { result } = renderHook(() => useTheme());

      expect(document.documentElement.getAttribute("data-theme")).toBe(
        result.current.theme
      );
    });

    it("should update data-theme attribute when theme changes", () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme(THEMES.LIGHT);
      });

      expect(document.documentElement.getAttribute("data-theme")).toBe(THEMES.LIGHT);
    });

    it("should set data-theme to dark when toggled from light", () => {
      mockLocalStorage.store.theme = THEMES.LIGHT;
      mockLocalStorage.getItem.mockReturnValue(THEMES.LIGHT);

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(document.documentElement.getAttribute("data-theme")).toBe(THEMES.DARK);
    });
  });

  describe("hook stability", () => {
    it("should maintain stable toggleTheme reference", () => {
      const { result, rerender } = renderHook(() => useTheme());

      const firstToggle = result.current.toggleTheme;

      rerender();

      expect(result.current.toggleTheme).toBe(firstToggle);
    });

    it("should not cause infinite loops on re-render", () => {
      const { rerender } = renderHook(() => useTheme());

      // Should not throw or cause infinite loop
      expect(() => {
        for (let i = 0; i < 10; i++) {
          rerender();
        }
      }).not.toThrow();
    });
  });

  describe("edge cases", () => {
    it("should handle invalid theme in localStorage", () => {
      mockLocalStorage.store.theme = "invalid-theme";
      mockLocalStorage.getItem.mockReturnValue("invalid-theme");

      // Should not throw
      expect(() => {
        renderHook(() => useTheme());
      }).not.toThrow();
    });

    it("should handle empty string in localStorage", () => {
      mockLocalStorage.store.theme = "";
      mockLocalStorage.getItem.mockReturnValue("");

      const { result } = renderHook(() => useTheme());

      // Should still have a defined theme
      expect(result.current.theme).toBeDefined();
    });

    it("should handle rapid toggles", () => {
      const { result } = renderHook(() => useTheme());

      const initialTheme = result.current.theme;

      act(() => {
        result.current.toggleTheme();
        result.current.toggleTheme();
        result.current.toggleTheme();
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe(initialTheme);
    });

    it("should handle setting same theme multiple times", () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme(THEMES.DARK);
        result.current.setTheme(THEMES.DARK);
        result.current.setTheme(THEMES.DARK);
      });

      expect(result.current.theme).toBe(THEMES.DARK);
    });
  });

  describe("return value structure", () => {
    it("should return exactly 5 properties", () => {
      const { result } = renderHook(() => useTheme());

      expect(Object.keys(result.current)).toHaveLength(5);
    });

    it("should have correct types for all properties", () => {
      const { result } = renderHook(() => useTheme());

      expect(typeof result.current.theme).toBe("string");
      expect(typeof result.current.setTheme).toBe("function");
      expect(typeof result.current.toggleTheme).toBe("function");
      expect(typeof result.current.isDark).toBe("boolean");
      expect(typeof result.current.isLight).toBe("boolean");
    });
  });
});
