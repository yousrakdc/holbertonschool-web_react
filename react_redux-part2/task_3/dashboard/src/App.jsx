import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Notifications from './components/Notifications/Notifications.jsx';
import Header from './components/Header/Header.jsx';
import Login from './pages/Login/Login.jsx';
import Footer from './components/Footer/Footer.jsx';
import CourseList from './pages/CourseList/CourseList.jsx';
import BodySectionWithMargin from './components/BodySectionWithMarginBottom/BodySectionWithMarginBottom.jsx';
import BodySection from './components/BodySection/BodySection.jsx';
import { fetchNotifications } from './features/notifications/notificationsSlice';
import { fetchCourses } from './features/courses/coursesSlice';

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCourses());
    }
  }, [isLoggedIn, dispatch]);

  return (
    <>
      <Notifications />
      <Header />
      {isLoggedIn ? (
        <BodySectionWithMargin title="Course list">
          <CourseList />
        </BodySectionWithMargin>
      ) : (
        <BodySectionWithMargin title="Log in to continue">
          <Login />
        </BodySectionWithMargin>
      )}
      <BodySection title="News from the School">
        <p>Holberton School news goes here</p>
      </BodySection>
      <Footer />
    </>
  );
}

export default App;
