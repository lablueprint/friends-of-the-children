import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
// import { db } from './firebase';
// import styles from '../styles/Mentees.module.css';
// import * as api from '../api';

function ExpandedMentee({ profile }) {
  console.log(profile);
  const location = useLocation();
  const {
    id, firstName, lastName, age,
  } = location.state;
  console.log(id);

  return (
    <div>
      <h1>{`${firstName} ${lastName}`}</h1>
      <p>
        Caregiver:
        {' '}
        {profile.firstName}
      </p>
      <p>
        Service Area:
        {' '}
        {profile.serviceArea}
      </p>
      <p>
        {age}
        {' '}
        years old
      </p>
      <h1>Folders</h1>
      <button type="button">+ Add a new folder</button>
    </div>
  );
}

ExpandedMentee.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};

export default ExpandedMentee;
