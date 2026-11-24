import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../app/rootReducer';
import Login from './Login';

function renderWithStore() {
  const store = configureStore({ reducer: rootReducer });
  render(
    <Provider store={store}>
      <Login />
    </Provider>
  );
  return store;
}

test('displays the email, password fields and the submit button', () => {
  renderWithStore();

  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
});

test('submitting valid credentials sets isLoggedIn to true', () => {
  const store = renderWithStore();

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: /ok/i }));

  expect(store.getState().auth.isLoggedIn).toBe(true);
  expect(store.getState().auth.user.email).toBe('test@example.com');
});

test('submitting invalid credentials keeps isLoggedIn false', () => {
  const store = renderWithStore();

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bad' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });

  const button = screen.getByRole('button', { name: /ok/i });
  expect(button).toBeDisabled();
  fireEvent.submit(button.closest('form'));

  expect(store.getState().auth.isLoggedIn).toBe(false);
});
