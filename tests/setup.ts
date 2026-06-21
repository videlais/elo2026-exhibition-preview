import '@testing-library/jest-dom';
import 'vitest-axe/extend-expect';
import { expect, vi } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

// Polyfill localStorage for Tagify in jsdom
if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.setItem !== 'function') {
  const store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
}

// Shim canvas APIs used by dependencies in jsdom to avoid noisy "Not implemented" warnings.
if (typeof HTMLCanvasElement !== 'undefined') {
  const mockContext = {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(),
    putImageData: vi.fn(),
    createImageData: vi.fn(),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
  };

  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: vi.fn(() => mockContext as unknown as CanvasRenderingContext2D),
  });
}

// jsdom does not implement pseudo-element support in getComputedStyle and logs
// noisy warnings when libraries call getComputedStyle(el, '::before' | '::after').
if (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
  const originalGetComputedStyle = window.getComputedStyle.bind(window);
  Object.defineProperty(window, 'getComputedStyle', {
    configurable: true,
    value: ((element: Element, pseudoElt?: string | null) => {
      if (pseudoElt) {
        return originalGetComputedStyle(element);
      }
      return originalGetComputedStyle(element, pseudoElt ?? undefined);
    }) as typeof window.getComputedStyle,
  });
}

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'scrollTo', {
    configurable: true,
    value: vi.fn(),
  });
}

expect.extend(matchers);
