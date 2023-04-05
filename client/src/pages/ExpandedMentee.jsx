import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { db } from './firebase';
// import styles from '../styles/Mentees.module.css';
// import * as api from '../api';

function ExpandedMentee({ profile }) {
  console.log(profile);
  const location = useLocation();
  const { id } = location.state;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  //   const [firstName, setFirstName] = useState('');
  //   const [firstName, setFirstName] = useState('');

  const getMentee = () => {
    db.collection('mentees').get(id).then((data) => {
      console.log('SJKLFJDSLK');
      setFirstName(data.firstName);
      console.log(firstName);
      setLastName(data.lastName);
    });
  };

  useEffect(getMentee, [id]);

  return (
    <div>
      <h1>MY MENTEES</h1>
      <h3>{firstName}</h3>
      <h3>{lastName}</h3>
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
