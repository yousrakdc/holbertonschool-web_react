import './App.css';
import React from 'react';
import { getLatestNotification } from '../utils/utils.js';
import Notifications from '../Notifications/Notifications.jsx';
import Header from '../Header/Header.jsx';
import Login from '../Login/Login.jsx';
import Footer from '../Footer/Footer.jsx';
import CourseList from '../CourseList/CourseList.jsx';
import BodySectionWithMargin from '../BodySection/BodySectionWithMarginBottom.jsx';
import BodySection from '../BodySection/BodySection.jsx';
import Context from '../Context/context.js';

const defaultUser = {
  email: '',
  password: '',
  isLoggedIn: false,
};

const notificationsList = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', html: getLatestNotification() },
];

const coursesList = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
];

function App() {
  const [displayDrawer, setDisplayDrawer] = React.useState(true);
  const [user, setUser] = React.useState({ ...defaultUser });
  const [notifications, setNotifications] = React.useState(notificationsList);

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
          <CourseList courses={coursesList} />
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
