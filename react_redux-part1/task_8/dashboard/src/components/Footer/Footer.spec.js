import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../app/rootReducer';
import Footer from './Footer';

function renderWithStore(isLoggedIn = false) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      auth: { user: { email: 'test@test.com', password: 'password123' }, isLoggedIn },
    },
  });
  render(
    <Provider store={store}>
      <Footer />
    </Provider>
  );
}

test('displays the copyright text with the current year', () => {
  renderWithStore();

  expect(
    screen.getByText(`Copyright ${new Date().getFullYear()} - Holberton School`)
  ).toBeInTheDocument();
});

test('displays the Contact us link when isLoggedIn is true', () => {
  renderWithStore(true);

  expect(screen.getByText(/contact us/i)).toBeInTheDocument();
});

test('does not display the Contact us link when isLoggedIn is false', () => {
  renderWithStore(false);

  expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument();
});
