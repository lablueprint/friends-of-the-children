import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
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

  const hashPassword = () => { // hash does not work, useState error probably
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        setErrorMessage('Invalid Hash');
      }
      setPassword(hash);
    });
  };
  const onSubmit = () => {
    if (password !== confirmPassword) {
      setErrorMessage(errorMessage, 'Passwords must match!');
    }
    hashPassword();
    console.log(password);
    console.log('submitted');
    const data = {
      firstName,
      lastName,
      email,
      serviceArea,
      role,
      username,
      password,
    };
    console.log(db);
    db.collection('profiles').doc().set(data);
    setFirstName('');
    setLastName('');
    setEmail('');
    setServiceArea('');
    setRole('Caregiver');
    setUsername('');
    setPassword('');
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
        <label htmlFor="Password">
          <br />
          Password:
          <input type="text" name="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label htmlFor="ConfirmPassword">
          <br />
          Confirm Password:
          <input type="text" name="ConfirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </label>
        <br />
        <input type="submit" value="Submit" onClick={onSubmit} />
      </div>
    </form>

  );

  return (
    <div>
      { SigninForm }
    </div>

  );
}

export default Signup;
