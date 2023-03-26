import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import bcrypt from 'bcryptjs';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
} from '@mui/material';
import * as api from '../api';
import styles from '../styles/Login.module.css';
import LoginFamily from '../assets/images/login_family.svg';
import GoogleLogo from '../assets/images/google_logo.svg';
import UpperLeft from '../assets/images/upperLeft.svg';
import BottomRight from '../assets/images/bottomRight.svg';
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
  // const [userProfiles, setUserProfiles] = useState(null);
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
      console.log('this is profile', profile);
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

  // if on /login, navigates to /modules once user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/modules');
    }
  }, []);

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
    if (data) { setProfile(data.data); }
    // setUsername('');
    // setPassword('');
  };

  // useEffect(() => {
  //   navigate('/modules');
  // }, [updateAppProfile]);

  return (
    <div>
      <img src={UpperLeft} alt="upper left design" className={styles.design_top2} />
      <div className={styles.container}>
        <div className={styles.left_column}>
          <img src={LoginFamily} alt="fotc family" className={styles.family_img} />
        </div>
        <div className={styles.signinForm}>
          <h1 className={styles.bigtitle}>
            Login
          </h1>
          <p>Welcome back! Enter in details</p>
          <form onSubmit={handleSubmit}>
            <TextField
              id="username"
              label="Username"
              defaultValue="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className={`${styles.textfield} ${styles.full_width}`}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              defaultValue="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className={`${styles.textfield} ${styles.full_width}`}
            />
            {error ? <div>Your username or password is incorrect.</div> : <div />}
            <div className={styles.full_width}>
              <label className={styles.button_width} htmlFor="Submit">
                <br />
                <input className={styles.signup_button} type="submit" value="Log In" />
              </label>
              <div className={styles.or}>
                <div className={styles.line} />
                <p>or</p>
                <div className={styles.line} />
              </div>
              <button type="button" onClick={signInWithGoogle} className={`${styles.button_width} ${styles.google_button}`}>
                <img src={GoogleLogo} alt="google logo" className={styles.google_logo} />
                Continue with Google
              </button>
              <p style={{ textAlign: 'center' }}>
                {'Don\'t have an account?'}
                {' '}
                <a href="/signup"><b>Sign Up</b></a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <img src={BottomRight} alt="bottom right design" className={styles.design_bottom2} />
    </div>
  );
}

// props validation
Login.propTypes = {
  updateAppProfile: PropTypes.func.isRequired,
};

export default Login;
