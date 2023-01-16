import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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

function Login({ updateAppProfile }) { // deconstruct the function props
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
          const data = doc.data();
          data.id = doc.id;
          setProfile(data);
        });
      });
  };

  useEffect(() => {
    // check the hash password only if profile is not empty
    if (profile !== null && password.length > 0) {
      bcrypt.compare(password, profile.password) // compare passwords
        .then((isValid) => {
          if (isValid) { // check whether it is a valid credential
            console.log('login successful');
            const { profilePassword, ...userProfile } = profile; // peform destruction to get profile w/o password
            updateAppProfile(userProfile); // pass to the upper lever (parent components so that it can be used for other pages)
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
    event.preventDefault(); // this prevents from page to be refreshing
    getUsers(username);
    setUsername('');
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

// props validation
Login.propTypes = {
  updateAppProfile: PropTypes.func.isRequired,
};

export default Login;
