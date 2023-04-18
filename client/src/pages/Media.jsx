import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { arrayUnion } from 'firebase/firestore';
// import { firestore } from 'firebase-admin';
import styles from '../styles/Mentees.module.css';
import { db, storage } from './firebase';

// const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
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
  console.log(mediaArray);

  const getFolder = () => {
    db.collection('mentees').doc(id).collection('folders').doc(folderName)
      .get()
      .then((sc) => {
        const data = sc.data();
        const { files } = data;
        setMediaArray(files);
        console.log(files);
      });
  };

  useEffect(() => {
    getFolder();
  }, []);

  // add file in firebase folder
  const updateMentee = async (data, type) => {
    console.log(data);
    console.log(type);
    await db.collection('mentees').doc(id).collection('folders').doc(folderName)
      .set({
        files: mediaArray,
      });
    if (type.includes('image')) {
      console.log('IMAGE HERE');
      await db.collection('mentees').doc(id).collection('folders').doc('Images')
        .update({
          files: arrayUnion(data),
        });
    } else if (type.includes('video')) {
      await db.collection('mentees').doc(id).collection('folders').doc('Videos')
        .update({
          files: arrayUnion(data),
        });
    } else if (type.includes('link')) {
      await db.collection('mentees').doc(id).collection('folders').doc('Links')
        .update({
          files: arrayUnion(data),
        });
    } else if (type.includes('pdf')) {
      await db.collection('mentees').doc(id).collection('folders').doc('Flyers')
        .update({
          files: arrayUnion(data),
        });
    }
  };

  const addMedia = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const files = e.target.files.files[0];

    const fileName = files.name;
    const fileType = files.type;

    console.log(fileType);
    const storageRef = ref(storage, `/images/${fileName}`);

    uploadBytes(storageRef, files).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const tempArr = mediaArray;
        const data = {
          title,
          fileUrl: url,
          fileType,
        };
        tempArr.push(data);
        setMediaArray(tempArr);
        return data;
      })
        .then((data) => {
          console.log(data);
          updateMentee(data, fileType);
          setOpen(false);
          e.target.reset();
        });
    });
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

          {folderName !== 'Images' && folderName !== 'Videos' && folderName !== 'Flyers' && (
          <Button variant="contained" onClick={handleClickOpen}>
            + Add Media
          </Button>
          )}

        </div>
      </div>

      {/* <div>
        {mediaArray.map((file) => {
          if (file.fileType === 'image/png' || file.fileType === 'image/jpeg') {
            return (
              <div className={styles.media_image}>
                {' '}
                <img src={file.fileUrl} alt={file.title} width="40%" height="auto" />
                <br />
              </div>
            );
          }
          if (file.fileType === 'video/mp4' || file.fileType === 'video/mpeg' || file.fileType === 'video/quicktime') {
            return (
              <div key={file.url} className="video">
                <video width="40%" height="auto" controls src={file.fileUrl} alt={file.title}>
                  <track default kind="captions" />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          }
          if (file.fileType === 'application/pdf') {
            return (
              <div key={file.fileUrl} className="pdf">
                <embed src={file.fileUrl} width="80%" height="800em" alt={file.title} />
              </div>
            );
          }
            <p>{file.title}</p>;
            return null;
        })}
      </div> */}

      {mediaArray.map((file) => (
        <div className={styles.img_container}>
          {(file.fileType.includes('image')) && (
          <div>
            <img className={styles.media_image} src={file.fileUrl} alt={file.title} />
          </div>
          )}
          {(file.fileType.includes('video')) && (
          <div>
            <video className={styles.media_image} controls src={file.fileUrl} alt={file.title}>
              <track default kind="captions" />
            </video>
          </div>
          )}
          {(file.fileType.includes('link')) && (
          <div>
            <img className={styles.media_image} src={file.fileUrl} alt={file.title} />
          </div>
          )}
          {(file.fileType.includes('pdf')) && (
          <div key={file.url} className="pdf">
            <embed className={styles.media_image} src={file.fileUrl} alt={file.title} />
          </div>
          )}
          <p>{file.title}</p>
        </div>
      ))}

      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <h5>Add Media</h5>
            <form onSubmit={(e) => addMedia(e)}>
              <input type="file" name="files" />
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
