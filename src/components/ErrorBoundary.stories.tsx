import type { Meta, StoryObj } from '@storybook/react-vite';
import ErrorBoundary from './ErrorBoundary';

function SafeChild() {
  return <div>Everything is working.</div>;
}

function ThrowingChild(): JSX.Element {
  throw new Error('Story error');
}

const meta = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  args: {
    children: <SafeChild />,
  },
  parameters: {
    a11y: {
      test: 'error',
    },
  },
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FallbackUi: Story = {
  args: {
    children: <ThrowingChild />,
  },
};
