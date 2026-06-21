import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import NavigationBar from './Navigation';
import { ThemeProvider } from '../context/ThemeContext';

function NavigationHarness() {
  return (
    <MemoryRouter>
      <ThemeProvider>
        <NavigationBar />
      </ThemeProvider>
    </MemoryRouter>
  );
}

const meta = {
  title: 'Components/Navigation',
  component: NavigationHarness,
  parameters: {
    a11y: {
      test: 'error',
    },
  },
} satisfies Meta<typeof NavigationHarness>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {};
