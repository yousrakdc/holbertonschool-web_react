/* eslint-disable react-refresh/only-export-components */
import './Login.css'
import WithLogging from '../HOC/WithLogging'

function Login() {
  return (
    <div className="App-body">
      <p>Login to access the full dashboard</p>
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" />
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" />
      <button>OK</button>
    </div>
  )
}

export default WithLogging(Login)
