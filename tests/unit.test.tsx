import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { sanitizeHtml } from '../src/utils/sanitizeHtml';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';

import ErrorBoundary from '../src/components/ErrorBoundary';
import Footer from '../src/components/sections/FooterSection/Footer';
import { Card } from 'react-bootstrap';
import TitleCard from '../src/components/cards/WorkInformationCard';

// ──────────────────────────────────────────────
// ErrorBoundary
// ──────────────────────────────────────────────
const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('Test error message');
  return <div>Safe content</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe content')).toBeTruthy();
  });

  it('shows error UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('shows a refresh button in error state', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole('button', { name: /refresh/i })).toBeTruthy();
  });

  it('refresh button calls window.location.reload', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});

// ──────────────────────────────────────────────
// Footer
// ──────────────────────────────────────────────
describe('Footer', () => {
  it('renders footer landmark', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeTruthy();
  });
});

// ──────────────────────────────────────────────
// Bootstrap Card
// ──────────────────────────────────────────────
describe('Bootstrap Card', () => {
  it('renders children', () => {
    render(<Card id="test" className="elcCard"><p>card content</p></Card>);
    expect(screen.getByText('card content')).toBeTruthy();
  });

  it('uses id as element id', () => {
    const { container } = render(<Card id="my-card" className="elcCard"> </Card>);
    expect(container.querySelector('#my-card')).toBeTruthy();
  });
});

// ──────────────────────────────────────────────
// TitleCard
// ──────────────────────────────────────────────
describe('TitleCard', () => {
  const baseProps = {
    title: 'Test Work',
    workId: 'test-1',
    workDescription: 'A test description.',
    curatorialStatement: 'A curatorial statement.',
    instructions: 'Instructions here.',
    documentationLicense: 'CC BY 4.0',
  };

  it('renders the work title', () => {
    render(<TitleCard {...baseProps} />);
    expect(screen.getByText('Test Work')).toBeTruthy();
  });

  it('renders the work description', () => {
    render(<TitleCard {...baseProps} />);
    expect(screen.getByText('A test description.')).toBeTruthy();
  });
});

// ──────────────────────────────────────────────
// ArtistCard

describe('sanitizeHtml', () => {
  it('sanitizes HTML in browser environment (strips event handlers)', () => {
    const dirty = '<p onclick="xss()">Hello</p>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('onclick');
    expect(clean).toContain('Hello');
  });

  it('passes through safe HTML unchanged', () => {
    const safe = '<p>Safe paragraph</p>';
    expect(sanitizeHtml(safe)).toBe(safe);
  });

  it('returns HTML unchanged when window is undefined (SSR path)', () => {
    vi.stubGlobal('window', undefined);
    try {
      const html = '<script>xss()</script><p>Content</p>';
      expect(sanitizeHtml(html)).toBe(html);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

// ──────────────────────────────────────────────
// ThemeContext
// ──────────────────────────────────────────────
describe('ThemeContext', () => {
  it('provides darkMode false by default', () => {
    function Consumer() {
      const { darkMode } = useTheme();
      return <div data-testid="darkMode">{String(darkMode)}</div>;
    }
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    expect(screen.getByTestId('darkMode').textContent).toBe('false');
  });

  it('allows updating darkMode through setDarkMode', () => {
    function Consumer() {
      const { darkMode, setDarkMode } = useTheme();
      return (
        <>
          <div data-testid="darkMode">{String(darkMode)}</div>
          <button onClick={() => setDarkMode(true)}>Toggle</button>
        </>
      );
    }
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    act(() => { fireEvent.click(screen.getByRole('button', { name: 'Toggle' })); });
    expect(screen.getByTestId('darkMode').textContent).toBe('true');
  });

  it('throws when useTheme is used outside ThemeProvider', () => {
    function BadConsumer() {
      useTheme();
      return null;
    }
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<BadConsumer />)).toThrow('useTheme must be used within a ThemeProvider');
    spy.mockRestore();
  });
});
