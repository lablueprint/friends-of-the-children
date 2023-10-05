/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Snackbar, TextField, InputAdornment, IconButton,
} from '@mui/material';
// import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import bcrypt from 'bcryptjs';
import styles from '../styles/UserProfile.module.css';
import { db, storage } from './firebase';
import * as api from '../api';
import UserIcon from '../assets/icons/user_icon.svg';
import LocationIcon from '../assets/icons/location_icon.svg';

// Allows users to see and change their profile properties
function UserProfile({ profile, updateAppProfile }) {
  const [editProfile, setEditProfile] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [updateProfileMessage, setUpdateProfileMessage] = useState(true);
  const [imageUrl, setImageUrl] = useState(profile.image);
  const [updatedProfile, setUpdatedProfile] = useState({ // same as profile
    ...profile,
  });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newPasswordAllowed, setNewPasswordAllowed] = useState(false);
  const handleUpload = async (image) => {
    // const imageName = uuidv4(image.name);
    const imageName = image.name;
    const storageRef = ref(storage, `/images/${imageName}`);

    uploadBytes(storageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (url) => {
        setImageUrl(url);
        const docRef = doc(db, 'profiles', profile.id);
        await updateDoc(docRef, {
          image: url,
        });
        const newProfile = {
          ...profile,
          image: url,
        };
        updateAppProfile(newProfile);
        await api.updateProfile(profile.id, newProfile);
        setUpdatedProfile({
          ...profile,
          image: url,
        });
      });
    });
  };

  function HandleClick() {
    setEditProfile(true);
  }

  function HandleCancel() {
    setEditProfile(false);
    setUpdatedProfile(profile);
    setOldPassword('');
    setNewPassword('');
    setNewPasswordAllowed(false);
  }

  async function HandleSubmit() {
    let currPassword = profile.password;
    // create a new hash for the new password
    if (newPassword !== '' && newPassword !== oldPassword) {
      currPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(updatedProfile.password, 10, (err, hash) => {
          if (err) reject(err);
          resolve(hash);
          updatedProfile.password = hash;
          setUpdatedProfile({
            ...profile,
            password: hash,
          });
        });
      });
    }

    // update profile in database
    api.updateProfile(profile.id, updatedProfile).then(() => {
      const payload = {
        currentEmail: profile.email,
        newEmail: updatedProfile.email,
        serviceArea: updatedProfile.serviceArea,
        role: updatedProfile.role,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        bio: updatedProfile.bio,
        password: currPassword,
      };
      // update mailchimp mailing list
      api.updateList(payload);
      // show snackbar message
      setUpdateProfileMessage('Profile Successfully Updated!');
      setOpenMessage(true);
      // update redux profile state
      updateAppProfile(updatedProfile);
      // fetch new profile
      api.getProfile(profile.id).then((res) => {
        setUpdatedProfile(res.data);
        setEditProfile(false);
        setOldPassword('');
        setNewPassword('');
        setNewPasswordAllowed(false);
      });
    })
      .catch((error) => {
        setUpdateProfileMessage('We ran into an error updating your profile!');
        setOpenMessage(true);
        console.error(error);
      });
  }

  function HandleChange(event, field) {
    setUpdatedProfile((prevValue) => ({ ...prevValue, [field]: event.target.value }));
  }

  const uploadImage = (e) => {
    handleUpload(e.target.files[0]);
  };

  // Fxs for password visibility toggling
  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };
  const handleMouseDownOldPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  // Checking if inputted password matches profile's password from Firebase
  // Called whenever inputted profile info gets updated or when user's existing profile is updated
  const oldPasswordReference = profile.password; // original password from db
  const checkPassword = (pass) => {
    // Check the hash password only if profile is not empty
    if (!profile.google) {
      bcrypt.compare(pass, oldPasswordReference) // compare passwords
        .then((isValid) => {
          if (isValid) {
            setNewPasswordAllowed(true);
            return;
          }
          console.error(`${pass} doesn't match ${oldPasswordReference}`);
        })
        .catch((e) => {
          console.error(e);
        });
    }
    setNewPasswordAllowed(false);
  };

  // Can only edit new password if old password matches
  const handleOldPasswordChange = (event) => {
    event.preventDefault();
    setOldPassword(event.target.value);
    checkPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value); // update state var for onscreen rendering
    HandleChange(event, 'password'); // call fx to update in airtable
  };

  return (
    <div className={styles.profile_page}>
      <div className={styles.profile_flex}>
        <div>
          <div className={styles.pfp}>
            <img src={imageUrl} alt="profile pic" className={styles.profile_pic} />
            <label htmlFor={uploadImage} className={styles.custom_file_upload}>
              <input type="file" accept=".png,.jpg,.svg,.gif" onChange={uploadImage} />
            </label>
          </div>
          <div className={styles.profile_heading}>
            <h2>{`${profile.firstName} ${profile.lastName}`}</h2>
            <div className={styles.icon_flex}>
              <div className={styles.icon_wrap}>
                <img src={UserIcon} alt="profile icon" className={styles.icon} />
                <p>{profile.role}</p>
              </div>
              <div className={styles.icon_wrap}>
                <img src={LocationIcon} alt="location icon" className={styles.icon} />
                <p>{profile.serviceArea}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.edit_container}>
          {!editProfile && <button type="button" className={styles.edit_button} onClick={HandleClick}> Edit Profile </button>}
          {editProfile
          && (
          <div>
            <button type="button" className={styles.edit_button} onClick={HandleCancel}> Cancel </button>
            <button type="button" className={styles.save_button} onClick={HandleSubmit}> Save Profile </button>
          </div>
          )}
        </div>
      </div>
      <div className={styles.info_flex}>
        <div className={styles.info_flex_left}>
          <h4 className={styles.info_label}>Basic Information</h4>
          {profile && profile.firstName && (
          <div className={styles.labels_container}>
            {!editProfile && <p>First Name:</p>}
            <TextField
              sx={{
                fieldset: { borderColor: editProfile ? '#156DBF !important' : 'transparent !important' },
              }}
              disabled={!editProfile}
              label={editProfile ? 'First Name' : ''}
              id="firstName"
              className={!editProfile ? styles.label : styles.label2}
              value={updatedProfile.firstName}
              InputProps={{
                readOnly: !editProfile,
              }}
              onChange={(event) => HandleChange(event, 'firstName')}
            />
          </div>
          )}
          {profile && profile.lastName && (
          <div className={styles.labels_container}>
            {!editProfile && <p>Last Name:</p>}
            <TextField
              sx={{
                fieldset: { borderColor: editProfile ? '#156DBF !important' : 'transparent !important' },
              }}
              disabled={!editProfile}
              label={editProfile ? 'Last Name' : ''}
              id="lastName"
              className={!editProfile ? styles.label : styles.label2}
              value={updatedProfile.lastName}
              InputProps={{
                readOnly: !editProfile,
              }}
              onChange={(event) => HandleChange(event, 'lastName')}
            />
          </div>
          )}
          {profile && profile.email && (
          <div className={styles.labels_container}>
            {!editProfile && <p>Email:</p>}
            <TextField
              sx={{
                fieldset: { borderColor: editProfile ? '#156DBF !important' : 'transparent !important' },
              }}
              disabled={!editProfile}
              label={editProfile ? 'Email' : ''}
              id="email"
              className={!editProfile ? styles.label : styles.label2}
              value={updatedProfile.email}
              InputProps={{
                readOnly: !editProfile,
              }}
              onChange={(event) => HandleChange(event, 'email')}
            />
          </div>
          )}

          <h4 className={styles.info_label}>Login Information</h4>
          {profile && profile.username && (
          <div className={styles.labels_container}>
            {!editProfile && <p>Username:</p>}
            <TextField
              sx={{
                fieldset: { borderColor: editProfile ? '#156DBF !important' : 'transparent !important' },
              }}
              disabled={!editProfile}
              label={editProfile ? 'Username' : ''}
              id="username"
              className={!editProfile ? styles.label : styles.label2}
              value={updatedProfile.username}
              InputProps={{
                readOnly: !editProfile,
              }}
              onChange={(event) => HandleChange(event, 'username')}
            />
          </div>
          )}
          {/* Password start, old + new passwords only shows when editing */}
          {profile && editProfile && (
          <div>
            <p>Change Password: </p>
            <div className={styles.labels_container}>
              <TextField
                sx={{
                  fieldset: { borderColor: editProfile ? '#156DBF !important' : 'transparent !important' },
                }}
                disabled={!editProfile || newPasswordAllowed}
                label="Verify your old Password"
                id="password"
                className={!editProfile ? styles.label : styles.label2}
                value={oldPassword}
                InputProps={{
                  readOnly: !editProfile,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowOldPassword}
                        onMouseDown={handleMouseDownOldPassword}
                        edge="end"
                      >
                        {showOldPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={showOldPassword ? 'text' : 'password'}
                onChange={(event) => handleOldPasswordChange(event)}
              />
            </div>
            <div className={styles.labels_container}>
              { /* New password */ }
              <TextField
                sx={{
                  fieldset: { borderColor: editProfile ? '#156DBF !important' : 'transparent !important' },
                }}
                disabled={!newPasswordAllowed}
                label="New Password"
                id="password"
                className={!editProfile ? styles.label : styles.label2}
                value={newPassword}
                InputProps={{
                  readOnly: !editProfile,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowNewPassword}
                        onMouseDown={handleMouseDownNewPassword}
                        edge="end"
                      >
                        {showNewPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={showNewPassword ? 'text' : 'password'}
                onChange={(event) => handleNewPasswordChange(event)}
              />
            </div>
          </div>
          )}
        </div>
        {profile && (
        <div className={styles.info_container_right}>
          <h4 className={styles.info_label}>Bio</h4>
          <div className={styles.labels_container}>
            <TextField
              sx={{
                fieldset: { borderColor: editProfile ? '#156DBF !important' : 'transparent !important' },
              }}
              disabled={!editProfile}
              label={editProfile ? 'Bio' : ''}
              id="bio"
              className={!editProfile ? styles.label : styles.label2}
              value={updatedProfile.bio}
              InputProps={{
                readOnly: !editProfile,
              }}
              onChange={(event) => HandleChange(event, 'bio')}
            />
          </div>
        </div>
        )}
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openMessage}
        autoHideDuration={1500}
        onClose={() => setOpenMessage(false)}
        message={updateProfileMessage}
      />
    </div>
  );
}

UserProfile.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    google: PropTypes.bool,
    mentees: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  updateAppProfile: PropTypes.func.isRequired,
};

export default UserProfile;
