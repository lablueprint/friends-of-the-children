import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import PropTypes from 'prop-types';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import {
  TextField, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { db } from './firebase';

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
    <form onSubmit={(event) => { onSubmit(); event.preventDefault(); }} id="signinform">
      <div>
        <br />
        <TextField
          id="firstName"
          label="First Name"
          defaultValue="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          variant="filled"
        />
        &nbsp;
        <TextField
          id="lastName"
          label="Last Name"
          defaultValue="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          variant="filled"
        />
        &nbsp;
        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel>Service Area</InputLabel>
          <Select
            id="serviceArea"
            label="Service Area"
            defaultValue="AV"
            value={serviceArea}
            onChange={(e) => setServiceArea(e.target.value)}
            variant="filled"
          >
            <MenuItem value="AV">AV</MenuItem>
            <MenuItem value="MS">MS</MenuItem>
          </Select>
        </FormControl>
        &nbsp;
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Role</InputLabel>
          <Select
            id="role"
            label="Role"
            defaultValue="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            variant="filled"
          >
            <MenuItem value="Caregiver">Caregiver</MenuItem>
            <MenuItem value="Mentor">Mentor</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>
        </FormControl>
        &nbsp;
        <br />
        <br />
        <TextField
          id="username"
          label="Username"
          defaultValue="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={usernameError}
          helperText={userErrorMessage}
          required
          variant="filled"
        />
        &nbsp;
        {!googleLoggedIn
          ? (
            <>
              <TextField
                id="password"
                label="Password"
                defaultValue="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="filled"
              />
              &nbsp;
              <TextField
                id="confirmPassword"
                label="Confirm Password"
                defaultValue="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmError}
                helperText={passErrorMessage}
                required
                variant="filled"
              />
              &nbsp;
              <TextField
                id="email"
                label="Email"
                type="email"
                defaultValue="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="filled"
              />
              <br />
            </>
          )
          : <p />}

        <label htmlFor="Submit">
          <br />
          <input type="submit" value="Sign Up" />
        </label>

        {!googleLoggedIn
          ? (
            <button type="submit" onClick={signUpWithGoogle}>Google Auth</button>
          )
          : <p />}
      </div>
    </form>
  );

  return (
    <div>
      {SigninForm}
    </div>

  );
}

// props validation
Signup.propTypes = {
  updateAppProfile: PropTypes.func.isRequired,
};

export default Signup;
