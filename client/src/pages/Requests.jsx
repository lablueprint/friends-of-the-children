import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Tab, Tabs,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import TabPanel from '../components/TabPanel';
import AdminTable from '../components/AdminTable';
import * as api from '../api';
import styles from '../styles/Requests.module.css';
import PermissionDenied from './PermissionDenied';

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

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const HomeTab = styled((props) => <Tab disableRipple {...props} />)(() => ({
    textTransform: 'none',

  }));

  function HandleCancelClick() {
    setNumChecked(0);
    setCancelButton(true);
  }

  function HandleApproveClick() {
    setNumChecked(0);
    setOpenApprovalDialog(true);
  }

  function HandleDeleteClick() {
    setNumChecked(0);
    setOpenDeleteDialog(true);
  }

  const closeDeleteDialog = () => {
    setNumChecked(0);
    setOpenDeleteDialog(false);
    setCancelButton(true);
  };

  const handleDelete = () => {
    setDeleteButton(true);
  };

  const closeApprovalDialog = () => {
    setNumChecked(0);
    setOpenApprovalDialog(false);
    setCancelButton(true);
  };

  const handleApproval = () => {
    setApproveButton(true);
  };

  useEffect(() => {
    if (value === 0) {
      setCurrentAccounts(pendingUsers);
    } else if (value === 1) {
      setCurrentAccounts(allUsers);
    }
  }, [value]);

  useEffect(() => {
    if (numChecked === 0) {
      setSelectMode(false);
    }
  }, [numChecked]);

  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await api.getProfilesSortedByDate();

      // filter array of profile objects (also make sure they all have approved and date fields in firebase)
      const users = data.filter((user) => (('approved' in user) && ('date' in user)));
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
            && <AdminTable users={currentAccounts} setRowsSelected={setNumChecked} cancelButton={cancelButton} setCancelButton={setCancelButton} approveButton={approveButton} setApproveButton={setApproveButton} deleteButton={deleteButton} setDeleteButton={setDeleteButton} setSelectMode={setSelectMode} />}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {currentAccounts
            && <AdminTable users={currentAccounts} setRowsSelected={setNumChecked} cancelButton={cancelButton} setCancelButton={setCancelButton} approveButton={approveButton} setApproveButton={setApproveButton} deleteButton={deleteButton} setDeleteButton={setDeleteButton} setSelectMode={setSelectMode} />}
          </TabPanel>
          { selectMode
          && (
          <div className={styles.deleteFilesBar}>
            <div className={styles.totalSelected}>
              <div className={styles.selectedNumber}>
                {numChecked}
                {' '}
              </div>
              {' '}
              <p className={styles.selectedText}>
                Selected
              </p>
            </div>
            <div>
              <button type="button" className={styles.cancelButton} onClick={HandleCancelClick}>Cancel</button>
              {value === 0 && <button type="button" className={styles.approveButton} onClick={HandleApproveClick}>Approve</button> }
              <button type="button" className={styles.deleteButton} onClick={HandleDeleteClick}>Delete</button>
            </div>
          </div>
          )}

          {/* confirmation to delete selected users */}
          <Dialog fullWidth maxWidth={'xs'} open={openDeleteDialog} onClose={closeDeleteDialog}>
            <DialogTitle>Delete selected user(s)?</DialogTitle>
            <DialogActions>
              <Button autoFocus onClick={closeDeleteDialog}>
                Cancel
              </Button>
              <Button onClick={handleDelete} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* confirmation to approve selected users */}
          <Dialog fullWidth maxWidth={'xs'} open={openApprovalDialog} onClose={closeApprovalDialog}>
            <DialogTitle>Approve selected user(s)?</DialogTitle>
            <DialogActions>
              <Button autoFocus onClick={closeApprovalDialog}>
                Cancel
              </Button>
              <Button onClick={handleApproval} autoFocus>
                Approve
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )
      : <PermissionDenied />
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
