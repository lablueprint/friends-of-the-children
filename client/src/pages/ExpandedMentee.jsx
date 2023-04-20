import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { addDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import styles from '../styles/Mentees.module.css';
import { db } from './firebase';
import VideoIcon from '../assets/icons/videos_icon.svg';
import ImageIcon from '../assets/icons/images_icon.svg';
import FlyerIcon from '../assets/icons/flyers_icon.svg';

// import { db } from './firebase';
// import styles from '../styles/Mentees.module.css';
// import * as api from '../api';

function ExpandedMentee({ profile }) {
  const location = useLocation();
  const {
    id, firstName, lastName, age, caregiver,
  } = location.state;
  const [folderArray, setFolderArray] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [isLink, setIsLink] = useState(false);

  const getMentee = () => {
    const tempFolders = [];
    db.collection('mentees').doc(id).collection('folders').get()
      .then((sc) => {
        if (sc.empty) {
          console.log('No matching documents.');
          return;
        }
        sc.forEach((currDoc) => {
          console.log(sc);
          const folderName = currDoc.id;
          if (folderName !== 'root') { tempFolders.push(folderName); }
          console.log('Found subcollection with id:', currDoc.id);
        });
      })
      .then(() => {
        setFolderArray(tempFolders);
      });
  };

  // add new document to folders collection
  const updateMentee = async (target) => {
    await db.collection('mentees').doc(id).collection('folders').doc(target)
      .set({
        files: [],
      });
  };

  const addFolder = async (e) => {
    e.preventDefault();
    const name = e.target.folderName.value;
    updateMentee(name).then(() => {
      console.log('hI');
      setFolderArray([...folderArray, name]);

      setOpen(false);
      e.target.reset();
    });
  };

  useEffect(getMentee, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen2 = () => {
    setIsFile(false);
    setIsLink(false);
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  return (
    <div className={styles.folders_page}>
      <div>
        <p>
          {'My Mentees > '}
          <b>
            {`${firstName} ${lastName}`}
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

          <Button variant="contained" onClick={handleClickOpen2}>
            + Upload File
          </Button>
        </div>
      </div>

      <h3>Folders</h3>
      <div className={styles.folders_map}>
        {folderArray.map((folder) => (
          <div className={styles.folder_container}>
            <Link
              to={`./folder_${folder}`}
              state={{
                id, folderName: folder, firstName, lastName, age, caregiver,
              }}
            >
              {folder === 'Videos' && <img src={VideoIcon} alt="video icon" />}
              {folder === 'Images' && <img src={ImageIcon} alt="images icon" />}
              {folder === 'Flyers' && <img src={FlyerIcon} alt="flyer icon" />}
              {folder === 'Links' && <img src={FlyerIcon} alt="links icon" />}

              <p>{folder}</p>
            </Link>
          </div>
        ))}
        <Button variant="outlined" onClick={handleClickOpen}>
          + Add a New Folder
        </Button>
      </div>

      <h3>Recent Uploads</h3>

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

      <div>
        <Dialog open={open2} onClose={handleClose2}>
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

            <form className={styles.mediaForm}>
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

              {(isLink || isFile) && (
              <div>
                <p>Folder</p>
                <select name="folders">
                  <option value="">Select Folder</option>
                  <option value="volvo">Volvo</option>
                  <option value="saab">Saab</option>
                  <option value="fiat">Fiat</option>
                  <option value="audi">Audi</option>
                </select>
              </div>
              )}
              <DialogActions>
                <Button onClick={handleClose2}>Cancel</Button>
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
