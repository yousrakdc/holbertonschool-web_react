/* global process */
import React from 'react';
import axios from 'axios';
import { getLatestNotification } from '../utils/utils.js';
import Notifications from '../Notifications/Notifications.jsx';
import Header from '../Header/Header.jsx';
import Login from '../Login/Login.jsx';
import Footer from '../Footer/Footer.jsx';
import CourseList from '../CourseList/CourseList.jsx';
import BodySectionWithMargin from '../BodySection/BodySectionWithMarginBottom.jsx';
import BodySection from '../BodySection/BodySection.jsx';
import { appReducer, initialState, APP_ACTIONS } from './appReducer.js';

const API_BASE_URL = '';

const extractList = (data, key) => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data[key])) {
    return data[key];
  }
  return [];
};

function App() {
  const [state, dispatch] = React.useReducer(appReducer, initialState);
  const { displayDrawer, user, notifications, courses } = state;

  // Notifications: fetched once, when the component first renders
  React.useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/notifications.json`);
        const data = extractList(response.data, 'notifications').map((notification) =>
          notification.html
            ? { ...notification, html: getLatestNotification() }
            : notification
        );
        if (isMounted) {
          dispatch({ type: APP_ACTIONS.SET_NOTIFICATIONS, payload: data });
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  // Courses: fetched whenever the user state changes
  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/courses.json`);
        dispatch({
          type: APP_ACTIONS.SET_COURSES,
          payload: extractList(response.data, 'courses'),
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching courses:', error);
        }
      }
    };

    fetchCourses();
  }, [user]);

  const logIn = React.useCallback((email, password) => {
    dispatch({ type: APP_ACTIONS.LOGIN, payload: { email, password } });
  }, []);

  const logOut = React.useCallback(() => {
    dispatch({ type: APP_ACTIONS.LOGOUT });
  }, []);

  const markNotificationAsRead = React.useCallback((id) => {
    console.log(`Notification ${id} has been marked as read`);
    dispatch({ type: APP_ACTIONS.MARK_NOTIFICATION_READ, payload: id });
  }, []);

  const handleDisplayDrawer = React.useCallback(() => {
    dispatch({ type: APP_ACTIONS.TOGGLE_DRAWER });
  }, []);

  const handleHideDrawer = React.useCallback(() => {
    dispatch({ type: APP_ACTIONS.TOGGLE_DRAWER });
  }, []);

  return (
    <>
      <Notifications
        notifications={notifications}
        displayDrawer={displayDrawer}
        handleDisplayDrawer={handleDisplayDrawer}
        handleHideDrawer={handleHideDrawer}
        markNotificationAsRead={markNotificationAsRead}
      />
      <Header user={user} logOut={logOut} />
      {user.isLoggedIn ? (
        <BodySectionWithMargin title="Course list">
          <CourseList courses={courses} />
        </BodySectionWithMargin>
      ) : (
        <BodySectionWithMargin title="Log in to continue">
          <Login logIn={logIn} />
        </BodySectionWithMargin>
      )}
      <BodySection title="News from the School">
        <p>Holberton School News goes here</p>
      </BodySection>
      <Footer user={user} />
    </>
  );
}

export default App;
