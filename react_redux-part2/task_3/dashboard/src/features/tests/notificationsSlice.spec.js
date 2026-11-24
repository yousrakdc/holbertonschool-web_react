import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import notificationsReducer, {
  fetchNotifications,
  markNotificationAsRead,
} from '../notifications/notificationsSlice';

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

    mockAxios.mockResponse({
      data: [
        { id: 'n1', author: {}, context: { isRead: false, type: 'urgent', value: 'Urgent one' } },
        { id: 'n2', author: {}, context: { isRead: true, type: 'default', value: 'Read one' } },
      ],
    });
    await promise;

    expect(store.getState().notifications).toEqual([
      { id: 'n1', type: 'urgent', isRead: false, value: 'Urgent one' },
    ]);
    expect(store.getState().loading).toBe(false);
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
