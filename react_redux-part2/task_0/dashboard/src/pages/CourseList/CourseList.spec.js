import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import rootReducer from '../../app/rootReducer';
import CourseList from './CourseList';
import { fetchCourses } from '../../features/courses/coursesSlice';
import { logout } from '../../features/auth/authSlice';

const mockCourses = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
];

let logSpy;

beforeEach(() => {
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  mockAxios.reset();
  logSpy.mockRestore();
});

async function storeWithFetchedCourses() {
  const store = configureStore({ reducer: rootReducer });
  const promise = store.dispatch(fetchCourses());
  mockAxios.mockResponse({ data: { courses: mockCourses } });
  await promise;
  return store;
}

test('displays the courses returned by fetchCourses', async () => {
  const store = await storeWithFetchedCourses();

  render(
    <Provider store={store}>
      <CourseList />
    </Provider>
  );

  expect(screen.getByText('ES6')).toBeInTheDocument();
  expect(screen.getByText('Webpack')).toBeInTheDocument();
  expect(screen.getByText('React')).toBeInTheDocument();
});

test('resets the courses array when logout is dispatched', async () => {
  const store = await storeWithFetchedCourses();

  render(
    <Provider store={store}>
      <CourseList />
    </Provider>
  );
  expect(screen.getByText('ES6')).toBeInTheDocument();

  act(() => {
    store.dispatch(logout());
  });

  expect(store.getState().courses.courses).toEqual([]);
  expect(screen.queryByText('ES6')).not.toBeInTheDocument();
  expect(screen.getByText(/no course available yet/i)).toBeInTheDocument();
});
