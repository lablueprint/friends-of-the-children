import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import PropTypes from 'prop-types';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import {
  TextField, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import styles from '../styles/Login.module.css';
import LoginFamily from '../assets/images/login_family.svg';
import UpperRight from '../assets/images/upperRight.svg';
import BottomLeft from '../assets/images/bottomLeft.svg';
import GoogleLogo from '../assets/images/google_logo.svg';
import * as api from '../api';

function Signup({ updateAppProfile }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [serviceArea, setServiceArea] = useState('AV');
  const [role, setRole] = useState('Caregiver');
  const [username, setUsername] = useState('');
  const [usernames, setUsernames] = useState();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userErrorMessage, setUserErrorMessage] = useState('');
  const [passErrorMessage, setPassErrorMessage] = useState('');
  const [confirmError, setConfirmError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [googleLoggedIn, setGoogleLoggedIn] = useState(false);
  const fieldHeight = '15px';

  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  function signUpWithGoogle() {
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
        setGoogleLoggedIn(true);
        setEmail(googleUser.email);
        setUsername(googleUser.displayName);
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

  const readProfiles = () => {
    const tempUsers = [];
    db.collection('profiles').get().then((sc) => {
      sc.forEach((doc) => {
        const data = doc.data();
        if (data && data.username) {
          tempUsers.push(data.username);
        }
      });
    });
    setUsernames(tempUsers);
  };

  useEffect(
    readProfiles,
    [],
  );

  const onSubmit = () => {
    let isValid = true;
    setConfirmError(false);
    setUsernameError(false);
    setUserErrorMessage('');
    setPassErrorMessage('');
    if (usernames.includes(username)) {
      setUsernameError(true);
      setUserErrorMessage('Username already exists!');
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
            };
            console.log('google not used - entered');
            db.collection('profiles').doc().set(data);
            updateAppProfile(data);

            // mailchimp- update list on signup
            const payload = {
              email_address: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              role: data.role,
              serviceArea: data.serviceArea,
            };
            api.addToList(payload);
            console.log('Google not used - Finished');
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
        };
        console.log('Google used - entered');
        db.collection('profiles').doc().set(data);
        updateAppProfile(data);

        // mailchimp- update list on signup
        const payload = {
          email_address: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          serviceArea: data.serviceArea,
        };
        api.addToList(payload);
        console.log('Google used - finished');
      }
      navigate('/modules');
      // reset forms
      setFirstName('');
      setLastName('');
      setEmail('');
      setServiceArea('AV');
      setRole('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const SigninForm = (
    <div className={styles.signinForm}>
      <h1 className={styles.bigtitle}>Sign Up</h1>
      <p>Please identify your role</p>
      <form onSubmit={(event) => { onSubmit(); event.preventDefault(); }} id="signinform">
        <FormControl sx={{ width: '60%' }}>
          <InputLabel>Role</InputLabel>
          <Select
            id="role"
            label="Role"
            defaultValue="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={styles.textfield}
          >
            <MenuItem value="Caregiver">Caregiver</MenuItem>
            <MenuItem value="Mentor">Mentor</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <p>Enter your information</p>
        <div>
          <TextField
            id="firstName"
            label="First Name"
            defaultValue="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className={`${styles.textfield} ${styles.half_width}`}
            inputProps={{
              style: {
                height: fieldHeight,
              },
            }}
          />
          <TextField
            id="lastName"
            label="Last Name"
            defaultValue="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className={`${styles.textfield} ${styles.half_width}`}
            inputProps={{
              style: {
                height: fieldHeight,
              },
            }}
          />
        </div>
        <div>
          {!googleLoggedIn
            ? (
              <TextField
                id="email"
                label="Email"
                type="email"
                defaultValue="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`${styles.textfield} ${styles.half_width}`}
                inputProps={{
                  style: {
                    height: fieldHeight,
                  },
                }}
              />
            )
            : <p />}
          <TextField
            id="username"
            label="Username"
            defaultValue="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={usernameError}
            helperText={userErrorMessage}
            required
            className={`${styles.textfield} ${styles.half_width}`}
            inputProps={{
              style: {
                height: fieldHeight,
              },
            }}
          />
        </div>
        {!googleLoggedIn
          ? (
            <div>
              <TextField
                id="password"
                label="Password"
                defaultValue="Enter your password"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`${styles.textfield} ${styles.half_width}`}
                inputProps={{
                  style: {
                    height: fieldHeight,
                  },
                }}
              />
              <TextField
                id="confirmPassword"
                label="Confirm Password"
                defaultValue="Confirm your password"
                value={confirmPassword}
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmError}
                helperText={passErrorMessage}
                required
                className={`${styles.textfield} ${styles.half_width}`}
                inputProps={{
                  style: {
                    height: fieldHeight,
                  },
                }}
              />
            </div>
          )
          : <p />}
        <div>
          <FormControl sx={{ width: '60%' }}>
            <InputLabel>Service Area</InputLabel>
            <Select
              id="serviceArea"
              label="Service Area"
              defaultValue="AV"
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              className={styles.textfield}
            >
              <MenuItem value="AV">AV</MenuItem>
              <MenuItem value="MS">MS</MenuItem>
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
  );

  return (
    <div>
      <img src={UpperRight} alt="upper right design" className={styles.design_top} />
      <div className={styles.container}>
        <div className={styles.left_column}>
          <img src={LoginFamily} alt="fotc family" className={styles.family_img} />
          <p>
            Already have an account?
            {' '}
            <a href="/login"><b>Log in</b></a>
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
