/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AdminTable from '../components/AdminTable';
import * as api from '../api';

function Requests({ profile }) {
  // pull new users from firebase and show them in the correct order
  // console.log the entire object, look for a field called data to see if there's any kind of time stamp included in the metadata
  // allow admin to modify the user's approved status

  // gets all user profiles
  const [pendingUsers, setPendingUsers] = useState([]);
  useEffect(() => {
    async function fetchProfiles() {
      // ask jerry how to get the data sorted
      const { data } = await api.getProfilesSortedByDate();
      // filter array of profile objects
      const unapprovedUsers = data.filter((user) => (('approved' in user) && (user.approved === false)));
      const reducedUsers = unapprovedUsers.map((user) => {
        console.log(user);
        const myDate = new Date(user.date.seconds * 1000);
        return ({
          name: `${user.firstName} ${user.lastName}`,
          username: user.username,
          email: user.email,
          role: user.role,
          epochDate: myDate.toLocaleString(),
          status: user.status,
        });
      });
      setPendingUsers(reducedUsers);
    }
    fetchProfiles();
  }, []);

  return (
    <div>
      <h1>
        Requests
      </h1>
      <AdminTable users={pendingUsers} />
      <button type="button">Submit</button>
      {/* <p>{numApproved}</p> */}
    </div>
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
