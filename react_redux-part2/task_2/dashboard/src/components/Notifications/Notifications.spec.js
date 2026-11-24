import { Profiler } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

function createStore(notifications = mockNotifications, loading = false) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: { notifications: { notifications, loading } },
  });
}

function renderWithStore(store, onRender = () => {}) {
  render(
    <Provider store={store}>
      <Profiler id="notifications" onRender={onRender}>
        <Notifications />
      </Profiler>
    </Provider>
  );
}

const getDrawer = () =>
  screen.getByText(/here is the list of notifications/i).closest('div');

let logSpy;

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

test('the drawer is hidden by default', () => {
  renderWithStore(createStore());

  expect(getDrawer().className).not.toMatch(/visible/);
});

test('clicking "Your notifications" adds the visible class', () => {
  renderWithStore(createStore());

  fireEvent.click(screen.getByText(/your notifications/i));

  expect(getDrawer().className).toMatch(/visible/);
});

test('clicking the close button removes the visible class', () => {
  renderWithStore(createStore());

  fireEvent.click(screen.getByText(/your notifications/i));
  expect(getDrawer().className).toMatch(/visible/);

  fireEvent.click(screen.getByRole('button', { name: /close/i }));
  expect(getDrawer().className).not.toMatch(/visible/);
});

test('toggling the drawer does not re-render the component', () => {
  const onRender = jest.fn();
  renderWithStore(createStore(), onRender);
  const rendersAfterMount = onRender.mock.calls.length;

  fireEvent.click(screen.getByText(/your notifications/i));
  fireEvent.click(screen.getByRole('button', { name: /close/i }));
  fireEvent.click(screen.getByText(/your notifications/i));

  expect(onRender).toHaveBeenCalledTimes(rendersAfterMount);
});

test('marking a notification as read removes it from the list', () => {
  const store = createStore();
  renderWithStore(store);

  fireEvent.click(screen.getByText('New course available'));

  expect(store.getState().notifications.notifications).toHaveLength(1);
  expect(screen.queryByText('New course available')).not.toBeInTheDocument();
  expect(logSpy).toHaveBeenCalledWith('Notification 1 has been marked as read');
});

test('displays "Loading..." while notifications are being fetched', async () => {
  const store = createStore([]);
  const promise = store.dispatch(fetchNotifications());
  renderWithStore(store);

  expect(screen.getByText('Loading...')).toBeInTheDocument();
  expect(screen.queryByText('New course available')).not.toBeInTheDocument();

  await act(async () => {
    mockAxios.mockResponse({ data: { notifications: mockNotifications } });
    await promise;
  });

  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  expect(screen.getByText('New course available')).toBeInTheDocument();
});

test('hides "Loading..." when the request fails', async () => {
  const store = createStore([]);
  const promise = store.dispatch(fetchNotifications());
  renderWithStore(store);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await act(async () => {
    mockAxios.mockError(new Error('Network error'));
    await promise;
  });

  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  expect(screen.getByText(/no new notification for now/i)).toBeInTheDocument();
});
