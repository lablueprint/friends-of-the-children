/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTable } from react-table;
import * as api from '../api';

function Requests({ profile }) {
  // pull new users from firebase and show them in the correct order
  // console.log the entire object, look for a field called data to see if there's any kind of time stamp included in the metadata
  // allow admin to modify the user's approved status

  // gets all user profiles
  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await api.getAllProfiles();
      console.log(data);
    }
    fetchProfiles();
  }, []);

  return (
    <h1>
      Requests
    </h1>
  );
}

Requests.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};

export default Requests;
