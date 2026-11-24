import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import App from '../App';
import rootReducer from '../app/rootReducer';

const baseState = {
  auth: { user: { email: '', password: '' }, isLoggedIn: false },
  notifications: { notifications: [], loading: false },
  courses: { courses: [] },
};

function renderWithStore(preloadedState = {}) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: { ...baseState, ...preloadedState },
  });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  return store;
}

let logSpy;

beforeEach(() => {
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  mockAxios.reset();
  logSpy.mockRestore();
});

test('renders Login when isLoggedIn is false', () => {
  renderWithStore();

  expect(screen.getByRole('heading', { name: /log in to continue/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test('renders CourseList when isLoggedIn is true', () => {
  renderWithStore({
    auth: { user: { email: 'test@test.com', password: 'password123' }, isLoggedIn: true },
    courses: { courses: [{ id: 1, name: 'ES6', credit: 60 }] },
  });

  expect(screen.getByRole('heading', { name: /course list/i })).toBeInTheDocument();
  expect(screen.getByText('ES6')).toBeInTheDocument();
  expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
});

test('fetches notifications on mount and displays them', async () => {
  renderWithStore();

  expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:5173/notifications.json');

  await act(async () => {
    mockAxios.mockResponse({
      data: [
        { id: 'n1', author: {}, context: { isRead: false, type: 'default', value: 'New course available' } },
        { id: 'n2', author: {}, context: { isRead: false, type: 'urgent', value: 'New resume available' } },
      ],
    });
  });

  expect(screen.getByText('New course available')).toBeInTheDocument();
  expect(screen.getByText('New resume available')).toBeInTheDocument();
});
