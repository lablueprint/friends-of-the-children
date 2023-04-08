/* eslint-disable no-unused-vars */
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as api from '../api';

function UserNotApproved({ updateAppProfile }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const approved = false;
  console.log(state);
  if (approved) {
    updateAppProfile(state);

    // mailchimp- update list on signup
    const payload = {
      email_address: state.email,
      firstName: state.firstName,
      lastName: state.lastName,
      role: state.role,
      serviceArea: state.serviceArea,
    };
    api.addToList(payload);
    navigate('/modules');
  }
  return (
    <h1>Waiting to approve you bestie</h1>
  );
}

UserNotApproved.propTypes = {
  updateAppProfile: PropTypes.func.isRequired,
};
export default UserNotApproved;
