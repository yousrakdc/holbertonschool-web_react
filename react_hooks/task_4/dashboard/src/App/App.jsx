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
import Context from '../Context/context.js';

const API_BASE_URL = 'http://localhost:5173';

const defaultUser = {
  email: '',
  password: '',
  isLoggedIn: false,
};

function App() {
  const [displayDrawer, setDisplayDrawer] = React.useState(true);
  const [user, setUser] = React.useState({ ...defaultUser });
  const [notifications, setNotifications] = React.useState([]);
  const [courses, setCourses] = React.useState([]);

  // Notifications: fetched once, when the component first renders
  React.useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/notifications.json`);
        const data = response.data.map((notification) =>
          notification.html
            ? { ...notification, html: getLatestNotification() }
            : notification
        );
        if (isMounted) {
          setNotifications(data);
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

  // Courses: fetched when the user state changes and the user is logged in
  React.useEffect(() => {
    if (!user.isLoggedIn) {
      return undefined;
    }

    let isMounted = true;

    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/courses.json`);
        if (isMounted) {
          setCourses(response.data);
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
  }, [user]);

  const logIn = React.useCallback((email, password) => {
    setUser({
      email,
      password,
      isLoggedIn: true,
    });
  }, []);

  const logOut = React.useCallback(() => {
    setUser({ ...defaultUser });
  }, []);

  const markNotificationAsRead = React.useCallback((id) => {
    console.log(`Notification ${id} has been marked as read`);
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  }, []);

  const handleDisplayDrawer = React.useCallback(() => {
    setDisplayDrawer(true);
  }, []);

  const handleHideDrawer = React.useCallback(() => {
    setDisplayDrawer(false);
  }, []);

  const contextValue = React.useMemo(() => ({ user, logOut }), [user, logOut]);

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
