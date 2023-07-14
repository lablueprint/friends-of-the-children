import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Tab, Tabs,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TabPanel from '../components/TabPanel';
import AdminTable from '../components/AdminTable';
import * as api from '../api';
import styles from '../styles/Requests.module.css';
import NotFound from './NotFound';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Requests({ profile }) {
  const { role } = profile;

  const [pendingUsers, setPendingUsers] = useState([]);

  const [value, setValue] = useState(0);

  const [numChecked, setNumChecked] = useState(0);

  const [cancelButton, setCancelButton] = useState(false);

  const [approveButton, setApproveButton] = useState(false);

  const [deleteButton, setDeleteButton] = useState(false);

  const [selectMode, setSelectMode] = useState(false);

  const [currentAccounts, setCurrentAccounts] = useState([]);

  const [allUsers, setAllUsers] = useState([]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const HomeTab = styled((props) => <Tab disableRipple {...props} />)(() => ({
    textTransform: 'none',

  }));

  function HandleSelectClick() {
    setNumChecked(0);
    setSelectMode(true);
  }

  function HandleCancelClick() {
    setNumChecked(0);
    setCancelButton(true);
    setSelectMode(false);
  }

  function HandleApproveClick() {
    setNumChecked(0);
    setApproveButton(true);
    setSelectMode(false);
  }

  function HandleDeleteClick() {
    setNumChecked(0);
    setDeleteButton(true);
    setSelectMode(false);
  }

  useEffect(() => {
    if (value === 0) {
      setCurrentAccounts(pendingUsers);
    } else if (value === 1) {
      setCurrentAccounts(allUsers);
    }
  }, [value]);

  useEffect(() => {
    async function fetchProfiles() {
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
          status: user.approved,
          serviceArea: user.serviceArea,
          id: user.id,
        });
      });

      const unapprovedUsers = users.filter((user) => ((user.approved === false)));
      const reducedUnapprovedUsers = unapprovedUsers.map((user) => {
        const myDate = new Date(user.date.seconds * 1000);
        return ({
          name: `${user.firstName} ${user.lastName}`,
          username: user.username,
          email: user.email,
          role: user.role,
          epochDate: myDate.toLocaleString(),
          status: user.approved,
          serviceArea: user.serviceArea,
          id: user.id,
        });
      });

      setAllUsers(reducedAllUsers);
      setPendingUsers(reducedUnapprovedUsers);
      setCurrentAccounts(reducedUnapprovedUsers);
    }
    fetchProfiles();
  }, []);

  return (
    role === 'Admin'
      ? (
        <div className={styles.container}>
          <h1 className={styles.bigtitle}>
            Requests
          </h1>
          <div>
            <Tabs
              value={value}
              onChange={handleTabChange}
              aria-label="basic tabs example"
            >
              <HomeTab label="New Users" {...a11yProps(1)} />
              <HomeTab label="All Users" {...a11yProps(2)} />
            </Tabs>
            <div className={styles.line} />
          </div>
          <TabPanel value={value} index={0}>
            {currentAccounts
            && <AdminTable users={currentAccounts} setRowsSelected={setNumChecked} cancelButton={cancelButton} setCancelButton={setCancelButton} approveButton={approveButton} setApproveButton={setApproveButton} deleteButton={deleteButton} setDeleteButton={setDeleteButton} selectMode={selectMode} />}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {currentAccounts
            && <AdminTable users={currentAccounts} setRowsSelected={setNumChecked} cancelButton={cancelButton} setCancelButton={setCancelButton} approveButton={approveButton} setApproveButton={setApproveButton} deleteButton={deleteButton} setDeleteButton={setDeleteButton} selectMode={selectMode} />}
          </TabPanel>
          <div>
            { selectMode
              ? (
                <div>
                  <p>
                    {numChecked}
                    {' '}
                    Selected
                  </p>
                  <div>
                    <button type="button" onClick={HandleCancelClick}>Cancel</button>
                    <button type="button" onClick={HandleApproveClick}>Approve</button>
                    <button type="button" onClick={HandleDeleteClick}>Delete</button>
                  </div>
                </div>
              )
              : (<button type="button" onClick={HandleSelectClick}>Select</button>)}
          </div>
        </div>
      )
      : <NotFound />
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
    image: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    google: PropTypes.bool,
    mentees: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default Requests;
