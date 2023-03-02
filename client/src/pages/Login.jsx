import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import bcrypt from 'bcryptjs';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import * as api from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/sliceAuth';
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

function Login({ updateAppProfile }) { // deconstruct the function props
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [userProfiles, setUserProfiles] = useState(null);
  const [profile, setProfile] = useState(null);
  // const [email, setEmail] = useState('');
  // const [userIsGoogleLoggedIn, setuserIsGoogleLoggedIn] = useState(false);

  const navigate = useNavigate();
  // const profile = useRef();

  const { user: currUser, isLoggedIn } = useSelector((state) => state.sliceAuth);
  console.log(currUser);
  console.log(isLoggedIn);
  const dispatch = useDispatch();

  const checkPassword = () => {
    // check the hash password only if profile is not empty
    if (profile !== null) {
      console.log("this is profile", profile)
      console.log(true);
      console.log(profile);
      if (!profile.google) {
        bcrypt.compare(password, profile.password) // compare passwords
          .then((isValid) => {
            if (isValid) { // check whether it is a valid credential
              console.log('login successful');
              dispatch(login(profile));
              updateAppProfile(profile); // pass to the upper lever (parent components so that it can be used for other pages)
            } else {
              setError(true);
              console.log('invalid credentials');
            }
          })
          .catch((e) => {
            console.log(e);
          }); // do error checking here if necessary
      } else {
        dispatch(login(profile));
        updateAppProfile(profile); // pass to the upper lever (parent components so that it can be used for other pages)
      }
    }
  };

  useEffect(() => {
    checkPassword();
  }, [profile, navigate, updateAppProfile]);

  const provider = new GoogleAuthProvider();

  function signInWithGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(async (result) => {
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
        const account = await api.getGoogleaccount(googleUser.email);
        setProfile(account.data);
        // setUsername(googleUser.displayName);
      // ...
      }).catch((e) => {
      // Handle Errors here.
        const errorCode = e.code;
        console.log(errorCode);

        const googleErrorMessage = e.message;
        console.log(googleErrorMessage);

        // The email of the user's account used.
        // const { email } = error.customData;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      });
  }

  const handleSubmit = async (event) => {
    console.log('called');
    event.preventDefault(); // this prevents from page to be refreshing
    const data = await api.getUsers(username);
    
    setProfile(data.data);
    // setUsername('');
    // setPassword('');
  };

  if (isLoggedIn) {
    return navigate('/modules');
  }

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
        {error ? <div>Your username or password is incorrect.</div> : <div />}
        <label htmlFor="Submit">
          <br />
          <input type="submit" value="Log In" />
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
