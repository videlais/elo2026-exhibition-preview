import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../src/context/ThemeContext';
import NavigationBar from '../src/components/Navigation';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('Page Accessibility', () => {
  it('Navigation and main content structure should have no violations', async () => {
    const { container } = renderWithProviders(
      <>
        <nav><p>Navigation area</p></nav>
        <main id="main-content"><p>Body content</p></main>
      </>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Navigation Accessibility', () => {
  it('NavigationBar should have no violations', async () => {
    const { container } = renderWithProviders(
      <NavigationBar />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
