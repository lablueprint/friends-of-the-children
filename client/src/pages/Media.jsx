import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {
  Checkbox,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import imgIcon from '../assets/icons/file_img.svg';
import vidIcon from '../assets/icons/file_vid.svg';
import pdfIcon from '../assets/icons/file_pdf.svg';
import FilePopup from '../components/FilePopup';
import styles from '../styles/Mentees.module.css';
import styles2 from '../styles/Modules.module.css';
import { storage } from './firebase';
import * as api from '../api';

function Media({ profile }) {
  const location = useLocation();
  // get the state of the location path (includes all the mentee's information)
  const {
    menteeObj,
  } = location.state;
  const {
    id, firstName, lastName, folderName,
  } = menteeObj;
  // parse media string to an array
  const [open, setOpen] = useState(false);
  // this is the array of file links
  const [mediaArray, setMediaArray] = useState([]);
  const role = (profile.role).toLowerCase();
  // media states for dialog opening/closing views
  const [isFile, setIsFile] = useState(false);
  const [isLink, setIsLink] = useState(false);
  // which tab you're on
  const [favTab, setFavTab] = useState(false);
  const [checked, setChecked] = useState([]);
  const [hoveredFile, setHoveredFile] = useState(null);
  const [fileToDisplay, setFileToDisplay] = useState({});
  const [openFilePopups, setOpenFilePopups] = useState(Array(mediaArray.length).fill(false));

  // get the current folder contents on first load
  useEffect(() => {
    api.getMenteeFiles(id, folderName).then((files) => {
      setMediaArray(files.data);
    });
  }, []);

  console.log(mediaArray);

  // creates new object for the file, updates mediaArray, and calls updateMentee
  const addMedia = (e) => {
    e.preventDefault();
    const fileName = e.target.title.value;
    let fileUrl;
    let fileType;

    if (isFile) {
      const files = e.target.files.files[0];
      fileUrl = files.name;
      fileType = files.type;

      const storageRef = ref(storage, `/images/${fileUrl}`);
      uploadBytes(storageRef, files).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => { // get url of file through firebase
          const tempArr = mediaArray;
          const data = {
            fileName,
            url,
            fileType,
          };
          tempArr.push(data);
          setMediaArray(tempArr);
          return data;
        })
          .then((data) => {
            api.addMenteeFile(id, folderName, data, fileType);
            setOpen(false);
            e.target.reset();
          });
      });
    } else if (isLink) { // reading text input for links, not file input
      fileUrl = fileName;
      fileType = 'link';
      const tempArr = mediaArray;
      const data = {
        fileName,
        url: e.target.link.value,
        fileType,
      };
      tempArr.push(data);
      setMediaArray(tempArr);
      api.addMenteeFile(id, folderName, data, fileType);
      setOpen(false);
      e.target.reset();
    }
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

  // opening file popup
  const handleClickOpenFilePopup = (file) => {
    const fileIndex = mediaArray.findIndex((f) => f.url === file.url);
    const updatedOpenFilePopups = [...openFilePopups];
    updatedOpenFilePopups[fileIndex] = true;
    setOpenFilePopups(updatedOpenFilePopups);
    setFileToDisplay(file);
  };

  const handleCloseFilePopup = (file) => {
    const fileIndex = mediaArray.findIndex((f) => f.url === file.url);
    const updatedOpenFilePopups = [...openFilePopups];
    updatedOpenFilePopups[fileIndex] = false;
    setOpenFilePopups(updatedOpenFilePopups);
  };

  const handleMouseEnter = (fileId) => {
    setHoveredFile(fileId);
  };

  const handleMouseLeave = () => {
    setHoveredFile(null);
  };

  const handleCheckboxChange = (event, fileName) => {
    if (checked.includes(fileName)) {
      setChecked(checked.filter((file) => (file !== fileName)));
      return;
    }

    setChecked([...checked, fileName]);
  };

  return (
    <div className={styles.folders_page}>
      <div>
        <p>
          {`My Youth > ${firstName} ${lastName} > `}
          <b>
            {`${folderName}`}
          </b>
        </p>
      </div>

      <div className={styles.profile_container}>
        <div>
          <div className={styles.media_heading_container}>
            <h3>{`${folderName}`}</h3>
            <div className={styles.buttons}>
              <button type="button" className={styles2.editModule}>
                Edit Module
              </button>

              {/* QUESTION: should users be able to directly add into the images/videos/flyers folders? */}
              {role === 'mentor' && (
              <button type="button" onClick={handleClickOpen} className={styles2.addModule}>
                + New Upload
              </button>
              )}
            </div>
          </div>
          <div className={styles2.tab_bar}>
            <button className={`${!favTab ? styles2.tab_selected : ''}`} type="button" onClick={() => { setFavTab(false); }}>All</button>
            <button className={`${favTab ? styles2.tab_selected : ''}`} type="button" onClick={() => { setFavTab(true); }}>Favorites</button>
          </div>
          <div className={styles.line} />
        </div>
      </div>

      {/* mapping each file in the array to a little card element onscreen */}
      {/* EDIT: COPIED FROM EXPANDED MODULE */}
      {mediaArray.map((file, index) => (
        <div key={file.url} className={styles2.fileContainer}>
          {(file.fileType.includes('image')) && (
          <div>
            <div className={styles2.preview} onClick={() => (handleClickOpenFilePopup(file))} role="presentation">
              <img className={styles2.displayImg} src={file.url} alt={file.fileName} />
            </div>
            <div className={styles2.descriptionContainer}>
              <div
                key={file.url}
                onMouseEnter={() => handleMouseEnter(file.url)}
                onMouseLeave={handleMouseLeave}
              >
                {(checked.length > 0) || (hoveredFile === file.url) || (checked.includes(file.url)) ? (
                  <Checkbox
                    checked={checked.includes(file.url)}
                    onChange={(event) => handleCheckboxChange(event, file.url)}
                    className={styles2.checkbox}
                  />
                ) : (<img src={imgIcon} alt="img icon" />)}
              </div>
              <div className={styles2.fileName}>{file.fileName}</div>
            </div>
          </div>
          )}
          {(file.fileType.includes('video')) && (
          <div>
            <div className={styles2.preview} onClick={() => (handleClickOpenFilePopup(file))} role="presentation">
              <video className={styles2.displayImg} controls src={file.url} alt={file.fileName}>
                <track default kind="captions" />
              </video>
            </div>
            <div className={styles2.descriptionContainer}>
              <div
                key={file.url}
                onMouseEnter={() => handleMouseEnter(file.url)}
                onMouseLeave={handleMouseLeave}
              >
                <img src={file.imageSrc} alt={file.name} />
                {(checked.length > 0) || (hoveredFile === file.url) || (checked.includes(file.url)) ? (
                  <Checkbox
                    checked={checked.includes(file.url)}
                    onChange={(event) => handleCheckboxChange(event, file.url)}
                    className={styles2.checkbox}
                  />
                ) : (<img src={vidIcon} alt="video icon" />)}
              </div>
              <div className={styles2.fileName}>{file.fileName}</div>
            </div>
          </div>
          )}
          {(file.fileType.includes('pdf')) && (
          <div>
            <div className={styles2.preview} onClick={() => (handleClickOpenFilePopup(file))} role="presentation">
              <embed className={styles2.displayImg} src={file.url} alt={file.fileName} />
            </div>
            <div className={styles2.descriptionContainer}>
              <div
                key={file.url}
                onMouseEnter={() => handleMouseEnter(file.url)}
                onMouseLeave={handleMouseLeave}
              >
                <img src={file.imageSrc} alt={file.name} />
                {(checked.length > 0) || (hoveredFile === file.url) || (checked.includes(file.url)) ? (
                  <Checkbox
                    checked={checked.includes(file.url)}
                    onChange={(event) => handleCheckboxChange(event, file.url)}
                    className={styles2.checkbox}
                  />
                ) : (<img src={pdfIcon} alt="pdf icon" />)}
              </div>
              <div className={`${styles2.fileName} ${styles2.pdf_preview}`} onClick={() => (handleClickOpenFilePopup(file))} role="presentation">{file.fileName}</div>
            </div>
          </div>
          )}
          {openFilePopups[index] && (
          <FilePopup
            file={fileToDisplay}
            open={openFilePopups[index]}
            handleClose={() => handleCloseFilePopup(file)}
          />
          )}
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
                <input type="file" name="files" required />
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
    mentees: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default Media;
