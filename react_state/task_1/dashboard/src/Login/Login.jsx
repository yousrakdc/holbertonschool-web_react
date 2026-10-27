import React, { Component } from 'react';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email || '',
      password: props.password || '',
      enableSubmit: false,
    };
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  isValid(email, password) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 8;
  }

  handleChangeEmail(e) {
    const email = e.target.value;
    this.setState({
      email,
      enableSubmit: this.isValid(email, this.state.password),
    });
  }

  handleChangePassword(e) {
    const password = e.target.value;
    this.setState({
      password,
      enableSubmit: this.isValid(this.state.email, password),
    });
  }

  handleLoginSubmit(e) {
    e.preventDefault();
    if (this.props.logIn) {
      this.props.logIn(this.state.email, this.state.password);
    }
  }

  render() {
    const { email, password, enableSubmit } = this.state;
    return (
      <div className="App-body">
        <p>Login to access the full dashboard</p>
        <form onSubmit={this.handleLoginSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            value={email}
            onChange={this.handleChangeEmail}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={this.handleChangePassword}
          />
          <input type="submit" value="OK" disabled={!enableSubmit} />
        </form>
      </div>
    );
  }
}

export default Login;
