import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import Footer from '../src/components/sections/FooterSection/Footer';
import { Card } from 'react-bootstrap';
import TitleCard from '../src/components/cards/WorkInformationCard';

describe('Accessibility (axe-core)', () => {
  describe('Footer', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <Footer />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Bootstrap Card', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <Card id="testCard" className="elcCard">
          <h2>Test Card</h2>
          <p>Card content</p>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('TitleCard', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <TitleCard
          title="Test Work Title"
          workId="test-1"
          workDescription="A test description."
          curatorialStatement="A curatorial statement."
          instructions="Instructions here."
          documentationLicense="CC BY 4.0"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
