import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import { arrayUnion } from 'firebase/firestore';
import styles from '../styles/Mentees.module.css';
import { db, storage } from './firebase';
import * as api from '../api';

// const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

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
  // media states for dialog opening/closing views
  const [isFile, setIsFile] = useState(false);
  const [isLink, setIsLink] = useState(false);
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

  // get the current folder contents on first load
  useEffect(() => {
    getFolder();
  }, []);

  // add file in respective firebase folders (if type image -> Image folder too, etc)
  // const updateMentee = async (data, type) => {
  //   await db.collection('mentees').doc(id).collection('folders').doc(folderName)
  //     .set({
  //       files: mediaArray,
  //     });
  //   if (type.includes('image')) {
  //     console.log('IMAGE HERE');
  //     await db.collection('mentees').doc(id).collection('folders').doc('Images')
  //       .update({
  //         files: arrayUnion(data),
  //       });
  //   } else if (type.includes('video')) {
  //     await db.collection('mentees').doc(id).collection('folders').doc('Videos')
  //       .update({
  //         files: arrayUnion(data),
  //       });
  //   } else if (type === 'link') {
  //     await db.collection('mentees').doc(id).collection('folders').doc('Links')
  //       .update({
  //         files: arrayUnion(data),
  //       });
  //   } else if (type.includes('pdf')) {
  //     await db.collection('mentees').doc(id).collection('folders').doc('Flyers')
  //       .update({
  //         files: arrayUnion(data),
  //       });
  //   }
  // };

  // creates new object for the file, updates mediaArray, and calls updateMentee
  const addMedia = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    let fileName;
    let fileType;

    if (isFile) {
      const files = e.target.files.files[0];
      fileName = files.name;
      fileType = files.type;

      const storageRef = ref(storage, `/images/${fileName}`);
      uploadBytes(storageRef, files).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => { // get url of file through firebase
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
            api.updateMentee(id, folderName, mediaArray, data, fileType);
            setOpen(false);
            e.target.reset();
          });
      });
    } else if (isLink) {
      fileName = title;
      fileType = 'link';
      const tempArr = mediaArray;
      const data = {
        title,
        fileUrl: e.target.link.value,
        fileType,
      };
      tempArr.push(data);
      setMediaArray(tempArr);
      api.updateMentee(id, folderName, mediaArray, data, fileType);
      setOpen(false);
      e.target.reset();
    }

    console.log(fileType);
  };

  // handle dialog form closing/opening
  const handleClickOpen = () => {
    setIsFile(false);
    setIsLink(false);
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

          <h3>{`${folderName}`}</h3>

          {/* users cannot directly add into the images/videos/flyers folders? */}
          {folderName !== 'Images' && folderName !== 'Videos' && folderName !== 'Flyers' && folderName !== 'Links' && (
          <Button variant="contained" onClick={handleClickOpen}>
            + Add Media
          </Button>
          )}

        </div>
      </div>

      {/* mapping each file in the array to a little card element onscreen */}
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
            <li><a href={file.fileUrl} target="_blank" rel="noreferrer">{file.fileUrl}</a></li>
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
            {!isFile && !isLink && (
              <div>
                <Button variant="contained" onClick={() => { setIsFile(true); setIsLink(false); }}>New File</Button>
                <br />
                <br />
                <Button variant="contained" onClick={() => { setIsLink(true); setIsFile(false); }}>New Link</Button>
              </div>
            )}

            {(isFile || isLink) && (
              <Button onClick={() => { setIsFile(false); setIsLink(false); }}>BACK</Button>
            )}

            <form className={styles.mediaForm} onSubmit={(e) => addMedia(e)}>
              {isFile && (
              <div>
                <h5>Add New File</h5>
                <p>Title</p>
                <input type="text" name="title" required />
                <p>Select File</p>
                <input type="file" name="files" />
              </div>
              )}
              {isLink && (
              <div>
                <h5>Add New Link</h5>
                <p>Title</p>
                <input type="text" name="title" required />
                <p>Link</p>
                <input type="text" name="link" required />
              </div>
              )}
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
