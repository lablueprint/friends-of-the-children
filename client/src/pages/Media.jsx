import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ref, uploadBytes, getDownloadURL,
} from 'firebase/storage';
// import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {
  Checkbox,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import imgIcon from '../assets/icons/file_img.svg';
import vidIcon from '../assets/icons/file_vid.svg';
import pdfIcon from '../assets/icons/file_pdf.svg';
import wordIcon from '../assets/icons/file_microsoft_word.svg';
import excelIcon from '../assets/icons/file_microsoft_excel.svg';
import powerpointIcon from '../assets/icons/file_microsoft_powerpoint.svg';
import linkIcon from '../assets/icons/file_link.svg';
import heartIcon from '../assets/icons/heart.svg';
import filledHeart from '../assets/icons/filled_heart.svg';
import EditIcon from '../assets/icons/editicon.svg';
import FilePopup from '../components/FilePopup';
import styles from '../styles/Mentees.module.css';
import moduleStyles from '../styles/Modules.module.css';
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
  const [favorites, setFavorites] = useState([]); // array of favorite file objects
  const [fileToDisplay, setFileToDisplay] = useState({});
  const [openFilePopups, setOpenFilePopups] = useState(Array(mediaArray.length).fill(false));
  const [openDeleteFilesPopup, setOpenDeleteFilesPopup] = useState(false);

  // get the current folder contents on first load
  useEffect(() => {
    api.getMenteeFiles(id, folderName).then((files) => {
      setMediaArray(files.data);
    });
    api.getMenteeFiles(id, 'favorites').then((files) => {
      if (files) {
        const tempArr = [];
        (files.data).forEach((file) => {
          if (file.category === folderName) tempArr.push(file);
        });
        setFavorites(tempArr);
      }
    });
  }, [menteeObj]);

  // creates new object for the file, updates mediaArray, and calls updateMentee
  const addMedia = (e) => {
    e.preventDefault();
    const fileName = e.target.title.value;
    const category = folderName;
    let fileID;
    let fileType;

    if (isFile) {
      const files = e.target.files.files[0];
      // fileID = uuidv4(files.name);
      fileID = files.name;
      fileType = files.type;
      const storageRef = ref(storage, `/images/${fileID}`);
      uploadBytes(storageRef, files).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => { // get url of file through firebase
          const tempArr = mediaArray;
          const data = {
            fileID,
            fileName,
            url,
            fileType,
            category,
          };
          tempArr.push(data);
          setMediaArray(tempArr);
          api.addMenteeFile(id, folderName, data, fileType);
          setOpen(false);
          e.target.reset();
        });
      });
    } else if (isLink) { // reading text input for links, not file input
      const url = e.target.link.value;
      // fileID = uuidv4(url);
      fileID = url;
      fileType = 'link';

      const tempArr = mediaArray;
      const data = {
        fileName,
        url,
        fileType,
        fileID,
        category,
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

  const handleCheckboxChange = (event, fileObject) => {
    if (checked.includes(fileObject)) {
      setChecked(checked.filter((file) => (file !== fileObject)));
      return;
    }

    setChecked([...checked, fileObject]);
  };

  const clearCheckboxes = () => {
    setChecked([]);
    setOpenDeleteFilesPopup(false);
  };

  const handleDeleteFilesClose = () => {
    setOpenDeleteFilesPopup(false);
  };

  const deleteFiles = async (filesToDelete) => {
    api.deleteMenteeFiles({ menteeID: id, filesToDelete }).then(() => {
      const tempFiles = [...mediaArray.filter((file) => !filesToDelete.includes(file))];
      setMediaArray(tempFiles);
      const tempFavFiles = [...favorites.filter((file) => !filesToDelete.includes(file))];
      setFavorites(tempFavFiles);
      clearCheckboxes();
    })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFillHeart = (index, file) => {
    // revert the file object when storing into database
    const fileObj = {
      fileName: file.fileName,
      url: file.url,
      fileType: file.fileType,
      category: file.category,
      fileID: file.fileID,
    };
    // if heart is filled
    if (!favorites.some((element) => element.url === file.url)) {
      // update favorites state array (want the full file object)
      const tempFavs = [...favorites];
      tempFavs.push(file);
      setFavorites(tempFavs);
      // store this new state into the database (use reverted file object)
      api.updateFileLinksField(fileObj, id, 'files', 'addFile', 'mentees');
    } else {
      const tempFavs = favorites.filter((element) => element.url !== file.url);
      setFavorites(tempFavs);
      api.updateFileLinksField(fileObj, id, 'files', 'removeFile', 'mentees');
    }
  };

  return (
    <div className={styles.folders_page}>
      <div>
        <p>
          <Link to="/youth" className={styles.my_youth_link}>
            My Youth
          </Link>
          {' > '}
          {`${firstName} ${lastName} > `}
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
              {role === 'mentor' && (
              <button type="button" className={moduleStyles.editModule}>
                <img src={EditIcon} alt="edit icon" />
                Edit Module
              </button>
              )}

              {/* QUESTION: should users be able to directly add into the images/videos/flyers folders? */}
              {role === 'mentor' && (
              <button type="button" onClick={handleClickOpen} className={moduleStyles.addModule}>
                + New Upload
              </button>
              )}
            </div>
          </div>
          <div className={moduleStyles.tab_bar}>
            <button className={`${!favTab ? moduleStyles.tab_selected : ''}`} type="button" onClick={() => { setFavTab(false); }}>All</button>
            <button className={`${favTab ? moduleStyles.tab_selected : ''}`} type="button" onClick={() => { setFavTab(true); }}>Favorites</button>
          </div>
          <div className={styles.line} />
        </div>
      </div>

      {/* mapping each file in the array to a little card element onscreen */}
      {/* EDIT: COPIED FROM EXPANDED MODULE */}
      {(favTab ? favorites : mediaArray).map((file, index) => (
        <div key={file.fileID} className={moduleStyles.fileContainer}>
          {(file.fileType.includes('image')) && (
          <div>
            <div className={moduleStyles.preview} onClick={() => (handleClickOpenFilePopup(file))} role="presentation">
              <img className={moduleStyles.displayImg} src={file.url} alt={file.fileName} />
            </div>
            <div className={moduleStyles.descriptionContainer}>
              <div
                key={file.fileID}
                onMouseEnter={() => handleMouseEnter(file.url)}
                onMouseLeave={handleMouseLeave}
              >
                {(checked.length > 0) || (hoveredFile === file.url) || (checked.includes(file.url)) ? (
                  <Checkbox
                    checked={checked.includes(file)}
                    onChange={(event) => handleCheckboxChange(event, file)}
                    className={moduleStyles.checkbox}
                  />
                ) : (<img src={imgIcon} alt="img icon" />)}
              </div>
              <div className={moduleStyles.fileName}>{file.fileName}</div>
            </div>
          </div>
          )}
          {(file.fileType.includes('video')) && (
          <div>
            <div className={moduleStyles.preview} onClick={() => (handleClickOpenFilePopup(file))} role="presentation">
              <video className={moduleStyles.displayImg} controls src={file.url} alt={file.fileName}>
                <track default kind="captions" />
              </video>
            </div>
            <div className={moduleStyles.descriptionContainer}>
              <div
                key={file.fileID}
                onMouseEnter={() => handleMouseEnter(file.url)}
                onMouseLeave={handleMouseLeave}
              >
                <img src={file.imageSrc} alt={file.name} />
                {(checked.length > 0) || (hoveredFile === file.url) || (checked.includes(file)) ? (
                  <Checkbox
                    checked={checked.includes(file.url)}
                    onChange={(event) => handleCheckboxChange(event, file)}
                    className={moduleStyles.checkbox}
                  />
                ) : (<img src={vidIcon} alt="video icon" />)}
              </div>
              <div className={moduleStyles.fileName}>{file.fileName}</div>
            </div>
          </div>
          )}
          {(file.fileType.includes('pdf')) && (
          <div>
            <div className={moduleStyles.preview} onClick={() => (handleClickOpenFilePopup(file))} role="presentation">
              <embed className={moduleStyles.displayImg} src={file.url} alt={file.fileName} />
            </div>
            <div className={moduleStyles.descriptionContainer}>
              <div
                key={file.fileID}
                onMouseEnter={() => handleMouseEnter(file.url)}
                onMouseLeave={handleMouseLeave}
              >
                <img src={file.imageSrc} alt={file.name} />
                {(checked.length > 0) || (hoveredFile === file.url) || (checked.includes(file.url)) ? (
                  <Checkbox
                    checked={checked.includes(file)}
                    onChange={(event) => handleCheckboxChange(event, file)}
                    className={moduleStyles.checkbox}
                  />
                ) : (<img src={pdfIcon} alt="pdf icon" />)}
              </div>
              <div className={`${moduleStyles.fileName} ${moduleStyles.pdf_preview}`} onClick={() => (handleClickOpenFilePopup(file))} role="presentation">{file.fileName}</div>
            </div>
          </div>
          )}
          {(file.fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) && (
          <div>
            <a href={`${file.url}`}>
              <div className={moduleStyles.preview} />
            </a>
            <div className={moduleStyles.descriptionContainer}>
              <div
                key={file.fileLink}
                onMouseEnter={() => handleMouseEnter(file.fileLink)}
                onMouseLeave={handleMouseLeave}
              >
                <img src={file.imageSrc} alt={file.name} />
                {(checked.length > 0) || (hoveredFile === file.fileLink) || (checked.includes(file.fileLink)) ? (
                  <Checkbox
                    checked={checked.includes(file.fileLink)}
                    onChange={(event) => handleCheckboxChange(event, file.fileLink)}
                    className={moduleStyles.checkbox}
                  />
                ) : (<img src={wordIcon} width="24" alt="word icon" />)}
              </div>
              <div className={moduleStyles.fileName}>{file.fileName}</div>
            </div>
          </div>
          )}
          {(file.fileType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) && (
          <div>
            <a href={`${file.url}`}>
              <div className={moduleStyles.preview} />
            </a>
            <div className={moduleStyles.descriptionContainer}>
              <div
                key={file.fileLink}
                onMouseEnter={() => handleMouseEnter(file.fileLink)}
                onMouseLeave={handleMouseLeave}
              >
                <img src={file.imageSrc} alt={file.name} />
                {(checked.length > 0) || (hoveredFile === file.fileLink) || (checked.includes(file.fileLink)) ? (
                  <Checkbox
                    checked={checked.includes(file.fileLink)}
                    onChange={(event) => handleCheckboxChange(event, file.fileLink)}
                    className={moduleStyles.checkbox}
                  />
                ) : (<img src={excelIcon} width="24" alt="excel icon" />)}
              </div>
              <div className={moduleStyles.fileName}>{file.fileName}</div>
            </div>
          </div>
          )}
          {(file.fileType.includes('application/vnd.openxmlformats-officedocument.presentationml.presentation')) && (
          <div>
            <a href={`${file.url}`}>
              <div className={moduleStyles.preview} />
            </a>
            <div className={moduleStyles.descriptionContainer}>
              <div
                key={file.fileLink}
                onMouseEnter={() => handleMouseEnter(file.fileLink)}
                onMouseLeave={handleMouseLeave}
              >
                <img src={file.imageSrc} alt={file.name} />
                {(checked.length > 0) || (hoveredFile === file.fileLink) || (checked.includes(file.fileLink)) ? (
                  <Checkbox
                    checked={checked.includes(file.fileLink)}
                    onChange={(event) => handleCheckboxChange(event, file.fileLink)}
                    className={moduleStyles.checkbox}
                  />
                ) : (<img src={powerpointIcon} width="24" alt="powerpoint icon" />)}
              </div>
              <div className={moduleStyles.fileName}>{file.fileName}</div>
            </div>
          </div>
          )}
          {(file.fileType === 'link') && (
          <div>
            <a href={file.url} target="_blank" rel="noreferrer">
              <div className={moduleStyles.preview}>
                <embed className={moduleStyles.displayImg} src={file.url} alt={file.fileName} />
              </div>
              <div className={moduleStyles.descriptionContainer}>
                <div
                  key={file.fileID}
                  onMouseEnter={() => handleMouseEnter(file.url)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img src={file.imageSrc} alt={file.name} />
                  {(checked.length > 0) || (hoveredFile === file.url) || (checked.includes(file.url)) ? (
                    <Checkbox
                      checked={checked.includes(file)}
                      onChange={(event) => handleCheckboxChange(event, file)}
                      className={moduleStyles.checkbox}
                    />
                  ) : (<img className={styles.smaller_img} src={linkIcon} alt="link icon" />)}
                </div>
                <div className={`${moduleStyles.fileName} ${moduleStyles.pdf_preview}`}>{file.fileName}</div>
              </div>
            </a>
          </div>
          )}

          <button
            type="button"
            className={styles.heart_button}
            onClick={() => { handleFillHeart(index, file); }}
          >
            {favorites.some((element) => element.url === file.url) ? (
              <img src={filledHeart} alt="favorite file" />
            ) : (
              <img src={heartIcon} alt="not a favorite file" />
            )}
          </button>

          {file.fileType !== 'link' && openFilePopups[index] && (
            <FilePopup
              file={fileToDisplay}
              open={openFilePopups[index]}
              handleClose={() => handleCloseFilePopup(file)}
            />
          )}
        </div>
      ))}

      {/* uploading media dialog popup */}
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

      {/* this is the deleting files dialog popup */}
      <div>
        { openDeleteFilesPopup && checked.length > 0
          ? (
            <div>
              <Dialog open={openDeleteFilesPopup} onClose={handleDeleteFilesClose}>
                <DialogTitle className={moduleStyles.dialogTitle}>
                  You have chosen to delete
                  {' '}
                  {checked.length}
                  {' '}
                  {(checked.length) === 1 ? 'file ' : 'files '}
                </DialogTitle>
                <DialogContent>
                  <div>
                    <div className={moduleStyles.confirmMessage}>
                      Are you sure you want to continue with this action?
                    </div>
                    <div className={moduleStyles.confirmButtons}>
                      <button className={moduleStyles.confirmCancel} type="button" onClick={() => (clearCheckboxes())}>
                        Cancel
                      </button>
                      <button type="button" className={moduleStyles.confirmDelete} onClick={() => { deleteFiles(checked); }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )
          : <div />}
      </div>
      <div>
        { (checked.length > 0)
          ? (
            <div className={moduleStyles.deleteFilesBar}>
              <div className={moduleStyles.totalSelected}>
                <div className={moduleStyles.selectedNumber}>
                  {checked.length}
                </div>
                <div className={moduleStyles.selectedText}>
                  {' '}
                  selected
                </div>
              </div>
              <div className={moduleStyles.cancelOrDelete}>
                <button className={moduleStyles.cancelButton} type="button" onClick={() => (clearCheckboxes())}>
                  Cancel
                </button>
                <button type="button" className={moduleStyles.deleteButton} onClick={() => (setOpenDeleteFilesPopup(true))}>
                  Delete
                </button>
              </div>
            </div>
          )
          : <div />}
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
    image: PropTypes.string.isRequired,
    mentees: PropTypes.arrayOf(PropTypes.string).isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default Media;
