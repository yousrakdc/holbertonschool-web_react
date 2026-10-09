import { Component } from 'react'
import './App.css'
import Notifications from '../Notifications/Notifications'
import Header from '../Header/Header'
import Login from '../Login/Login'
import CourseList from '../CourseList/CourseList'
import Footer from '../Footer/Footer'
import BodySection from '../BodySection/BodySection'
import BodySectionWithMarginBottom from '../BodySection/BodySectionWithMarginBottom'

class App extends Component {
  static defaultProps = {
    isLoggedIn: false,
    logOut: () => {},
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown = (event) => {
    if ('ctrlKey' in event && 'key' in event && event.ctrlKey && event.key === 'h') {
      alert('Logging you out')
      this.props.logOut()
    }
  }

  render() {
    const { isLoggedIn } = this.props

    return (
      <>
        <div className="root-notifications">
          <Notifications />
        </div>
        <Header />
        {isLoggedIn ? (
          <BodySectionWithMarginBottom title="Course list">
            <CourseList />
          </BodySectionWithMarginBottom>
        ) : (
          <BodySectionWithMarginBottom title="Log in to continue">
            <Login />
          </BodySectionWithMarginBottom>
        )}
        <BodySection title="News from the School">
          <p>Holberton School News goes here</p>
        </BodySection>
        <Footer />
      </>
    )
  }
}

export default App
