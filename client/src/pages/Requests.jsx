/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AdminTable from '../components/AdminTable';
import * as api from '../api';
import styles from '../styles/Requests.module.css';

function Requests({ profile }) {
  // pull new users from firebase and show them in the correct order
  // console.log the entire object, look for a field called data to see if there's any kind of time stamp included in the metadata
  // allow admin to modify the user's approved status

  const [approveMode, setApproveMode] = useState(false);
  const [numSelected, setNumSelected] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [viewOnlyPending, setViewOnlyPending] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      // ask jerry how to get the data sorted
      const { data } = await api.getProfilesSortedByDate();
      // filter array of profile objects (also make sure they all have approved and date fields in firebase)
      const users = data.filter((user) => (('approved' in user) && ('date' in user)) && (user.role.toLowerCase() !== 'admin'));
      const reducedAllUsers = users.map((user) => {
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
      setAllUsers(reducedAllUsers);
      const unapprovedUsers = users.filter((user) => ((user.approved === false)));
      const reducedUsers = unapprovedUsers.map((user) => {
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
      <div>
        <button type="button" onClick={() => setViewOnlyPending(true)}>New Users</button>
        <button type="button" onClick={() => setViewOnlyPending(false)}>All Users</button>
      </div>
      { viewOnlyPending && pendingUsers && <AdminTable users={pendingUsers} />}
      { !viewOnlyPending && allUsers && <AdminTable users={allUsers} />}
      { !approveMode && <button type="button" onClick={() => setApproveMode(true)}>Select</button>}
      { approveMode
      && (
      <div>
        <div>
          <p>{numSelected}</p>
          <p>Selected</p>
        </div>
        <button type="button" onClick={() => setApproveMode(false)}>Cancel</button>
        <button type="button" onClick={() => setApproveMode(false)}>Approve</button>
        <button type="button" onClick={() => setApproveMode(false)}>Delete</button>
      </div>
      )}
      {/* <button type="button" disabled={at least one user selected} onClick={update statuses}>Approve<button> */}
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
