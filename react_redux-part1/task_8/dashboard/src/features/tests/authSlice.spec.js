import mockAxios from 'jest-mock-axios';
import authReducer, { login, logout, initialState } from '../auth/authSlice';

describe('authSlice', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('returns the initial state by default', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      user: { email: '', password: '' },
      isLoggedIn: false,
    });
  });

  test('handles login', () => {
    const payload = { email: 'test@example.com', password: 'password123' };
    const state = authReducer(initialState, login(payload));

    expect(state.user.email).toBe('test@example.com');
    expect(state.user.password).toBe('password123');
    expect(state.isLoggedIn).toBe(true);
  });

  test('handles logout', () => {
    const loggedInState = {
      user: { email: 'test@example.com', password: 'password123' },
      isLoggedIn: true,
    };
    const state = authReducer(loggedInState, logout());

    expect(state.user.email).toBe('');
    expect(state.user.password).toBe('');
    expect(state.isLoggedIn).toBe(false);
  });
});
