import './App.css'
import Notifications from './Notifications'
import { getCurrentYear, getFooterCopy } from './utils'
import holbertonLogo from './assets/holberton-logo.jpg'

function App() {

  const currentYear = getCurrentYear()
  const footerCopy = getFooterCopy(false)
  return (
    <>
      <div className="root-notifications">
        <Notifications />
      </div>
      <div className="App-header">
        <img src={holbertonLogo} alt="holberton logo" />
        <h1>School dashboard</h1>
      </div>
      <div className="App-body">
        <p>Login to access the full dashboard</p>
      </div>
      <div className="App-footer">
        <p>Copyright {currentYear} - {footerCopy}</p>
      </div>
    </>
  )
}

export default App
