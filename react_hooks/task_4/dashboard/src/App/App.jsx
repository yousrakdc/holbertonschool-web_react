/* global process */
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getLatestNotification } from '../utils/utils.js';
import Notifications from '../Notifications/Notifications.jsx';
import Header from '../Header/Header.jsx';
import Login from '../Login/Login.jsx';
import Footer from '../Footer/Footer.jsx';
import CourseList from '../CourseList/CourseList.jsx';
import BodySectionWithMargin from '../BodySection/BodySectionWithMarginBottom.jsx';
import BodySection from '../BodySection/BodySection.jsx';
import Context, { user as contextUser } from '../Context/context.js';

const API_BASE_URL = 'http://localhost:5173';

const notificationsList = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', html: { __html: getLatestNotification() } },
];

const coursesList = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
];

// Accepts { notifications: [...] } as well as a plain array
const extractList = (data, key) => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data[key])) {
    return data[key];
  }
  return null;
};

// The JSON cannot hold the computed HTML of the latest notification
const withLatestNotification = (notification) =>
  notification.html && !notification.html.__html
    ? { ...notification, html: { __html: getLatestNotification() } }
    : notification;

function App() {
  const [displayDrawer, setDisplayDrawer] = useState(true);
  const [user, setUser] = useState(contextUser);
  const [notifications, setNotifications] = useState(notificationsList);
  const [courses, setCourses] = useState(coursesList);

  // Notifications: fetched once on mount, replace the initial list on success
  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/notifications.json`);
        const list = extractList(response.data, 'notifications');
        if (isMounted && list) {
          setNotifications(list.map(withLatestNotification));
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

  // Courses: fetched each time the user logs in
  useEffect(() => {
    if (!user.isLoggedIn) {
      return undefined;
    }

    let isMounted = true;

    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/courses.json`);
        const list = extractList(response.data, 'courses');
        if (isMounted && list) {
          setCourses(list);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching courses:', error);
        }
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, [user.isLoggedIn]);

  const handleDisplayDrawer = useCallback(() => {
    setDisplayDrawer(true);
  }, []);

  const handleHideDrawer = useCallback(() => {
    setDisplayDrawer(false);
  }, []);

  const logIn = useCallback((email, password) => {
    setUser({ email, password, isLoggedIn: true });
  }, []);

  const logOut = useCallback(() => {
    setUser(contextUser);
  }, []);

  const markNotificationAsRead = useCallback((id) => {
    console.log(`Notification ${id} has been marked as read`);
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  }, []);

  const contextValue = useMemo(() => ({ user, logOut }), [user, logOut]);

  return (
    <Context.Provider value={contextValue}>
      <Notifications
        notifications={notifications}
        displayDrawer={displayDrawer}
        handleDisplayDrawer={handleDisplayDrawer}
        handleHideDrawer={handleHideDrawer}
        markNotificationAsRead={markNotificationAsRead}
      />
      <Header />
      {user.isLoggedIn ? (
        <BodySectionWithMargin title="Course list">
          <CourseList courses={courses} />
        </BodySectionWithMargin>
      ) : (
        <BodySectionWithMargin title="Log in to continue">
          <Login
            logIn={logIn}
            email={user.email}
            password={user.password}
          />
        </BodySectionWithMargin>
      )}
      <BodySection title="News from the School">
        <p>Holberton School News goes here</p>
      </BodySection>
      <Footer />
    </Context.Provider>
  );
}

export default App;
