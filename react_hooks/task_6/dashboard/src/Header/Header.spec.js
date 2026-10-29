import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header.jsx';

const loggedInUser = {
  email: 'test@example.com',
  password: 'password123',
  isLoggedIn: true,
};

test('should render header with logo', () => {
  render(<Header />);
  expect(screen.getByAltText(/holberton logo/i)).toBeInTheDocument();
});

test('should render header with title', () => {
  render(<Header />);
  expect(screen.getByRole('heading')).toHaveTextContent(/School dashboard/i);
});

test('does not render logoutSection when no user is passed', () => {
  const { container } = render(<Header />);
  expect(container.querySelector('#logoutSection')).toBeNull();
});

test('does not render logoutSection when the user is logged out', () => {
  const { container } = render(
    <Header user={{ email: '', password: '', isLoggedIn: false }} />
  );
  expect(container.querySelector('#logoutSection')).toBeNull();
});

test('renders logoutSection when the user is logged in', () => {
  const { container } = render(<Header user={loggedInUser} logOut={() => {}} />);
  const section = container.querySelector('#logoutSection');
  expect(section).toBeInTheDocument();
  expect(section).toHaveTextContent(/welcome test@example\.com \(logout\)/i);
});

test('calls logOut when the logout link is clicked', () => {
  const logOutSpy = jest.fn();
  render(<Header user={loggedInUser} logOut={logOutSpy} />);
  fireEvent.click(screen.getByRole('link', { name: /logout/i }));
  expect(logOutSpy).toHaveBeenCalledTimes(1);
});
