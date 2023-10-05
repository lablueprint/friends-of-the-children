import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import PropTypes from 'prop-types';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import {
  TextField, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup';
import { app, db } from './firebase';
import styles from '../styles/Login.module.css';
import LoginFamily from '../assets/images/login_family.svg';
import UpperRight from '../assets/images/upperRight.svg';
import BottomLeft from '../assets/images/bottomLeft.svg';
import GoogleLogo from '../assets/images/google_logo.svg';
import * as api from '../api';
import { serviceAreas } from '../constants';

/**
 Page used to create a new account for new users

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

// eslint-disable-next-line no-unused-vars
function Signup({ updateAppProfile }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [serviceArea, setServiceArea] = useState(serviceAreas[0]);
  const [role, setRole] = useState('Caregiver');
  const [username, setUsername] = useState('');
  const [emails, setEmails] = useState();
  const [usernames, setUsernames] = useState(); // specifically for reducing firebase calls, saving all usernames
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userErrorMessage, setUserErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passErrorMessage, setPassErrorMessage] = useState('');
  const [confirmError, setConfirmError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [googleLoggedIn, setGoogleLoggedIn] = useState(false);
  const [googleError, setGoogleError] = useState(false);
  const [googErrorCode, setGoogleErrorCode] = useState(false);
  const [googErrorMessage, setGoogleErrorMessage] = useState('');
  const fieldHeight = '15px';

  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  // API call to reduce Firebase calls, saving all usernames to userUsernames state (array)
  const fetchData = async () => {
    const data = await api.getUsernames();
    setUsernames(data.data.usernames);
    setEmails(data.data.emails);
  };

  useEffect(() => {
    fetchData().catch(console.error);
  }, []);

  // Allows users to use their Google account (email, password) to create account
  function signUpWithGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const { user: googleUser } = result;
        setGoogleLoggedIn(true);
        setEmail(googleUser.email);
        setUsername(googleUser.displayName); // TODO: this is wrong because their display name is not their username
        // TODO: is there any way for us to get their display name's first and last name separately?

        // TODO: also, it would be nice to have a "back" button or something, since it gets rid of all the other fields
        // that aren't necessary bc u have a google account. but maybe the user can change their minds or something, then if so,
        // it's a bit confusing what to do from there
      }).catch((error) => {
      // Handle Errors here.
        setGoogleError(true);
        setGoogleErrorCode(error.code);
        setGoogleErrorMessage(error.message);

        console.error(error.code);
        console.error(error.message);
      });
  }

  // Catching errors, saving account info, adding to mailchimp list, resetting forms
  const onSubmit = () => {
    let isValid = true;
    setConfirmError(false);
    setUsernameError(false);
    setUserErrorMessage('');
    setEmailError(false);
    setEmailErrorMessage('');
    setPassErrorMessage('');
    if (usernames.includes(username)) {
      setUsernameError(true);
      setUserErrorMessage('Username already exists!');
      isValid = false;
    }
    if (emails.includes(email)) {
      setEmailError(true);
      setEmailErrorMessage('Email already exists!');
      isValid = false;
    }
    if (password !== confirmPassword) {
      setConfirmError(true);
      setPassErrorMessage('Passwords don\'t match!');
      isValid = false;
    }
    if (isValid) {
      if (!googleLoggedIn) {
        bcrypt.hash(password, 10) // asychronous hashing function
          .then((hashedPassword) => {
            const data = {
              firstName,
              lastName,
              email,
              serviceArea,
              role,
              username,
              password: hashedPassword,
              google: false,
              image: 'https://i.pinimg.com/550x/18/b9/ff/18b9ffb2a8a791d50213a9d595c4dd52.jpg',
              approved: false,
              date: app.firebase.firestore.Timestamp.fromDate(new Date()),
              mentees: [],
              bio: '',
            };
            db.collection('profiles').doc().set(data);
            navigate('/unapproved');
          });
      } else {
        const data = {
          firstName,
          lastName,
          email,
          serviceArea,
          role,
          username,
          google: true,
          image: 'https://i.pinimg.com/550x/18/b9/ff/18b9ffb2a8a791d50213a9d595c4dd52.jpg',
          approved: false,
          date: app.firebase.firestore.Timestamp.fromDate(new Date()),
          mentees: [],
          bio: '',
        };
        db.collection('profiles').doc().set(data);
        navigate('/unapproved');
      }
      // reset forms
      setFirstName('');
      setLastName('');
      setEmail('');
      setServiceArea(serviceAreas[0]);
      setRole('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  // helper functions (using regex) for formatting strings
  const lowerCase = (str) => str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => (word.toLowerCase()));
  const camelCase = (str) => str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase())).replace(/\s+/g, '');

  // helper function to create TextFields with less repetitive code.
  // label is name of TextField, foo and setFoo are the useState hooks for the local variables.
  // type, error, helperText, and defaultValue are all optional parameters if the TextField wants to overwrite them.
  const createTextField = (label, foo, setFoo, type = 'text', error = false, helperText = '', defaultValue = '') => (
    <TextField
      id={camelCase(label)}
      label={label}
      type={type}
      defaultValue={defaultValue === '' ? `Enter your ${lowerCase(label)}` : defaultValue}
      value={foo}
      onChange={(e) => setFoo(e.target.value)}
      error={error}
      helperText={helperText}
      className={`${styles.textfield} ${styles.half_width}`}
      required
      inputProps={{
        style: {
          height: fieldHeight,
        },
      }}
    />
  );

  // Actual input fields for signing up (UI)
  const SigninForm = (
    <div className={styles.signinForm}>
      <div className={styles.test}>
        <h1 className={styles.bigtitle}>Sign Up</h1>
        <p>Please identify your role</p>
        <form onSubmit={(event) => { onSubmit(); event.preventDefault(); }} id="signinform">
          <div className={styles.roleContainer}>
            <button
              type="button"
              className={`${styles.roleButton} ${role === 'Caregiver' ? styles.active : ''}`}
              onClick={() => setRole('Caregiver')}
            >
              Caregiver
            </button>
            <button
              type="button"
              className={`${styles.roleButton} ${role === 'Mentor' ? styles.active : ''}`}
              onClick={() => setRole('Mentor')}
            >
              Mentor
            </button>
            <button
              type="button"
              className={`${styles.roleButton} ${role === 'Admin' ? styles.active : ''}`}
              onClick={() => setRole('Admin')}
            >
              Admin
            </button>
          </div>

          <p>Enter your information</p>
          <div>
            {createTextField('First Name', firstName, setFirstName)}
            {createTextField('Last Name', lastName, setLastName)}
          </div>
          <div>
            <div className={styles.username}>
              {googleLoggedIn
                ? <p />
                : createTextField('Email', email, setEmail, 'email', emailError, emailErrorMessage)}
            </div>
            <div className={styles.username2}>
              {createTextField('Username', username, setUsername, 'text', usernameError, userErrorMessage)}
            </div>
          </div>
          {googleLoggedIn
            ? <p />
            : (
              <div>
                {createTextField('Password', password, setPassword, 'password')}
                {createTextField('Confirm Password', confirmPassword, setConfirmPassword, 'password', confirmError, passErrorMessage, 'Confirm your password')}
              </div>
            )}
          <div>
            <FormControl sx={{ width: '60%' }}>
              <InputLabel>Service Area</InputLabel>
              <Select
                id="serviceArea"
                label="Service Area"
                defaultValue={serviceAreas[0]}
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                className={styles.textfield}
              >
                {serviceAreas.map((area) => <MenuItem value={area}>{area}</MenuItem>)}
              </Select>
            </FormControl>
          </div>

          <div className={styles.full_width}>
            <label htmlFor="Submit" className={styles.button_width}>
              <br />
              <input className={styles.signup_button} type="submit" value="Sign Up" />
            </label>

            {!googleLoggedIn
              ? (
                <div>
                  <div className={styles.or}>
                    <div className={styles.line} />
                    <p>or</p>
                    <div className={styles.line} />
                  </div>
                  <button type="submit" onClick={signUpWithGoogle} className={`${styles.button_width} ${styles.google_button}`}>
                    <img src={GoogleLogo} alt="google logo" className={styles.google_logo} />
                    Sign Up With Google
                  </button>
                </div>
              )
              : <p />}
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div>
      {(() => {
        // if (usernameError) return <Popup errorTitle="Signup" errorCode={userErrorMessage} />;
        if (confirmError) return <Popup errorTitle="Signup" errorCode={passErrorMessage} />;
        if (googleError) return <Popup errorTitle="Signup" errorCode={googErrorCode.concat(' ', googErrorMessage)} />;
        return null;
      })()}
      <img src={UpperRight} alt="upper right design" className={styles.design_top} />
      <div className={styles.container}>
        <div className={styles.left_column}>
          <img src={LoginFamily} alt="fotc family" className={styles.family_img} />
          <p className={styles.login_text}>
            Already have an account?
            {' '}
            <a href="/login" style={{ color: '#3F3F3F' }}><b>Click Here to Login</b></a>
          </p>
        </div>
        {SigninForm}
      </div>
      <img src={BottomLeft} alt="bottom left design" className={styles.design_bottom} />
    </div>

  );
}

// props validation
Signup.propTypes = {
  updateAppProfile: PropTypes.func.isRequired,
};

export default Signup;
