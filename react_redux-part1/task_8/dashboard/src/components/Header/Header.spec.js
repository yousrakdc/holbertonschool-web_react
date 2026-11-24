import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../app/rootReducer';
import Header from './Header';
import { login } from '../../features/auth/authSlice';

const loggedIn = {
  auth: { user: { email: 'test@test.com', password: 'password123' }, isLoggedIn: true },
};

function renderWithStore(store) {
  render(
    <Provider store={store}>
      <Header />
    </Provider>
  );
}

test('displays the logout link when isLoggedIn is true', () => {
  const store = configureStore({ reducer: rootReducer, preloadedState: loggedIn });
  renderWithStore(store);

  expect(screen.getByText(/logout/i)).toBeInTheDocument();
});

test('displays a welcome message with the email after the login action', () => {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch(login({ email: 'user@example.com', password: 'password123' }));
  renderWithStore(store);

  expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  expect(screen.getByText('user@example.com')).toBeInTheDocument();
});

test('clicking logout sets isLoggedIn to false', () => {
  const store = configureStore({ reducer: rootReducer, preloadedState: loggedIn });
  renderWithStore(store);

  fireEvent.click(screen.getByText(/logout/i));

  expect(store.getState().auth.isLoggedIn).toBe(false);
  expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
});
