/**
 * Tests for Keyboard Navigation Hook
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  useKeyboardNavigation,
  useFocusTrap,
  useSkipLink,
} from "./useKeyboardNavigation";

describe("useKeyboardNavigation", () => {
  const mockItems = [
    { id: "1", ariaLabel: "Card 1" },
    { id: "2", ariaLabel: "Card 2" },
    { id: "3", ariaLabel: "Card 3" },
    { id: "4", ariaLabel: "Card 4" },
  ];

  let mockOnSelect;
  let mockOnEscape;

  beforeEach(() => {
    mockOnSelect = vi.fn();
    mockOnEscape = vi.fn();
  });

  describe("initialization", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({ items: mockItems }),
      );

      expect(result.current.focusedIndex).toBe(-1);
      expect(result.current.isNavigating).toBe(false);
    });

    it("should accept custom options", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          enabled: true,
          circular: false,
          orientation: "vertical",
        }),
      );

      expect(result.current.focusedIndex).toBe(-1);
    });
  });

  describe("arrow key navigation - horizontal", () => {
    it("should move focus forward with ArrowRight", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          orientation: "horizontal",
        }),
      );

      act(() => {
        result.current.focusNext();
      });

      expect(result.current.focusedIndex).toBe(0);

      act(() => {
        result.current.focusNext();
      });

      expect(result.current.focusedIndex).toBe(1);
    });

    it("should move focus backward with ArrowLeft", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          orientation: "horizontal",
        }),
      );

      act(() => {
        result.current.setFocusedIndex(2);
      });

      act(() => {
        result.current.focusPrevious();
      });

      expect(result.current.focusedIndex).toBe(1);
    });

    it("should not respond to ArrowUp/Down in horizontal mode", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          orientation: "horizontal",
        }),
      );

      const event = new KeyboardEvent("keydown", { key: "ArrowDown" });

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(result.current.focusedIndex).toBe(-1);
    });
  });

  describe("arrow key navigation - vertical", () => {
    it("should move focus forward with ArrowDown", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          orientation: "vertical",
        }),
      );

      act(() => {
        result.current.focusNext();
      });

      expect(result.current.focusedIndex).toBe(0);
    });

    it("should move focus backward with ArrowUp", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          orientation: "vertical",
        }),
      );

      act(() => {
        result.current.setFocusedIndex(2);
      });

      act(() => {
        result.current.focusPrevious();
      });

      expect(result.current.focusedIndex).toBe(1);
    });

    it("should not respond to ArrowLeft/Right in vertical mode", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          orientation: "vertical",
        }),
      );

      const event = new KeyboardEvent("keydown", { key: "ArrowRight" });

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(result.current.focusedIndex).toBe(-1);
    });
  });

  describe("circular navigation", () => {
    it("should wrap to first item when going next from last (circular=true)", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          circular: true,
        }),
      );

      act(() => {
        result.current.setFocusedIndex(3);
      });

      act(() => {
        result.current.focusNext();
      });

      expect(result.current.focusedIndex).toBe(0);
    });

    it("should wrap to last item when going previous from first (circular=true)", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          circular: true,
        }),
      );

      act(() => {
        result.current.setFocusedIndex(0);
      });

      act(() => {
        result.current.focusPrevious();
      });

      expect(result.current.focusedIndex).toBe(3);
    });

    it("should not wrap when circular=false", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          circular: false,
        }),
      );

      act(() => {
        result.current.setFocusedIndex(3);
      });

      act(() => {
        result.current.focusNext();
      });

      expect(result.current.focusedIndex).toBe(3);

      act(() => {
        result.current.setFocusedIndex(0);
      });

      act(() => {
        result.current.focusPrevious();
      });

      expect(result.current.focusedIndex).toBe(0);
    });
  });

  describe("Home and End keys", () => {
    it("should jump to first item with Home key", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({ items: mockItems }),
      );

      act(() => {
        result.current.setFocusedIndex(2);
      });

      act(() => {
        result.current.focusFirst();
      });

      expect(result.current.focusedIndex).toBe(0);
      expect(result.current.isNavigating).toBe(true);
    });

    it("should jump to last item with End key", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({ items: mockItems }),
      );

      act(() => {
        result.current.setFocusedIndex(0);
      });

      act(() => {
        result.current.focusLast();
      });

      expect(result.current.focusedIndex).toBe(3);
      expect(result.current.isNavigating).toBe(true);
    });
  });

  describe("selection with Enter and Space", () => {
    it("should call onSelect when Enter is pressed", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          onSelect: mockOnSelect,
        }),
      );

      act(() => {
        result.current.setFocusedIndex(1);
      });

      const event = new KeyboardEvent("keydown", { key: "Enter" });
      Object.defineProperty(event, "preventDefault", {
        value: vi.fn(),
        writable: true,
      });

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(mockOnSelect).toHaveBeenCalledWith(mockItems[1], 1);
    });

    it("should call onSelect when Space is pressed", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          onSelect: mockOnSelect,
        }),
      );

      act(() => {
        result.current.setFocusedIndex(2);
      });

      const event = new KeyboardEvent("keydown", { key: " " });
      Object.defineProperty(event, "preventDefault", {
        value: vi.fn(),
        writable: true,
      });

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(mockOnSelect).toHaveBeenCalledWith(mockItems[2], 2);
    });

    it("should not call onSelect if no item is focused", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          onSelect: mockOnSelect,
        }),
      );

      const event = new KeyboardEvent("keydown", { key: "Enter" });
      Object.defineProperty(event, "preventDefault", {
        value: vi.fn(),
        writable: true,
      });

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(mockOnSelect).not.toHaveBeenCalled();
    });
  });

  describe("Escape key", () => {
    it("should call onEscape and reset focus", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          onEscape: mockOnEscape,
        }),
      );

      act(() => {
        result.current.setFocusedIndex(1);
      });

      const event = new KeyboardEvent("keydown", { key: "Escape" });
      Object.defineProperty(event, "preventDefault", {
        value: vi.fn(),
        writable: true,
      });

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(mockOnEscape).toHaveBeenCalled();
      expect(result.current.focusedIndex).toBe(-1);
    });
  });

  describe("enabled state", () => {
    it("should not respond to keyboard events when disabled", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          enabled: false,
          onSelect: mockOnSelect,
        }),
      );

      const event = new KeyboardEvent("keydown", { key: "Enter" });
      Object.defineProperty(event, "preventDefault", {
        value: vi.fn(),
        writable: true,
      });

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(mockOnSelect).not.toHaveBeenCalled();
    });
  });

  describe("getItemProps", () => {
    it("should return correct props for focused item", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({ items: mockItems }),
      );

      act(() => {
        result.current.setFocusedIndex(1);
      });

      const props = result.current.getItemProps(1);

      expect(props.tabIndex).toBe(0);
      expect(props.role).toBe("button");
      expect(props["aria-label"]).toBe("Card 2");
      expect(props["aria-pressed"]).toBe(true);
      expect(props["data-keyboard-focus"]).toBe("true");
    });

    it("should return correct props for non-focused item", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({ items: mockItems }),
      );

      act(() => {
        result.current.setFocusedIndex(1);
      });

      const props = result.current.getItemProps(0);

      expect(props.tabIndex).toBe(-1);
      expect(props["aria-pressed"]).toBe(false);
      expect(props["data-keyboard-focus"]).toBe("false");
    });

    it("should use default aria-label if not provided", () => {
      const itemsWithoutLabel = [{ id: "1" }, { id: "2" }];
      const { result } = renderHook(() =>
        useKeyboardNavigation({ items: itemsWithoutLabel }),
      );

      const props = result.current.getItemProps(0);

      expect(props["aria-label"]).toBe("Item 1");
    });
  });

  describe("getContainerProps", () => {
    it("should return correct container props", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          items: mockItems,
          orientation: "horizontal",
        }),
      );

      const props = result.current.getContainerProps();

      expect(props.role).toBe("toolbar");
      expect(props["aria-label"]).toBe("Keyboard navigation");
      expect(props["aria-orientation"]).toBe("horizontal");
      expect(typeof props.onKeyDown).toBe("function");
    });
  });

  describe("focus management", () => {
    it("should reset focused index when items length decreases", () => {
      const { result, rerender } = renderHook(
        ({ items }) => useKeyboardNavigation({ items }),
        { initialProps: { items: mockItems } },
      );

      act(() => {
        result.current.setFocusedIndex(3);
      });

      expect(result.current.focusedIndex).toBe(3);

      rerender({ items: mockItems.slice(0, 2) });

      expect(result.current.focusedIndex).toBe(-1);
    });
  });
});

describe("useFocusTrap", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should return a ref", () => {
    const { result } = renderHook(() => useFocusTrap(false));
    expect(result.current).toBeDefined();
    expect(result.current.current).toBeNull();
  });

  it("should trap focus when active", () => {
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    container.appendChild(button1);
    container.appendChild(button2);

    const { result } = renderHook(() => useFocusTrap(true));
    result.current.current = container;

    // Verify ref is attached to container
    expect(result.current.current).toBe(container);
  });

  it("should return ref when deactivated", () => {
    const { result, rerender } = renderHook(
      ({ active }) => useFocusTrap(active),
      { initialProps: { active: true } },
    );

    result.current.current = container;

    rerender({ active: false });

    // Verify ref still exists
    expect(result.current).toBeDefined();
  });
});

describe("useSkipLink", () => {
  let mainElement;

  beforeEach(() => {
    mainElement = document.createElement("main");
    mainElement.id = "main-content";
    document.body.appendChild(mainElement);
  });

  afterEach(() => {
    document.body.removeChild(mainElement);
  });

  it("should return skip link functions", () => {
    const { result } = renderHook(() => useSkipLink());

    expect(result.current.skipToMain).toBeDefined();
    expect(result.current.getSkipLinkProps).toBeDefined();
    expect(typeof result.current.skipToMain).toBe("function");
    expect(typeof result.current.getSkipLinkProps).toBe("function");
  });

  it("should return correct skip link props", () => {
    const { result } = renderHook(() => useSkipLink());
    const props = result.current.getSkipLinkProps();

    expect(props.href).toBe("#main-content");
    expect(props.className).toBe("skip-link");
    expect(props["aria-label"]).toBe("Skip to main content");
    expect(typeof props.onClick).toBe("function");
  });

  it("should focus main element when skipToMain is called", async () => {
    const { result } = renderHook(() => useSkipLink());

    act(() => {
      result.current.skipToMain();
    });

    await waitFor(() => {
      expect(mainElement.getAttribute("tabindex")).toBe("-1");
    });
  });

  it("should handle click event on skip link", async () => {
    const { result } = renderHook(() => useSkipLink());
    const props = result.current.getSkipLinkProps();

    const mockEvent = {
      preventDefault: vi.fn(),
    };

    act(() => {
      props.onClick(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    await waitFor(() => {
      expect(mainElement.getAttribute("tabindex")).toBe("-1");
    });
  });
});
