import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import notificationsReducer, {
  fetchNotifications,
  markNotificationAsRead,
} from '../notifications/notificationsSlice';
import { getLatestNotification } from '../../utils/utils';

describe('notificationsSlice', () => {
  const initialState = {
  notifications: [],
  loading: false,
};

  const mockNotifications = [
    { id: 1, type: 'default', value: 'New course available' },
    { id: 2, type: 'urgent', value: 'New resume available' },
    { id: 3, type: 'urgent', html: { __html: '' } },
  ];

  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    mockAxios.reset();
    logSpy.mockRestore();
  });

  it('should return the correct initial state by default', () => {
    expect(notificationsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should fetch notifications data correctly', async () => {
    const store = configureStore({ reducer: notificationsReducer });
    const promise = store.dispatch(fetchNotifications());

    expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:5173/notifications.json');
    mockAxios.mockResponse({ data: { notifications: mockNotifications } });
    await promise;

    const { notifications } = store.getState();
    expect(notifications).toHaveLength(3);
    expect(notifications[0]).toEqual(mockNotifications[0]);
    expect(notifications[1]).toEqual(mockNotifications[1]);
    expect(notifications[2]).toEqual({
      ...mockNotifications[2],
      html: { __html: getLatestNotification() },
    });
  });

  it('should remove a notification when markNotificationAsRead is dispatched', () => {
    const state = notificationsReducer(
      { ...initialState, notifications: mockNotifications },
      markNotificationAsRead(2)
    );

    expect(state.notifications).toHaveLength(2);
    expect(state.notifications.find((n) => n.id === 2)).toBeUndefined();
    expect(logSpy).toHaveBeenCalledWith('Notification 2 has been marked as read');
  });

  it('sets loading to true while fetchNotifications is pending', () => {
  const state = notificationsReducer(initialState, { type: fetchNotifications.pending.type });
  expect(state.loading).toBe(true);
});

it('sets loading to false when fetchNotifications is rejected', () => {
  const state = notificationsReducer(
    { ...initialState, loading: true },
    { type: fetchNotifications.rejected.type }
  );
  expect(state.loading).toBe(false);
});
});
