import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import styles from '../styles/Mentees.module.css';
import { db } from './firebase';
// import { db } from './firebase';
// import styles from '../styles/Mentees.module.css';
// import * as api from '../api';

function ExpandedMentee({ profile }) {
  const location = useLocation();
  const {
    id, firstName, lastName, age, caregiver,
  } = location.state;
  // folders = json object
  const [folders, setFolders] = useState(null);
  const [folderArray, setFolderArray] = useState([]);
  const [open, setOpen] = useState(false);
  //   console.log(id);
  console.log(folders);

  const getMentee = () => {
    const tempFolders = [];
    db.collection('mentees').doc(id).get().then((sc) => {
      const data = sc.data();
      const menteeFolders = JSON.parse(data.folders);
      Object.entries(menteeFolders).forEach((folder) => {
        tempFolders.push(folder);
      });
      setFolders(JSON.parse(data.folders));
    });
    setFolderArray(tempFolders);
  };

  // update the mentee's folders field
  const updateMentee = async (target) => {
    const menteeRef = doc(db, 'mentees', id);
    await updateDoc(menteeRef, {
      folders: JSON.stringify(target),
    });
  };

  const addFolder = async (e) => {
    e.preventDefault();
    const name = e.target.folderName.value;
    // add name as new key mapped to an empty array
    const tempObj = folders;
    tempObj[name] = [];
    // const newFolder = JSON.parse(`{"${name}":[]}`);

    if (folders) {
      await updateMentee(folders);
    }

    setFolders(tempObj);
    const arr = [`${name}`, []];
    setFolderArray([...folderArray, arr]);

    setOpen(false);
    e.target.reset();
  };

  useEffect(getMentee, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
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

      <h3>Folders</h3>

      <Button variant="outlined" onClick={handleClickOpen}>
        + Add a New Folder
      </Button>

      <div>
        {folderArray.map((folder) => (
          <div className={styles.folder_container}>
            <Link
              to={`./folder_${folder[0]}`}
              state={{
                folders, folderName: folder[0], media: folder[1], id, firstName, lastName, age, caregiver,
              }}
            >
              <h2>{folder[0]}</h2>
            </Link>
          </div>
        ))}
      </div>

      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <h5>Create New Folder</h5>
            Title
            <form onSubmit={(e) => addFolder(e)}>
              <input type="text" name="folderName" required />
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
