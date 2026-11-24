import { render, screen } from '@testing-library/react';
import Footer from './Footer.jsx';

test('should render footer with copyright text', () => {
  render(<Footer />);
  expect(screen.getByText(/Copyright/i)).toBeInTheDocument();
});

test('should render footer with current year', () => {
  render(<Footer />);
  const currentYear = new Date().getFullYear();
  expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
});

test('does not display the Contact us link when the user is logged out', () => {
  render(<Footer user={{ email: '', password: '', isLoggedIn: false }} />);
  expect(screen.queryByRole('link', { name: /contact us/i })).not.toBeInTheDocument();
});

test('displays the Contact us link when the user is logged in', () => {
  render(
    <Footer user={{ email: 'test@example.com', password: 'password123', isLoggedIn: true }} />
  );
  expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument();
});
