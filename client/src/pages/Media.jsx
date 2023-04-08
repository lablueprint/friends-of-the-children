import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import styles from '../styles/Mentees.module.css';
import { db, storage } from './firebase';
// import * as api from '../api';

function Media({ profile }) {
  const location = useLocation();
  // media is the string of file links in this folder
  const {
    id, folders, folderName, media, firstName, lastName, age, caregiver,
  } = location.state;
  // parse media string to an array
  const [open, setOpen] = useState(false);
  // this is the array of file links
  const [mediaArray, setMediaArray] = useState(media);
  const [fileUrl, setFileUrl] = useState('');
  console.log(mediaArray);

  const getFolder = () => {
    const tempMedia = [];
    db.collection('mentees').doc(id).get().then((sc) => {
      const data = sc.data();
      console.log(data.folders);
      const menteeFolders = JSON.parse(data.folders);
      const folderMedia = menteeFolders[folderName];
      console.log(folderMedia);
      if (folderMedia.length) {
        folderMedia.forEach((file) => {
          tempMedia.push(file);
        });
      }
    })
      .then(() => {
        console.log(tempMedia);
        setMediaArray(tempMedia);
        console.log(mediaArray);
      });
  };

  useEffect(() => {
    getFolder();
  }, []);

  const updateMentee = async () => {
    // update files array in firebase
    const foldersObj = folders;
    foldersObj[folderName] = mediaArray;
    console.log(mediaArray);
    console.log(foldersObj);
    console.log(JSON.stringify(foldersObj));
    const menteeRef = doc(db, 'mentees', id);
    await updateDoc(menteeRef, {
      folders: JSON.stringify(foldersObj),
    });
  };

  const addMedia = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    // append new file to the media files array
    const tempArr = mediaArray;
    const data = {
      title,
      fileUrl,
    };
    tempArr.push(data);
    setMediaArray(tempArr);
    // setMediaArray([...mediaArray, fileUrl]);
    updateMentee();

    console.log(mediaArray);

    console.log('HERE');

    setOpen(false);
    e.target.reset();
  };

  const handleUpload = async (image) => {
    console.log('target:', image.name);
    const imageName = image.name;
    const storageRef = ref(storage, `/images/${imageName}`);

    uploadBytes(storageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (url) => {
        setFileUrl(url);
        console.log(url);
      });
    });
  };

  const uploadImage = (e) => {
    handleUpload(e.target.files[0]);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <h1>{`this is the ${folderName} folder!`}</h1>
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
      <div>
        <Button variant="contained" onClick={handleClickOpen}>
          + Add Media
        </Button>
      </div>

      {mediaArray.map((file) => (
        <div className={styles.img_container}>
          <img className={styles.media_image} src={file.fileUrl} alt="" />
          <p>{file.title}</p>
        </div>
      ))}

      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <h5>Add Media</h5>
            <form onSubmit={(e) => addMedia(e)}>
              <input type="file" accept=".png,.jpg,.svg,.gif" onChange={uploadImage} />
              <h5>Title</h5>
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
