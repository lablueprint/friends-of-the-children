/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TextField, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import styles from '../styles/UserProfile.module.css';
import { db, storage } from './firebase';
import * as api from '../api';
import UserIcon from '../assets/icons/user_icon.svg';
import LocationIcon from '../assets/icons/location_icon.svg';
import { serviceAreas } from '../constants';

// Allows users to see and change their profile properties
function UserProfile({ profile, updateAppProfile }) {
  const [editProfile, setEditProfile] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(profile);
  const [updateProfileMessage, setUpdateProfileMessage] = useState('');
  const [imageUrl, setImageUrl] = useState(profile.image);

  const handleUpload = async (image) => {
    console.log('target:', image.name);
    const imageName = image.name;
    const storageRef = ref(storage, `/images/${imageName}`);

    uploadBytes(storageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (url) => {
        setImageUrl(url);
        console.log(url);
        const docRef = doc(db, 'profiles', profile.id);
        await updateDoc(docRef, {
          image: url,
        });
        const newProfile = {
          ...profile,
          image: url,
        };
        updateAppProfile(newProfile);
      });
    });
  };

  function HandleClick() {
    setEditProfile(true);
    setUpdateProfileMessage('');
  }

  function HandleSubmit() {
    db.collection('profiles')
      .doc(profile.id)
      .update(updatedProfile)
      .then(() => {
        const payload = {
          currentEmail: profile.email,
          newEmail: updatedProfile.email,
          serviceArea: updatedProfile.serviceArea,
          role: updatedProfile.role,
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
        };
        api.updateList(payload);
        setUpdateProfileMessage('Profile Successfully Updated!');
        updateAppProfile(updatedProfile);
        setTimeout(() => { setEditProfile(false); window.location.reload(); }, 800);
      })
      .catch((error) => {
        setUpdateProfileMessage('We ran into an error updating your profile!');
        console.log(error);
      });
  }

  function HandleChange(event, field) {
    setUpdatedProfile((prevValue) => ({ ...prevValue, [field]: event.target.value }));
  }

  const uploadImage = (e) => {
    handleUpload(e.target.files[0]);
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
          {!editProfile && <button type="button" className={styles.edit_button} onClick={HandleClick}> Edit Profile </button> }
          {editProfile && <button type="button" className={styles.save_button} onClick={HandleSubmit}> Save Profile </button>}
        </div>
      </div>
      <p>{updateProfileMessage}</p>

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
          {profile && profile.role && (
          <div className={styles.labels_container}>
            {!editProfile && <p>Role:</p>}
            <FormControl>
              {editProfile && <InputLabel>Role</InputLabel>}
              <Select
                sx={{
                  fieldset: { borderColor: editProfile ? '#156DBF !important' : 'transparent !important' },
                }}
                label={editProfile ? 'Role' : ''}
                id="role"
                className={!editProfile ? styles.label : styles.label2}
                defaultValue={profile.role}
                value={updatedProfile.role}
                disabled={!editProfile}
                onChange={(event) => HandleChange(event, 'role')}
              >
                <MenuItem value="Caregiver">Caregiver</MenuItem>
                <MenuItem value="Mentor">Mentor</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </div>
          )}
          {profile && profile.serviceArea && (
          <div className={styles.labels_container}>
            {!editProfile && <p>Service Area:</p>}
            <FormControl>
              {editProfile && <InputLabel>Service Area</InputLabel>}
              <Select
                sx={{
                  fieldset: { borderColor: editProfile ? '#156DBF !important' : 'transparent !important' },
                }}
                label={editProfile ? 'Service Area' : ''}
                id="serviceArea"
                className={!editProfile ? styles.label : styles.label2}
                defaultValue={profile.serviceArea}
                value={updatedProfile.serviceArea}
                disabled={!editProfile}
                onChange={(event) => HandleChange(event, 'serviceArea')}
              >
                {serviceAreas.map((area) => <MenuItem value={area}>{area}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
          )}
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
        </div>

        <div className={styles.info_container_right}>
          <h4 className={styles.info_label}>Bio</h4>
          <div className={styles.labels_container}>
            {!editProfile && <br />}
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

      </div>
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
    image: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  updateAppProfile: PropTypes.func.isRequired,
};

export default UserProfile;
