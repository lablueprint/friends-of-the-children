/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { db } from './firebase';

function UserProfile({ profile, updateAppProfile }) {
  console.log(profile);
  const [editProfile, setEditProfile] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(profile);
  const [updateProfileMessage, setUpdateProfileMessage] = useState('');
  // db.collection('Profiles').get().then()

  function HandleClick() {
    setEditProfile(true);
    setUpdateProfileMessage('');
  }

  function HandleSubmit() {
    db.collection('profiles')
      .doc(profile.id)
      .update(updatedProfile)
      .then(() => {
        setUpdateProfileMessage('Profile Successfully Updated!');
        updateAppProfile(updatedProfile);
        setEditProfile(false);
      })
      .catch((error) => {
        setUpdateProfileMessage('We ran into an error updating your profile!');
        console.log(error);
      });
  }

  function HandleChange(event, field) {
    setUpdatedProfile((prevValue) => ({ ...prevValue, [field]: event.target.value }));
  }

  return (
    <div>
      {profile && profile.email && (
      <p>
        Email:
        {' '}
        <TextField
          id="email"
          label="Email"
          defaultValue={profile.email}
          value={updatedProfile.email}
          InputProps={{
            readOnly: !editProfile,
          }}
          onChange={(event) => HandleChange(event, 'email')}
          variant="filled"
        />
      </p>
      )}
      {profile && profile.firstName && (
      <p>
        First Name:
        {' '}
        <TextField
          id="firstName"
          label="First Name"
          defaultValue={profile.firstName}
          value={updatedProfile.firstName}
          InputProps={{
            readOnly: !editProfile,
          }}
          onChange={(event) => HandleChange(event, 'firstName')}
          variant="filled"
        />
      </p>
      )}
      {profile && profile.lastName && (
      <p>
        Last Name:
        {' '}
        <TextField
          id="lastName"
          label="Last Name"
          defaultValue={profile.lastName}
          value={updatedProfile.lastName}
          InputProps={{
            readOnly: !editProfile,
          }}
          onChange={(event) => HandleChange(event, 'lastName')}
          variant="filled"
        />
      </p>
      )}
      {profile && profile.role && (
      <p>
        Role:
        {' '}
        <TextField
          id="role"
          label="Role"
          defaultValue={profile.role}
          value={updatedProfile.role}
          InputProps={{
            readOnly: !editProfile,
          }}
          onChange={(event) => HandleChange(event, 'role')}
          variant="filled"
        />
      </p>
      )}
      {profile && profile.username && (
      <p>
        Username:
        {' '}
        <TextField
          id="username"
          label="Username"
          defaultValue={profile.username}
          value={updatedProfile.username}
          InputProps={{
            readOnly: !editProfile,
          }}
          onChange={(event) => HandleChange(event, 'username')}
          variant="filled"
        />
      </p>
      )}
      <button type="button" className="btn btn-info" onClick={HandleClick}> Edit Profile </button>
      {editProfile && <button type="button" className="btn btn-info" onClick={HandleSubmit}> Submit </button>}
      <p>{updateProfileMessage}</p>
    </div>
  );
}

UserProfile.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  updateAppProfile: PropTypes.func.isRequired,
};

export default UserProfile;