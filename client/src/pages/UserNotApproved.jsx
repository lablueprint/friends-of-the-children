/* eslint-disable no-unused-vars */
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../redux/sliceAuth';
import * as api from '../api';

function UserNotApproved({ updateAppProfile, profile }) {
  const { state } = useLocation();
  const dispatch = useDispatch();
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
    navigate('/unapproved');
  }

  const handleLogout = () => {
    updateAppProfile(null);
    dispatch(logout(profile));
  };
  return (
    <div>
      <h1>Waiting to approve you bestie</h1>
      <Link to="/" onClick={handleLogout}> Log Out </Link>
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
  }).isRequired,
  updateAppProfile: PropTypes.func.isRequired,
};
export default UserNotApproved;
