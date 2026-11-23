import React from 'react';
import useLogin from '../hooks/useLogin.jsx';

const noop = () => {};

function Login({ logIn = noop }) {
  const {
    email,
    password,
    enableSubmit,
    handleChangeEmail,
    handleChangePassword,
    handleLoginSubmit,
  } = useLogin(logIn);

  return (
    <div className="App-body">
      <p>Login to access the full dashboard</p>
      <form onSubmit={handleLoginSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          autoComplete="email"
          value={email}
          onChange={handleChangeEmail}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={handleChangePassword}
        />
        <input type="submit" value="OK" disabled={!enableSubmit} />
      </form>
    </div>
  );
}

export default Login;
