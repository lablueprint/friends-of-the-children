import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import styles from '../styles/Mentees.module.css';
import VideoIcon from '../assets/icons/videos_icon.svg';
import ImageIcon from '../assets/icons/images_icon.svg';
import FlyerIcon from '../assets/icons/flyers_icon.svg';
// import { storage } from './firebase';
import * as api from '../api';

function ExpandedMentee({ profile }) {
  const location = useLocation();
  const {
    id, firstName, lastName, age, caregiver,
  } = location.state;
  const [recents, setRecents] = useState([]);
  const [folderArray, setFolderArray] = useState([]);
  const [open, setOpen] = useState(false);
  const [fileUploadOpen, setfileUploadOpen] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [isLink, setIsLink] = useState(false);

  // called upon submitting the form that adds a new folder
  const addFolder = async (e) => {
    e.preventDefault();
    const name = e.target.folderName.value;
    // call api function to add folder to database
    api.addMenteeFolder(id, name).then(() => {
      setFolderArray([...folderArray, name]);
      setOpen(false);
      e.target.reset();
    });
  };

  // have all of the mentees' folders and root files display on page
  useEffect(() => {
    api.getMenteeFolders(id).then((folders) => {
      setFolderArray(folders.data);
    });
    api.getMenteeFiles(id, 'Root').then((files) => {
      setRecents(files.data);
    });
  }, []);

  // called upon submitting the form that uploads new files
  const addMedia = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const folderName = e.target.folders.value;
    let fileName;
    let fileType;

    if (isFile) {
      const files = e.target.files.files[0];
      fileName = files.name;
      fileType = files.type;
      api.uploadFile(files, fileName).then((url) => { // get url of file through firebase
        const tempArr = recents;
        const data = {
          title,
          fileUrl: url,
          fileType,
        };
        tempArr.push(data);
        setRecents(tempArr);
        return data;
      })
        .then((data) => {
          api.addMenteeFile(id, folderName, data, fileType);
          setfileUploadOpen(false);
          e.target.reset();
        });
    } else if (isLink) { // reading text input for links, not file input
      fileName = title;
      fileType = 'link';
      const tempArr = recents;
      const data = {
        title,
        fileUrl: e.target.link.value,
        fileType,
      };
      tempArr.push(data);
      setRecents(tempArr);
      api.addMenteeFile(id, folderName, data, fileType);
      setfileUploadOpen(false);
      e.target.reset();
    }
  };

  // when click on add new folder button
  const addNewFolder = () => {
    setOpen(true);
  };

  // when close add new folder popup
  const handleClose = () => {
    setOpen(false);
  };

  // when click on upload file button
  const addNewFile = () => {
    setIsFile(false);
    setIsLink(false);
    setfileUploadOpen(true);
  };

  // when close upload file popup
  const closeFileUpload = () => {
    setfileUploadOpen(false);
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
            <img className={styles.profile_pic} src="https://i.pinimg.com/564x/a0/8e/a5/a08ea58c5ea6000579249c7ccbfa99b0.jpg" alt="" />
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

          <Button variant="contained" onClick={addNewFile}>
            + Upload File
          </Button>
        </div>
      </div>

      <h3>Folders</h3>
      <div className={styles.folders_map}>
        {folderArray.map((folder) => (
          folder !== 'Root' && (
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
          )
        ))}
        <Button variant="outlined" onClick={addNewFolder}>
          + Add a New Folder
        </Button>
      </div>

      <h3>Recent Uploads</h3>
      {recents.map((file) => (
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

      {/* create a new folder */}
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

      {/* add file */}
      <div>
        <Dialog open={fileUploadOpen} onClose={closeFileUpload}>
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
              {(isLink || isFile) && (
              <div>
                <p>Folder</p>
                <select name="folders">
                  <option value="Root">Select Folder</option>
                  {folderArray.map((folder) => (
                    (
                      folder !== 'Flyers' && folder !== 'Videos' && folder !== 'Images' && folder !== 'Links'
                      && <option value={folder}>{folder}</option>
                    )
                  ))}
                </select>
              </div>
              )}
              <DialogActions>
                <Button onClick={closeFileUpload}>Cancel</Button>
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
    mentees: PropTypes.arrayOf.isRequired,
  }).isRequired,
};

export default ExpandedMentee;
