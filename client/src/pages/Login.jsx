import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import bcrypt from 'bcryptjs';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import {
  TextField, Snackbar,
} from '@mui/material';
import * as api from '../api';
import styles from '../styles/Login.module.css';
import LoginFamily from '../assets/images/login_family.svg';
import GoogleLogo from '../assets/images/google_logo.svg';
import UpperLeft from '../assets/images/upperLeft.svg';
import BottomRight from '../assets/images/bottomRight.svg';
import { login } from '../redux/sliceAuth';

/**
 Page used to log into the app

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
  const [profile, setProfile] = useState(null); // object holding current user's profile content
  const [allProfiles, setAllProfiles] = useState(null); // array holding all user profiles objects from Firebase

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // Checking if inputted password matches profile's password from Firebase
  // Called whenever inputted profile info gets updated or when user's existing profile is updated
  const checkPassword = () => {
    // Check the hash password only if profile is not empty
    if (profile) {
      if (!profile.google) {
        bcrypt.compare(password, profile.password) // compare passwords
          .then((isValid) => {
            if (isValid) { // check whether it is a valid credential
              dispatch(login(profile)); // pass in profile to redux
              updateAppProfile(profile); // pass to the upper lever (parent components so that it can be used for other pages)
              navigate('/');
              setError(false);
            } else {
              setError(true);
              console.error('invalid credentials'); // TODO: is this needed? technically we have a message that pops up in the UI
            }
          })
          // Handle Errors here
          .catch((e) => {
            console.error(e);
            setError(true);
          });
      } else {
        dispatch(login(profile));
        updateAppProfile(profile); // pass to the upper lever (parent components so that it can be used for other pages)
      }
    }
  };

  // Checking inputted username with all the usernames in database (stored in userProfiles array)
  const checkUsers = (usernameSearch) => {
    console.log(allProfiles);
    const tempUserMatch = allProfiles ? allProfiles.filter((p) => p.username === usernameSearch) : []; // array of objects with matching usernames
    if (tempUserMatch.length === 0) { // no matching username
      setError(true);
    } else {
      const data = tempUserMatch[0];
      data.id = tempUserMatch[0].id;
      setProfile(data); // updating current profile
      checkPassword();
    }
  };

  const fetchData = async () => {
    const data = await api.getAllProfiles();
    setAllProfiles(data.data);
  };

  useEffect(() => {
    checkPassword();
  }, [profile]);

  useEffect(() => {
    // saving all the user profiles from Firebase in an array (useProfiles) only on first load
    fetchData().catch(console.error);
  }, []);

  // Sets profile state with inputted profile info
  // Called when user clicks "Login" button or presses Enter after inputting username + password
  const handleSubmit = async (event) => {
    event.preventDefault(); // this prevents from page to be refreshing
    checkUsers(username);
    // checkPassword(password);
  };

  const provider = new GoogleAuthProvider();

  // Allows users to sign in with Google
  function signInWithGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // The signed-in user info.
        const { user: googleUser } = result;

        const account = await api.getGoogleaccount(googleUser.email);
        setProfile(account.data);
      }).catch((e) => {
      // Handle Errors here.
        const errorCode = e.code;
        console.error(errorCode);

        const googleErrorMessage = e.message;
        console.error(googleErrorMessage);
        setError(true);
      });
  }

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
          <form className={styles.login_form} onSubmit={handleSubmit}>
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
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={error}
              autoHideDuration={1500}
              onClose={() => setError(false)}
              message={'Your username or password is incorrect.'}
            />
            <div className={styles.full_width}>
              <label className={styles.button_width} htmlFor="Submit">
                <br />
                <input className={styles.signup_button} type="submit" value="Login" />
              </label>
              <div className={styles.or}>
                <div className={styles.line} />
                <p>or</p>
                <div className={styles.line} />
              </div>
              <button type="button" onClick={signInWithGoogle} className={`${styles.button_width} ${styles.google_button}`}>
                <img src={GoogleLogo} alt="google logo" className={styles.google_logo} />
                Sign In with Google
              </button>
              <p style={{ textAlign: 'center' }}>
                {'Don\'t have an account?'}
                {' '}
                <a href="/signup" style={{ color: 'black' }}><b>Sign Up</b></a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <img src={BottomRight} alt="bottom right design" className={styles.design_bottom2} />
    </div>
  );
}

// Props validation
Login.propTypes = {
  updateAppProfile: PropTypes.func.isRequired,
};

export default Login;
