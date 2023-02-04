import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import bcrypt from 'bcryptjs';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

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
  // const [userIsGoogleLoggedIn, setuserIsGoogleLoggedIn] = useState(false);

  const navigate = useNavigate();
  // const profile = useRef();

  const getUsers = (usernameSearch) => {
    console.log('called users');
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
        if (profile != null) {
          bcrypt.compare(password, profile.password) // compare passwords
            .then((isValid) => {
              if (isValid) { // check whether it is a valid credential
                console.log('login successful');
                const { password: profilePassword, ...userProfile } = profile; // peform destruction to get profile w/o password
                updateAppProfile(userProfile); // pass to the upper lever (parent components so that it can be used for other pages)
                navigate('/modules');
              } else {
                console.log('invalid credentials');
              }
            })
            .catch(); // do error checking here if necessary
          setProfile(null);
          setPassword('');
        }
      });

    console.log(profile);
  };

  const provider = new GoogleAuthProvider();

  function signInWithGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('SC');
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log('credential: ', credential);
        const token = credential.accessToken;
        console.log(token);
        // The signed-in user info.
        const { user: googleUser } = result;
        console.log(googleUser);
        // setGoogleLoggedIn(true);
        // setEmail(googleUser.email);
        // setUsername(googleUser.displayName);
      // ...
      }).catch((error) => {
      // Handle Errors here.
        const errorCode = error.code;
        console.log(errorCode);

        const googleErrorMessage = error.message;
        console.log(googleErrorMessage);

        // The email of the user's account used.
        // const { email } = error.customData;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      });
  }

  // useEffect(() => {
  //   console.log('true');
  //   // check the hash password only if profile is not empty
  //   if (profile !== null && password.length > 0) {
  //     bcrypt.compare(password, profile.password) // compare passwords
  //       .then((isValid) => {
  //         if (isValid) { // check whether it is a valid credential
  //           console.log('login successful');
  //           const { password: profilePassword, ...userProfile } = profile; // peform destruction to get profile w/o password
  //           updateAppProfile(userProfile); // pass to the upper lever (parent components so that it can be used for other pages)
  //           navigate('/modules');
  //         } else {
  //           console.log('invalid credentials');
  //         }
  //       })
  //       .catch(); // do error checking here if necessary
  //     setProfile(null);
  //     setPassword('');
  //   }
  // }, [profile]);

  const handleSubmit = (event) => {
    console.log('called');
    event.preventDefault(); // this prevents from page to be refreshing
    getUsers(username);
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">

          <br />
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <br />
        <label htmlFor="password">
          <br />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <label htmlFor="Submit">
          <br />
          <input type="submit" />
        </label>
        <br />
        <button type="button" onClick={signInWithGoogle}>Continue with Google</button>
      </form>
    </div>
  );
}

// props validation
Login.propTypes = {
  updateAppProfile: PropTypes.func.isRequired,
};

export default Login;
