import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db } from './firebase';

function Signup() {
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

  // const hashPassword = (pass) => { // hash does not work, useState error probably
  //   const salt = '';
  //   bcrypt.hash(pass, salt, (err, hash) => {
  //     if (err) {
  //       setErrorMessage('Invalid Hash');
  //     }
  //     console.log('hashing');
  //     setPassword(hash);
  //   });
  // };

  const onSubmit = () => {
    if (password !== confirmPassword) {
      setErrorMessage(errorMessage, 'Passwords must match!');
    }
    // hashPassword(password);
    // console.log(password);
    // console.log('submitted');

    // console.log(data);
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
          };
          db.collection('profiles').doc().set(data);
        });
    } else {
      const data = {
        firstName,
        lastName,
        email,
        serviceArea,
        role,
        username,
      };
      db.collection('profiles').doc().set(data);
    }

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
          First name:
          <input type="text" name="FirstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </label>
        <label htmlFor="LastName">
          <br />
          Last name:
          <input type="text" name="LastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </label>
        <label htmlFor="Email">
          <br />
          Email:
          <input type="email" name="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label htmlFor="ServiceArea">
          <br />
          ServiceArea:
          <input type="text" name="ServiceArea" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} required />
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
          Username:
          <input type="text" name="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>

        {!googleLoggedIn
          ? (
            <>
              <label htmlFor="Password">
                <br />
                Password:
                <input type="password" name="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </label>
              <label htmlFor="ConfirmPassword">
                <br />
                Confirm Password:
                <input type="password" name="ConfirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
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

export default Signup;
