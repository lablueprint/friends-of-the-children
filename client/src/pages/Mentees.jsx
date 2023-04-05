import React from 'react';
import PropTypes from 'prop-types';
// import styles from '../styles/Example.module.css';
// import * as api from '../api';

function Mentees({ profile }) {
  console.log(profile);
  return (
    <div>
      <h1>MY MENTEES</h1>
    </div>
  );
}

Mentees.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};

export default Mentees;
