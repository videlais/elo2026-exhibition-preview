import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WorkAccessModal from '../../src/components/modals/WorkAccessModal';

describe('WorkAccessModal', () => {
  const baseProps = {
    title: 'Test Work Title',
    workId: 42,
    workUrl: 'https://example.com/work',
    show: true,
    onClose: vi.fn(),
    instructionsBlock: <p>Play in a modern browser.</p>,
    beginLinks: <a href="https://begin.example.com">Begin</a>,
  };

  beforeEach(() => {
    baseProps.onClose.mockClear();
  });

  it('renders the modal title when show is true', () => {
    render(<WorkAccessModal {...baseProps} />);
    expect(screen.getByText('Test Work Title')).toBeInTheDocument();
  });

  it('renders a video element with correct sources', () => {
    render(<WorkAccessModal {...baseProps} />);
    const video = document.querySelector('video');
    expect(video).not.toBeNull();
    const sources = document.querySelectorAll('source');
    const srcValues = Array.from(sources).map((s) => s.getAttribute('src'));
    expect(srcValues.some((s) => s?.includes('ELO-ID42-WEBM.webm'))).toBe(true);
    expect(srcValues.some((s) => s?.includes('ELO-ID42-MP4.mp4'))).toBe(true);
  });

  it('renders the Online link', () => {
    render(<WorkAccessModal {...baseProps} />);
    const onlineLink = screen.getByRole('link', { name: 'Online' });
    expect(onlineLink).toBeInTheDocument();
    expect(onlineLink).toHaveAttribute('href', 'https://example.com/work');
  });

  it('renders instructionsBlock content', () => {
    render(<WorkAccessModal {...baseProps} />);
    expect(screen.getByText('Play in a modern browser.')).toBeInTheDocument();
  });

  it('renders beginLinks content', () => {
    render(<WorkAccessModal {...baseProps} />);
    expect(screen.getByRole('link', { name: 'Begin' })).toBeInTheDocument();
  });

  it('calls onClose when footer Close button is clicked', () => {
    render(<WorkAccessModal {...baseProps} />);
    // There are two Close buttons (modal header X + footer Close); get the visible text one
    const closeButtons = screen.getAllByRole('button', { name: 'Close' });
    const footerClose = closeButtons.find((btn) => btn.textContent?.trim() === 'Close')!;
    fireEvent.click(footerClose);
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render the title when show is false', () => {
    render(<WorkAccessModal {...baseProps} show={false} />);
    expect(screen.queryByText('Test Work Title')).not.toBeInTheDocument();
  });
});
