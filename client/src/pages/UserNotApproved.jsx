/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../redux/sliceAuth';
import styles from '../styles/UserNotApproved.module.css';
import LoginFamily from '../assets/images/login_family.svg';

function UserNotApproved({ updateAppProfile, profile }) {
  const pendingMessage = 'Your request to become a caregiver has been received and is awaiting approval. We will send you an email once your account has been approved.';
  const dispatch = useDispatch();

  const handleLogout = () => {
    updateAppProfile(null);
    dispatch(logout(profile));
  };
  /*
  if (profile.role.toLowerCase() === 'mentor') {
    pendingMessage = 'Your request to become a mentor has been received and is awaiting approval. We will send you an email once your account has been approved.';
  } else {
    pendingMessage = 'Your request to become a caregiver has been received and is awaiting approval. We will send you an email once your account has been approved.';
  }
  */
  return (
    <div>
      <div>
        <img src={LoginFamily} alt="fotc family" className={styles.family_img} />
      </div>
      <h1 className={styles.request_pending_message}>
        {pendingMessage}
      </h1>
      <Link to="/" className={`${styles.btn_info} ${styles.btn_danger}`} onClick={handleLogout}> Log Out </Link>
    </div>
  );
}

UserNotApproved.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
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
export default UserNotApproved;
