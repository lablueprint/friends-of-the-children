import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import { ref, uploadBytesResumable } from 'firebase/storage';
import NewModulePopup from '../components/NewModulePopup';

// import { db, storage } from './firebase';
import styles from '../styles/Modules.module.css';
import * as api from '../api';

function Resources({ profile }) {
  const [modules, setModules] = useState([]);
  const [open, setOpen] = React.useState(false);
  const { role } = profile;
  const currRole = role.toLowerCase();

  // getting all modules relevant to current user
  const fetchData = async () => {
    const { data } = await api.getModules(currRole);
    setModules(data);
  };

  // // TODO: Move to backend, figure out how to maintain setPercent once it is moved to the backedn and sent back as a promise chain
  // // upload file to Firebase:
  // const handleUpload = (file) => {
  //   // if (!file) {
  //   //   alert('Please choose a file first!');
  //   // }
  //   const fileName = file.name;
  //   const storageRef = ref(storage, `/files/${fileName}`);
  //   // setLinks(storageRef.fullPath);
  //   const uploadTask = uploadBytesResumable(storageRef, file);

  //   uploadTask.on(
  //     'state_changed',
  //     (snapshot) => {
  //       const p = Math.round(
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
  //       );

  //       // update progress
  //       setPercent(p);
  //     },
  //     (err) => console.log(err),
  //   );
  //   console.log(storageRef.fullPath);
  //   return storageRef.fullPath;
  //   // set linkstate here:
  // };

  // const handleChange = (e) => {
  //   const urls = [];
  //   Array.from(e.target.files).forEach((file) => urls.push(handleUpload(file))); // allows you to upload multiple files
  //   setFileLinks(urls);
  // };

  // const submitForm = async (data) => { // adds a module to the root module page
  //   const data = { // this goes into NewModulePopup
  //     title,
  //     body,
  //     serviceArea,
  //     role: roles,
  //     children: [],
  //     parent: null,
  //     fileLinks, // set from handleChange, which triggers handleUpload of all the files
  //   };
  //   console.log(fileLinks);
  //   // receive module id
  //   // TODO: Create api call (move db.collection to backend)
  //   const tempId = (await db.collection('modules').add(data)).id;

  //   data.id = tempId;

  //   setModules([...modules, data]);

  //   // setModules([...modules, data]); // why is this run twice? - dk

  //   setTitle('');
  //   setBody('');
  //   setServiceArea('');
  //   setCaregiver(false);
  //   setMentor(false);
  //   setFileLinks([]);
  // };

  const updateModule = (data) => {
    setModules([...modules, data]);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // empty dependency array means getModules is only being called on page load
  useEffect(() => {
    // saving all the user profiles from Firebase in an array (useProfiles) only on first load
    fetchData().catch(console.error);
  }, []);

  if (currRole === 'admin') {
    return (
      <div>
        {modules.map((card) => (
          <div key={card.id}>
            <Link
              to="/expanded-module"
              state={{ id: card.id }}
            >
              <div className={styles.card}>
                <h1>{card.title}</h1>
              </div>
            </Link>
          </div>
        ))}
        <Button variant="outlined" onClick={handleClickOpen}>
          Add module
        </Button>
        {console.log(open)}
        {/* {console.log(handleClose)}
        {console.log(open)} */}
        {/* <Dialog open={open} onClose={handleClose}> */}
        <NewModulePopup>
          {' '}
          updateModule=
          {updateModule}
          open=
          {open}
          onClose=
          {handleClose}
        </NewModulePopup>
        {/* </Dialog> */}
      </div>
    );
  }
  return (
    <div>
      {modules.map((card) => (
        <div key={card.id}>
          <Link
            to="/expanded-module"
            state={{ id: card.id }}
          >
            <div className={styles.card}>
              <h1>{card.title}</h1>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

Resources.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};
export default Resources;
