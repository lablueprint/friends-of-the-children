import React from 'react';

function Login() {
  return (
    <div>
      <form>
        <label htmlFor="username">
          Username:
          <br />
          <input type="text" id="username" name="username" />
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <br />
          <input type="text" id="password" name="password" />
        </label>
      </form>
    </div>
  );
}

export default Login;
