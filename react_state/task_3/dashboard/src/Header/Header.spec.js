import { expect, test, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header.jsx';
import Context from '../Context/context.js';

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

test('does not render logoutSection with the default context value', () => {
  const { container } = render(<Header />);
  expect(container.querySelector('#logoutSection')).toBeNull();
});

test('renders logoutSection when the user is logged in', () => {
  const { container } = render(
    <Context.Provider value={{ user: loggedInUser, logOut: () => {} }}>
      <Header />
    </Context.Provider>
  );
  const section = container.querySelector('#logoutSection');
  expect(section).toBeInTheDocument();
  expect(section).toHaveTextContent(/welcome test@example\.com \(logout\)/i);
});

test('calls logOut when the logout link is clicked', () => {
  const logOutSpy = jest.fn();
  render(
    <Context.Provider value={{ user: loggedInUser, logOut: logOutSpy }}>
      <Header />
    </Context.Provider>
  );
  fireEvent.click(screen.getByRole('link', { name: /logout/i }));
  expect(logOutSpy).toHaveBeenCalledTimes(1);
});