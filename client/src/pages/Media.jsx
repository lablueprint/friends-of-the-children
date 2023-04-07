import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
// import { doc, updateDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import styles from '../styles/Mentees.module.css';
// import { db } from './firebase';
// import { db } from './firebase';
// import * as api from '../api';

function Media({ profile }) {
  const location = useLocation();
  const {
    folderName, media, firstName, lastName, age, caregiver,
  } = location.state;
  const [open, setOpen] = useState(false);

  console.log(profile, folderName, media);

  const addMedia = (e) => {
    const title = e.target.title.value;
    console.log(title);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <h1>{`${folderName} folder!`}</h1>
      <h1>{`${firstName} ${lastName}`}</h1>
      <p>
        Caregiver:
        {' '}
        {caregiver}
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
      <Button variant="contained" onClick={handleClickOpen}>
        + Add Media
      </Button>

      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <h5>Add Media</h5>
            <form onSubmit={(e) => addMedia(e)}>
              Title
              <input type="text" name="title" required />
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

Media.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};

export default Media;
