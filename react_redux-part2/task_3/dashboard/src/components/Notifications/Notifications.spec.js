import { Profiler } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import rootReducer from '../../app/rootReducer';
import Notifications from './Notifications';
import { fetchNotifications } from '../../features/notifications/notificationsSlice';

const apiResponse = [
  { id: 'n1', author: {}, context: { isRead: false, type: 'urgent', value: 'Urgent one' } },
  { id: 'n2', author: {}, context: { isRead: false, type: 'default', value: 'Default one' } },
  { id: 'n3', author: {}, context: { isRead: true, type: 'urgent', value: 'Already read' } },
];

const storedNotifications = [
  { id: 'n1', type: 'urgent', isRead: false, value: 'Urgent one' },
  { id: 'n2', type: 'default', isRead: false, value: 'Default one' },
];

function createStore(notifications = storedNotifications, loading = false) {
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

test('displays only the unread notifications returned by the API', async () => {
  const store = createStore([]);
  const promise = store.dispatch(fetchNotifications());
  mockAxios.mockResponse({ data: apiResponse });
  await promise;

  renderWithStore(store);

  expect(screen.getByText('Urgent one')).toBeInTheDocument();
  expect(screen.getByText('Default one')).toBeInTheDocument();
  expect(screen.queryByText('Already read')).not.toBeInTheDocument();
});

test('displays "Loading..." while notifications are being fetched', async () => {
  const store = createStore([]);
  const promise = store.dispatch(fetchNotifications());
  renderWithStore(store);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await act(async () => {
    mockAxios.mockResponse({ data: apiResponse });
    await promise;
  });

  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  expect(screen.getByText('Urgent one')).toBeInTheDocument();
});

test('the urgent filter shows only urgent notifications and toggles back to all', () => {
  renderWithStore(createStore());

  fireEvent.click(screen.getByRole('button', { name: /filter urgent/i }));
  expect(screen.getByText('Urgent one')).toBeInTheDocument();
  expect(screen.queryByText('Default one')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /filter urgent/i }));
  expect(screen.getByText('Default one')).toBeInTheDocument();
});

test('the default filter shows only default notifications and toggles back to all', () => {
  renderWithStore(createStore());

  fireEvent.click(screen.getByRole('button', { name: /filter default/i }));
  expect(screen.getByText('Default one')).toBeInTheDocument();
  expect(screen.queryByText('Urgent one')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /filter default/i }));
  expect(screen.getByText('Urgent one')).toBeInTheDocument();
});

test('the drawer is hidden by default and toggles the visible class', () => {
  renderWithStore(createStore());

  expect(getDrawer().className).not.toMatch(/visible/);

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

  expect(onRender).toHaveBeenCalledTimes(rendersAfterMount);
});

test('marking a notification as read removes it from the list', () => {
  const store = createStore();
  renderWithStore(store);

  fireEvent.click(screen.getByText('Urgent one'));

  expect(store.getState().notifications.notifications).toHaveLength(1);
  expect(screen.queryByText('Urgent one')).not.toBeInTheDocument();
  expect(logSpy).toHaveBeenCalledWith('Notification n1 has been marked as read');
});
