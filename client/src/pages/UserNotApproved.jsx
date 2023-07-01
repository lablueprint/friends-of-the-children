/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../redux/sliceAuth';
import styles from '../styles/Login.module.css';
import LoginFamily from '../assets/images/login_family.svg';
import fotcLogo from '../assets/images/fotc_logo.svg';
import UpperRight from '../assets/images/upperRight.svg';
import BottomLeft from '../assets/images/bottomLeft.svg';

function UserNotApproved({ updateAppProfile, profile }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    updateAppProfile(null);
    dispatch(logout(profile));
    navigate('/login');
  };
  /*
  if (profile.role.toLowerCase() === 'mentor') {
    pendingMessage = 'Your request to become a mentor has been received and is awaiting approval. We will send you an email once your account has been approved.';
  } else {
    pendingMessage = 'Your request to become a caregiver has been received and is awaiting approval. We will send you an email once your account has been approved.';
  }
  */
  return (
    <div className={styles.approve_container}>
      <div>
        <a href="/">
          <img
            style={{
              position: 'absolute', width: '139px', height: '67px', left: '61px', top: '40px', zIndex: '1000',
            }}
            src={fotcLogo}
            alt="fotc logo"
          />
        </a>
      </div>
      <div className={styles.approve_main}>
        <h1 className={styles.approve_title}>Thank you for signing up!</h1>
        <h1 className={styles.request_pending_message}>
          Your
          {' '}
          <b>request</b>
          {' '}
          to become a caregiver has been received and is
          {' '}
          <b>awaiting approval</b>
          . We will send you an email once your account has been approved.
        </h1>
        <img src={LoginFamily} alt="fotc family" className={styles.approve_family_img} />
        <p className={styles.request_pending_message}>In the meantime, learn more about our organization!</p>
        <button type="button" onClick={handleLogout} className={`${styles.logout}`}>
          <a href="https://friendsofthechildren.org/" target="_blank" rel="noreferrer"> Go to Friends of the Children </a>
        </button>
      </div>
      <img src={UpperRight} alt="upper right design" className={styles.design_top} />
      <img src={BottomLeft} alt="bottom left design" className={styles.design_bottom} />
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
