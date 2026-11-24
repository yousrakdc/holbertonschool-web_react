import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import { StyleSheetTestUtils, css, StyleSheet } from 'aphrodite';
import rootReducer from '../../app/rootReducer';
import Notifications from './Notifications';
import { fetchNotifications } from '../../features/notifications/notificationsSlice';

const mockNotifications = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
];

const visibleClass = css(
  StyleSheet.create({ visible: { opacity: 1, visibility: 'visible' } }).visible
);

function createStore(notifications = mockNotifications) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: { notifications: { notifications } },
  });
}

function getDrawer() {
  return document.querySelector('.notification-items');
}

function renderWithStore(store) {
  render(
    <Provider store={store}>
      <Notifications />
    </Provider>
  );
}

let logSpy;

beforeAll(() => {
  StyleSheetTestUtils.suppressStyleInjection();
});

afterAll(() => {
  StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
});

beforeEach(() => {
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  mockAxios.reset();
  logSpy.mockRestore();
});

test('displays the notification items returned by fetchNotifications', async () => {
  const store = createStore([]);
  const promise = store.dispatch(fetchNotifications());
  mockAxios.mockResponse({ data: { notifications: mockNotifications } });
  await promise;

  renderWithStore(store);

  expect(screen.getByText('New course available')).toBeInTheDocument();
  expect(screen.getByText('New resume available')).toBeInTheDocument();
});

test('the drawer is visible by default', () => {
  renderWithStore(createStore());

  expect(getDrawer()).toHaveClass(visibleClass);
});

test('clicking the close button removes the visible style', () => {
  renderWithStore(createStore());

  fireEvent.click(screen.getByRole('button', { name: /close/i }));

  expect(getDrawer()).not.toHaveClass(visibleClass);
});

test('clicking the title toggles the visible style', () => {
  renderWithStore(createStore());

  fireEvent.click(screen.getByText(/your notifications/i));
  expect(getDrawer()).not.toHaveClass(visibleClass);

  fireEvent.click(screen.getByText(/your notifications/i));
  expect(getDrawer()).toHaveClass(visibleClass);
});

test('toggling the drawer does not change the redux state', () => {
  const store = createStore();
  renderWithStore(store);
  const before = store.getState().notifications;

  fireEvent.click(screen.getByText(/your notifications/i));
  fireEvent.click(screen.getByRole('button', { name: /close/i }));

  expect(store.getState().notifications).toBe(before);
});

test('marking a notification as read removes it from the list', () => {
  const store = createStore();
  renderWithStore(store);

  fireEvent.click(screen.getByText('New course available'));

  expect(store.getState().notifications.notifications).toHaveLength(1);
  expect(screen.queryByText('New course available')).not.toBeInTheDocument();
  expect(screen.getByText('New resume available')).toBeInTheDocument();
  expect(logSpy).toHaveBeenCalledWith('Notification 1 has been marked as read');
});
