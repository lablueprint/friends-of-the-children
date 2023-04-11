import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// import { arrayUnion } from 'firebase/firestore';
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
    id, folderName, firstName, lastName, age, caregiver,
  } = location.state;
  // parse media string to an array
  const [open, setOpen] = useState(false);
  // this is the array of file links
  const [mediaArray, setMediaArray] = useState([]);
  const [fileUrl, setFileUrl] = useState('');
  console.log(mediaArray);

  const getFolder = () => {
    db.collection('mentees').doc(id).collection('folders').doc(folderName)
      .get()
      .then((sc) => {
        const data = sc.data();
        const { files } = data;
        setMediaArray(files);
      })
      .then(() => {
        console.log(mediaArray);
      });
  };

  useEffect(() => {
    getFolder();
  }, []);

  // add file in firebase folder
  const updateMentee = async () => {
    await db.collection('mentees').doc(id).collection('folders').doc(folderName)
      .set({
        files: mediaArray,
      });
    // if (type === 'image') {

    // }
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

    await updateMentee();

    setOpen(false);
    e.target.reset();
  };

  const handleUpload = (image) => {
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
    <div className={styles.folders_page}>
      <div>
        <p>
          {`My Mentees > ${firstName} ${lastName} > `}
          <b>
            {`${folderName}`}
          </b>
        </p>
        <p>
          Caregiver:
          {' '}
          {caregiver}
        </p>
      </div>

      <div className={styles.profile_container}>
        <div>
          <div className={styles.pfp}>
            <img className={styles.profile_pic} src="https://images.theconversation.com/files/304864/original/file-20191203-67028-qfiw3k.jpeg?ixlib=rb-1.1.0&rect=638%2C2%2C795%2C745&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip" alt="" />
          </div>

          <div className={styles.user_info}>
            <h1>{`${firstName} ${lastName}`}</h1>
            <p>
              {age}
              {' '}
              years old
            </p>
          </div>

          <div className={styles.service_area}>
            <p>
              {profile.serviceArea}
            </p>
          </div>

          <Button variant="contained" onClick={handleClickOpen}>
            + Add Media
          </Button>
        </div>
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
