import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import PropTypes from 'prop-types';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';
import { db } from './firebase';

function Signup({ updateAppProfile }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [role, setRole] = useState('Caregiver');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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

  const onSubmit = () => {
    console.log('entered first');
    if (password !== confirmPassword) {
      setErrorMessage(errorMessage, 'Passwords must match!');
    }
    console.log('Entered here');

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
    setServiceArea('');
    setRole('Caregiver');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const SigninForm = (
    <form id="signinform">
      <div>
        <label htmlFor="FirstName">
          <br />
          <input type="text" name="FirstName" value={firstName} placeholder="Enter your first name" onChange={(e) => setFirstName(e.target.value)} required />
        </label>
        <label htmlFor="LastName">
          <br />
          <input type="text" name="LastName" value={lastName} placeholder="Enter your last name" onChange={(e) => setLastName(e.target.value)} required />
        </label>
        <label htmlFor="ServiceArea">
          <br />
          <input type="text" name="ServiceArea" value={serviceArea} placeholder="Enter Service Area" onChange={(e) => setServiceArea(e.target.value)} required />
        </label>
        <label htmlFor="Role">
          <br />
          Choose a role:
          <select name="Role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Caregiver">Caregiver</option>
            <option value="Mentor">Mentor</option>
          </select>
        </label>
        <label htmlFor="Username">
          <br />

          <input type="text" name="Username" value={username} placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} required />
        </label>

        {!googleLoggedIn
          ? (
            <>
              <label htmlFor="Password">
                <br />
                <input type="password" name="Password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </label>
              <label htmlFor="ConfirmPassword">
                <br />
                <input type="password" name="ConfirmPassword" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </label>
              <label htmlFor="Email">
                <br />
                <input type="email" name="Email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <br />
            </>
          )
          : <p />}

        <button type="button" onClick={onSubmit}>Submit</button>
        {!googleLoggedIn
          ? (
            <button type="button" onClick={signUpWithGoogle}>Google Auth</button>
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
