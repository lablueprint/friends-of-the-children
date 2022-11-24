import React, { useState } from 'react';

// const [password, setPassword] = useState('');

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleClick = (event) => {
    event.preventDefault();
    console.log(username);
    console.log(password);
  };
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
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <br />
        <input type="submit" value="Log in" onClick={handleClick} />
      </form>
    </div>
  );
}

export default Login;
