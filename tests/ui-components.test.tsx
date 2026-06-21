import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import NavigationBar from '../src/components/Navigation';
import { ThemeProvider } from '../src/context/ThemeContext';

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname + location.hash}</div>;
}

describe('NavigationBar', () => {
  it('navigates to about route when About link is clicked', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route
              path="*"
              element={
                <>
                  <NavigationBar />
                  <LocationDisplay />
                </>
              }
            />
          </Routes>
        </MemoryRouter>
      </AppProviders>
    );

    fireEvent.click(screen.getByRole('link', { name: 'About' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/about');
  });
});
