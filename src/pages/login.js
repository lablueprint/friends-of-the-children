import React, { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const handleClick = (event) => {
  //   event.preventDefault();
  //   console.log(username);
  //   console.log(password);
  // };
  return (
    <div>
      <form>
        <label htmlFor="username">
          Username:
          <br />
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <br />
          <input
            type="text"
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <label htmlFor="Submit">
          <br />
          <input type="submit" id="password" name="password" />
        </label>
      </form>
    </div>

  );
}

export default Login;
