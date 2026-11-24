import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import rootReducer from '../../app/rootReducer';
import Notifications from './Notifications';
import { fetchNotifications } from '../../features/notifications/notificationsSlice';

const mockNotifications = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
];

function createStore(displayDrawer = true, notifications = mockNotifications) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: { notifications: { notifications, displayDrawer } },
  });
}

function renderWithStore(store) {
  render(
    <Provider store={store}>
      <Notifications />
    </Provider>
  );
}

let logSpy;

beforeEach(() => {
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  mockAxios.reset();
  logSpy.mockRestore();
});

test('displays the notification items returned by fetchNotifications', async () => {
  const store = createStore(true, []);
  const promise = store.dispatch(fetchNotifications());
  mockAxios.mockResponse({ data: { notifications: mockNotifications } });
  await promise;

  renderWithStore(store);

  expect(screen.getByText('New course available')).toBeInTheDocument();
  expect(screen.getByText('New resume available')).toBeInTheDocument();
});

test('closing the drawer sets displayDrawer to false', () => {
  const store = createStore(true);
  renderWithStore(store);

  fireEvent.click(screen.getByRole('button', { name: /close/i }));

  expect(store.getState().notifications.displayDrawer).toBe(false);
  expect(screen.queryByText(/here is the list of notifications/i)).not.toBeInTheDocument();
});

test('opening the drawer sets displayDrawer to true', () => {
  const store = createStore(false);
  renderWithStore(store);

  fireEvent.click(screen.getByText(/your notifications/i));

  expect(store.getState().notifications.displayDrawer).toBe(true);
  expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument();
});

test('marking a notification as read removes it from the list', () => {
  const store = createStore(true);
  renderWithStore(store);

  fireEvent.click(screen.getByText('New course available'));

  expect(store.getState().notifications.notifications).toHaveLength(1);
  expect(screen.queryByText('New course available')).not.toBeInTheDocument();
  expect(screen.getByText('New resume available')).toBeInTheDocument();
  expect(logSpy).toHaveBeenCalledWith('Notification 1 has been marked as read');
});
