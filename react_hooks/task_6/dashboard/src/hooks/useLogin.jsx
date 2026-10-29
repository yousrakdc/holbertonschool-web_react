import React from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

const isFormValid = (email, password) =>
  EMAIL_REGEX.test(email) && password.length >= MIN_PASSWORD_LENGTH;

function useLogin(onLogin) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [enableSubmit, setEnableSubmit] = React.useState(false);

  const handleChangeEmail = React.useCallback(
    (event) => {
      const { value } = event.target;
      setEmail(value);
      setEnableSubmit(isFormValid(value, password));
    },
    [password]
  );

  const handleChangePassword = React.useCallback(
    (event) => {
      const { value } = event.target;
      setPassword(value);
      setEnableSubmit(isFormValid(email, value));
    },
    [email]
  );

  const handleLoginSubmit = React.useCallback(
    (event) => {
      event.preventDefault();
      if (!isFormValid(email, password)) {
        return;
      }
      if (onLogin) {
        onLogin(email, password);
      }
    },
    [email, password, onLogin]
  );

  return {
    email,
    password,
    enableSubmit,
    handleChangeEmail,
    handleChangePassword,
    handleLoginSubmit,
  };
}

export default useLogin;
