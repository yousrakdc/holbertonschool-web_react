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
import newContext from '../Context/context.js';

const defaultUser = {
  email: '',
  password: '',
  isLoggedIn: false,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.state = {
      user: { ...defaultUser },
      logOut: this.logOut,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (event.ctrlKey && event.key === 'h') {
      alert('Logging you out');
      this.state.logOut();
    }
  }

  logIn(email, password) {
    this.setState({
      user: {
        email,
        password,
        isLoggedIn: true,
      },
    });
  }

  logOut() {
    this.setState({
      user: { ...defaultUser },
    });
  }

  render() {
    const { user } = this.state;

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

    return (
      <newContext.Provider value={this.state}>
        <Notifications notifications={notificationsList} />
        <Header />
        {user.isLoggedIn ? (
          <BodySectionWithMargin title="Course list">
            <CourseList courses={coursesList} />
          </BodySectionWithMargin>
        ) : (
          <BodySectionWithMargin title="Log in to continue">
            <Login
              logIn={this.logIn}
              email={user.email}
              password={user.password}
            />
          </BodySectionWithMargin>
        )}
        <BodySection title="News from the School">
          <p>Holberton School News goes here</p>
        </BodySection>
        <Footer />
      </newContext.Provider>
    );
  }
}

export default App;
