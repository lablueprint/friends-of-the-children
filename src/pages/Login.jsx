import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
/**
 * to resolve the warning about crypto, add fallback options
 * go to \friends-of-the-children\node_modules\react-scripts\config\webpack.config.js
 * Note: you can ctrl + P (cmd + P on Mac) and search for "webpack.config.js" to go to the file
 * from line 305 to line 309 should look like

  ...

    resolve: {
      fallback: {
        "crypto": false
      },
  ...
 */
import { db } from './firebase';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);
  // const profile = useRef();

  const getUsers = (usernameSearch) => {
    db.collection('profiles')
      .where('username', '==', usernameSearch)
      .get()
      .then((sc) => {
        // TODO: check that there is only one user with usernameSearch (error message if it does not exist)
        sc.forEach((doc) => {
          // console.log(doc.id);
          const data = doc.data();
          data.id = doc.id;
          setProfile(data);
          // console.log(doc.data());
        });
      });
  };

  useEffect(() => {
    // check the hash password only if profile is not empty
    if (profile !== null && password.length > 0) {
      bcrypt.compare(password, profile.password)
        .then((res) => {
          if (res) {
            console.log('login successful');
          } else {
            console.log('invalid credentials');
          }
        })
        .catch(); // do error checking here if necessary
      setProfile(null);
      setPassword('');
    }
  // eslint-disable-next-line
  }, [profile]);

  const handleSubmit = (event) => {
    event.preventDefault();
    getUsers(username);
    setUsername('');
    // setPassword(''); // we will do this after checking the password
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
            required
          />
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <br />
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <label htmlFor="Submit">
          <br />
          <input type="submit" onClick={handleSubmit} />
        </label>
      </form>
    </div>
  );
}
export default Login;
