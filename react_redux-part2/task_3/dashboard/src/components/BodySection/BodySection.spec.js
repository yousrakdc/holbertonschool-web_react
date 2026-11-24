import { render, screen } from '@testing-library/react';
import BodySection from './BodySection';

test('renders the title and children', () => {
  render(
    <BodySection title="test title">
      <p>child content</p>
    </BodySection>
  );
  expect(screen.getByRole('heading', { name: /test title/i })).toBeInTheDocument();
  expect(screen.getByText('child content')).toBeInTheDocument();
});
