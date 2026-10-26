import React, { Component } from 'react';
import './Login.spec.js';

class Login extends Component {
  render() {
    return (
      <div className="App-body">
        <p>Login to access the full dashboard</p>
        <form>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" autoComplete="email" />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" autoComplete="current-password" />
        </form>
        <button>OK</button>
      </div>
    );
  }
}

export default Login;
