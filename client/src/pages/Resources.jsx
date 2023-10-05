import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ref, getStorage, getDownloadURL, getMetadata,
} from 'firebase/storage';
import { Checkbox } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FilePopup from '../components/FilePopup';
import heartIcon from '../assets/icons/heart.svg';
import filledHeart from '../assets/icons/filled_heart.svg';
import imgIcon from '../assets/icons/file_img.svg';
import vidIcon from '../assets/icons/file_vid.svg';
import pdfIcon from '../assets/icons/file_pdf.svg';
import wordIcon from '../assets/icons/file_microsoft_word.svg';
import excelIcon from '../assets/icons/file_microsoft_excel.svg';
import * as api from '../api';
import styles from '../styles/Modules.module.css';
import NewFilePopup from '../components/NewFilePopup';

// root page for all modules, displays Module components to the user
// admin can select Modules to delete or edit, or add new Modules
function Resources({ profile }) {
  const [files, setFiles] = useState([]);
  const [fileToDisplay, setFileToDisplay] = useState({});
  const [checked, setChecked] = useState([]);
  const [hoveredFile, setHoveredFile] = useState(null);
  const [openDeleteFilesPopup, setOpenDeleteFilesPopup] = useState(false);
  const [favorites, setFavorites] = useState([]); // array of favorite file objects
  const [favTab, setFavTab] = useState(false); // which tab you're on
  const [openFilePopups, setOpenFilePopups] = useState(Array(files.length).fill(false));
  const [openNewFilePopup, setOpenNewFilePopup] = useState(false);
  const { role } = profile;
  const currRole = role.toLowerCase();

  const createFileObjects = async (fileLinks) => {
    setFiles([]);
    const fileContents = [];
    if (fileLinks.length > 0) {
      await Promise.all(fileLinks.map(async (fileLink) => {
        const storage = getStorage();
        const spaceRef = ref(storage, fileLink.file);
        const file = await getMetadata(spaceRef);
        const fileType = file.contentType;
        const url = await getDownloadURL(spaceRef);
        const fileName = file.name;
        const fileSize = `${(file.size / 1048576).toFixed(1)} MB`;

        const timeString = file.timeCreated;
        const date = new Date(timeString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const fileDate = date.toLocaleString('en-US', options);

        const { category } = fileLink;
        fileContents.push({
          url, fileType, fileName, category, fileSize, fileDate, id: fileLink.id,
        });
      }));
      // sorting files alphabetically
      fileContents.sort((a, b) => {
        if (a.category < b.category) {
          return -1;
        }
        if (a.category > b.category) {
          return 1;
        }
        return 0;
      });
      setFiles(fileContents);
    }
  };

  // getting all modules relevant to current user
  const fetchData = async () => {
    const { data } = await api.getModules(currRole);
    setFavorites(data.favoriteFiles);
    createFileObjects(data.rootFiles);
  };

  // TODO: implement deleteModules to delete all modules, not just one at a time
  // const deleteFiles = async (filesToDelete) => {
  //   api.deleteFiles(id, filesToDelete).then(() => {
  //     const tempFiles = [...files.filter((file) => !filesToDelete.includes(file.fileLink))];
  //     setFiles(tempFiles); // updates list of presenting files
  //     clearCheckboxes(); // resets checked state to be empty, gets rid of "selected" bar on the bottom side of page
  //   });
  // };

  // opening file popup
  const handleClickOpenFilePopup = (file) => {
    const fileIndex = files.findIndex((f) => f.url === file.url);
    const updatedOpenFilePopups = [...openFilePopups];
    updatedOpenFilePopups[fileIndex] = true;
    setOpenFilePopups(updatedOpenFilePopups);
    setFileToDisplay(file);
  };

  const handleCloseFilePopup = (file) => {
    const fileIndex = files.findIndex((f) => f.url === file.url);
    const updatedOpenFilePopups = [...openFilePopups];
    updatedOpenFilePopups[fileIndex] = false;
    setOpenFilePopups(updatedOpenFilePopups);
  };

  const handleClickOpenNewFile = () => {
    setOpenNewFilePopup(true);
  };

  const handleClose = () => {
    setOpenNewFilePopup(false);
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
    const deletePromises = filesToDelete.map((file) => api.deleteFiles(file.id, [`files/${file.fileName}`]));

    Promise.all(deletePromises)
      .then(() => {
        const tempFiles = [...files.filter((file) => !filesToDelete.includes(file))];
        setFiles(tempFiles);
        clearCheckboxes();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFillHeart = (index, file) => {
    // if heart is filled
    if (!favorites.some((element) => element.url === file.url)) {
      // update favorites state array
      const tempFavs = [...favorites];
      tempFavs.push(file);
      setFavorites(tempFavs);
      // store this new state into the database
      api.updateFileLinksField(file, 'favorites', 'fileLinks', 'addFile', 'modules');
    } else {
      const tempFavs = favorites.filter((element) => element.url !== file.url);
      setFavorites(tempFavs);
      api.updateFileLinksField(file, 'favorites', 'fileLinks', 'removeFile', 'modules');
    }
  };

  // empty dependency array means getModules is only being called on page load
  useEffect(() => {
    // saving all the user profiles from Firebase in an array (useProfiles) only on first load
    fetchData().catch(console.error);
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.pageTitle}>
          All Resources
        </div>
        <div className={styles.editOrAddModule}>
          <div className={styles.editModuleContainer} />
          {/* ADDING A FILE HERE ADDS TO THE ROOT DOC OF MODULES */}
          <button type="button" onClick={handleClickOpenNewFile} className={styles.addModule}>
            + Add Media
          </button>
          <NewFilePopup open={openNewFilePopup} handleClose={handleClose} currModuleFiles={[]} id="root" />
        </div>
      </div>

      <div className={styles.tab_bar}>
        <button className={`${!favTab ? styles.tab_selected : ''}`} type="button" onClick={() => { setFavTab(false); }}>All</button>
        <button className={`${favTab ? styles.tab_selected : ''}`} type="button" onClick={() => { setFavTab(true); }}>Favorites</button>
      </div>
      <div className={styles.line} />

      <div className={styles.resourcesContainer}>
        <div className={styles.fieldSpan}>
          <h5>File Name</h5>
          <h5>File Size</h5>
          <h5>Date Uploaded</h5>
          <h5>Category</h5>
        </div>
        <div className={styles.resourcesDisplay}>
          {/* conditional rendering based on which tab (All/Favorites) ur on */}
          {(favTab ? favorites : files).map((file, index) => (
            <div key={file.url} className={styles.spanContainer}>
              <div className={styles.spanFile}>
                <div
                  key={file.fileName}
                  onMouseEnter={() => handleMouseEnter(file.fileName)}
                  onMouseLeave={handleMouseLeave}
                >
                  {(checked.length > 0) || (hoveredFile === file.fileName) || (checked.includes(file)) ? (
                    <Checkbox
                      checked={checked.includes(file)}
                      onChange={(event) => handleCheckboxChange(event, file)}
                      className={styles.checkbox}
                    />
                  ) : (
                    <>
                      {(file.fileType.includes('image')) && <img src={imgIcon} alt="img icon" />}
                      {(file.fileType.includes('video')) && <img src={vidIcon} alt="vid icon" />}
                      {((file.fileType.includes('pdf')) || file.fileType.includes('text')) && <img src={pdfIcon} alt="pdf icon" />}
                      {(file.fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) && <img src={wordIcon} width="24" alt="word icon" />}
                      {(file.fileType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) && <img src={excelIcon} width="24" alt="excel icon" />}
                    </>
                  )}
                </div>
                <div onClick={() => (handleClickOpenFilePopup(file))} role="presentation" className={styles.fileName}>
                  {file.fileName}
                </div>
                <div><h5>{file.fileSize}</h5></div>
                <div><h5>{file.fileDate}</h5></div>
                <h5>{file.category}</h5>
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
              </div>
              {openFilePopups[index] && (
                <FilePopup
                  file={fileToDisplay}
                  open={openFilePopups[index]}
                  handleClose={() => handleCloseFilePopup(file)}
                />
              )}
            </div>
          ))}
        </div>
        {/* this is the deleting files dialog popup */}
        <div>
          { openDeleteFilesPopup && checked.length > 0
            ? (
              <div>
                <Dialog open={openDeleteFilesPopup} onClose={handleDeleteFilesClose}>
                  <DialogTitle className={styles.dialogTitle}>
                    You have chosen to delete
                    {' '}
                    {checked.length}
                    {' '}
                    {(checked.length) === 1 ? 'file ' : 'files '}
                  </DialogTitle>
                  <DialogContent>
                    <div>
                      <div className={styles.confirmMessage}>
                        Are you sure you want to continue with this action?
                      </div>
                      <div className={styles.confirmButtons}>
                        <button className={styles.confirmCancel} type="button" onClick={() => (clearCheckboxes())}>
                          Cancel
                        </button>
                        <button type="button" className={styles.confirmDelete} onClick={() => { deleteFiles(checked); }}>
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
              <div className={styles.deleteFilesBar}>
                <div className={styles.totalSelected}>
                  <div className={styles.selectedNumber}>
                    {checked.length}
                  </div>
                  <div className={styles.selectedText}>
                    {' '}
                    selected
                  </div>
                </div>
                <div className={styles.cancelOrDelete}>
                  <button className={styles.cancelButton} type="button" onClick={() => (clearCheckboxes())}>
                    Cancel
                  </button>
                  <button type="button" className={styles.deleteButton} onClick={() => (setOpenDeleteFilesPopup(true))}>
                    Delete
                  </button>
                </div>
              </div>
            )
            : <div />}
        </div>
      </div>
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
    image: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    google: PropTypes.bool,
    mentees: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
export default Resources;
