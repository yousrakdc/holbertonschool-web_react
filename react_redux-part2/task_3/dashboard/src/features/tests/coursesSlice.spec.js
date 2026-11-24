import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import coursesReducer, { fetchCourses } from '../courses/coursesSlice';
import { logout } from '../auth/authSlice';

describe('coursesSlice', () => {
  const initialState = {
    courses: [],
  };

  const mockCourses = [
    { id: 1, name: 'ES6', credit: 60 },
    { id: 2, name: 'Webpack', credit: 20 },
    { id: 3, name: 'React', credit: 40 },
  ];

  afterEach(() => {
    mockAxios.reset();
  });

  it('should return the correct initial state by default', () => {
    expect(coursesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('fetches correctly the courses data', async () => {
    const store = configureStore({ reducer: coursesReducer });
    const promise = store.dispatch(fetchCourses());

    expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:5173/courses.json');
    mockAxios.mockResponse({ data: { courses: mockCourses } });
    await promise;

    expect(store.getState().courses).toEqual(
      mockCourses.map((course) => ({ ...course, isSelected: false }))
    );
  });

  it('resets the courses array to empty when logout is dispatched', () => {
    const state = coursesReducer({ courses: mockCourses }, logout());

    expect(state).toEqual(initialState);
    expect(state.courses).toHaveLength(0);
  });
});
