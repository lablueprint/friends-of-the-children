import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ref, uploadBytes, getDownloadURL, getMetadata,
} from 'firebase/storage';
// import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from '@mui/material';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FilePopup from '../components/FilePopup';
import styles from '../styles/Mentees.module.css';
import styles2 from '../styles/Modules.module.css';
import VideoIcon from '../assets/icons/videos_icon.svg';
import ImageIcon from '../assets/icons/images_icon.svg';
import FlyerIcon from '../assets/icons/flyers_icon.svg';
import LinkIcon from '../assets/icons/link_icon.svg';
import heartIcon from '../assets/icons/heart.svg';
import filledHeart from '../assets/icons/filled_heart.svg';
import imgIcon from '../assets/icons/file_img.svg';
import vidIcon from '../assets/icons/file_vid.svg';
import pdfIcon from '../assets/icons/file_pdf.svg';
import wordIcon from '../assets/icons/file_microsoft_word.svg';
import excelIcon from '../assets/icons/file_microsoft_excel.svg';
import linkIcon from '../assets/icons/file_link.svg';
import ClearedIcon from '../assets/icons/cleared.svg';
import NotClearedIcon from '../assets/icons/not_cleared.svg';
import HomeIcon from '../assets/icons/home.svg';
import PhoneIcon from '../assets/icons/phone-call.svg';
import CakeIcon from '../assets/icons/cake.svg';
import { storage } from './firebase';
import * as api from '../api';

function ExpandedMentee({ profile }) {
  const location = useLocation();
  const { menteeObj } = location.state;
  const {
    id, firstName, lastName, caregiverFirst, caregiverLast, address, phone, avatar,
  } = menteeObj;
  const [recents, setRecents] = useState([]);
  const [customFolders, setCustomFolders] = useState([]);
  const [defaultFolders, setDefaultFolders] = useState([]);
  const [fileUploadOpen, setfileUploadOpen] = useState(false);
  const [caregiverOpen, setCaregiverOpen] = useState(false);
  const [checked, setChecked] = useState([]);
  const [hoveredFile, setHoveredFile] = useState(null);
  const [openFilePopups, setOpenFilePopups] = useState(Array(recents.length).fill(false));
  const [openDeleteFilesPopup, setOpenDeleteFilesPopup] = useState(false);
  const [fileToDisplay, setFileToDisplay] = useState({});
  const [favorites, setFavorites] = useState([]); // array of favorite file objects
  const [isFile, setIsFile] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [cleared, setCleared] = useState();
  const [currAge, setCurrAge] = useState(0);
  const [favTab, setFavTab] = useState(false); // which tab you're on
  const role = (profile.role).toLowerCase();

  const createFileObjects = async (fileLinks) => {
    setRecents([]);
    const fileContents = [];
    if (fileLinks.length > 0) {
      await Promise.all(fileLinks.map(async (fileLink) => {
        // extract existing fields
        const {
          fileName, url, fileType, category, fileID,
        } = fileLink;

        // new fields to add to fileLink object
        let fileSize = '0.0 MB';
        let fileDate = 'July 1, 2023'; // PLACEHOLDER

        // get file size and file upload date if not a link
        if (fileType !== 'link') {
          const spaceRef = ref(storage, fileLink.url);
          const file = await getMetadata(spaceRef);
          fileSize = `${(file.size / 1048576).toFixed(1)} MB`;

          const timeString = file.timeCreated;
          const date = new Date(timeString);
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          fileDate = date.toLocaleString('en-US', options);
        }

        fileContents.push({
          url, fileType, fileName, category, fileSize, fileDate, fileID,
        });
      }));

      // sorting files by category alphabetically
      fileContents.sort((a, b) => {
        if (a.category < b.category) {
          return -1;
        }
        if (a.category > b.category) {
          return 1;
        }
        return 0;
      });

      setRecents(fileContents);
    }
  };

  // have all of the mentees' folders and root files display on page
  useEffect(() => {
    api.getMenteeFolders(id).then((res) => {
      if (res !== undefined) {
        const {
          tempFolders, customs, clear, age,
        } = res.data;
        setDefaultFolders(tempFolders);
        setCustomFolders(customs);
        setCleared(clear);
        setCurrAge(age);
      }
    });
    api.getMenteeFiles(id, 'Root').then((files) => {
      if (files) {
        createFileObjects(files.data);
      }
    });
    api.getMenteeFiles(id, 'favorites').then((files) => {
      if (files) {
        setFavorites(files.data);
      }
    });
  }, []);

  // called upon submitting the form that uploads new files
  const addMedia = (e) => {
    e.preventDefault();
    const fileName = e.target.title.value;
    const folderName = e.target.folders.value;
    const category = folderName === 'Root' ? 'All' : folderName;
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
          const tempArr = recents;
          const data = {
            fileID,
            fileName,
            url,
            fileType,
            category,
          };
          // add new file to corresponding folders in firebase + update recents array
          tempArr.push(data);
          createFileObjects(tempArr);
          api.addMenteeFile(id, folderName, data, fileType);
          setfileUploadOpen(false);
          e.target.reset();
        });
      });
    } else if (isLink) { // reading text input for links, not file input
      const url = e.target.link.value;
      // fileID = uuidv4(url);
      fileID = url;
      fileType = 'link';

      const tempArr = recents;
      const data = {
        fileName,
        url,
        fileType,
        fileID,
        category,
      };

      tempArr.push(data);
      createFileObjects(tempArr);
      api.addMenteeFile(id, folderName, data, fileType);
      setfileUploadOpen(false);
      e.target.reset();
    }
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

  // when click on caregiver info button
  const showCaregiver = () => {
    setCaregiverOpen(true);
  };

  // when close caregiver info popup
  const closeCaregiverInfo = () => {
    setCaregiverOpen(false);
  };

  // update the media clearance
  const updateClearance = () => {
    api.updateClearance(id, cleared);
    setCleared(!cleared);
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

  // opening file popup
  const handleClickOpenFilePopup = (file) => {
    const fileIndex = recents.findIndex((f) => f.url === file.url);
    const updatedOpenFilePopups = [...openFilePopups];
    updatedOpenFilePopups[fileIndex] = true;
    setOpenFilePopups(updatedOpenFilePopups);
    setFileToDisplay(file);
  };

  const handleCloseFilePopup = (file) => {
    const fileIndex = recents.findIndex((f) => f.url === file.url);
    const updatedOpenFilePopups = [...openFilePopups];
    updatedOpenFilePopups[fileIndex] = false;
    setOpenFilePopups(updatedOpenFilePopups);
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
      const tempFiles = [...recents.filter((file) => !filesToDelete.includes(file))];
      setRecents(tempFiles);
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
          <b>
            {`${firstName} ${lastName}`}
          </b>
        </p>
      </div>

      <div className={styles.profile_container}>
        <div>
          <div className={styles.container}>
            <div>
              <div className={styles.pfp}>
                <img className={styles.profile_pic} src={avatar} alt="" />
              </div>

              <div className={styles.user_info}>
                <h1>{`${firstName} ${lastName}`}</h1>
                <div style={{ display: 'inline-block' }}>
                  <img src={CakeIcon} alt="birthday cake" style={{ marginBottom: '7px' }} />
                  <p style={{ display: 'inline-block', margin: '0', marginLeft: '10px' }}>
                    {currAge}
                    {' '}
                    years old
                  </p>
                </div>
                <div className={styles.clearance}>
                  <button type="button" onClick={updateClearance}>
                    {cleared && <img alt="media clearance cleared" src={ClearedIcon} />}
                    {!cleared && <img alt="media clearance not cleared" src={NotClearedIcon} />}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.buttons}>
              <button type="button" onClick={showCaregiver} className={styles2.editModule}>
                Caregiver Info
              </button>

              {role === 'mentor' && (
              <button type="button" onClick={addNewFile} className={styles2.addModule}>
                + New Upload
              </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles2.tab_bar}>
        <button className={`${!favTab ? styles2.tab_selected : ''}`} type="button" onClick={() => { setFavTab(false); }}>All</button>
        <button className={`${favTab ? styles2.tab_selected : ''}`} type="button" onClick={() => { setFavTab(true); }}>Favorites</button>
      </div>
      <div className={styles.line} />

      {/* displaying the default folders */}
      <div className={styles.folders_map}>
        {defaultFolders.map((folder) => (
          folder !== 'Root' && (
            <div className={styles.folder_container}>
              <Link
                to={`./All_${folder}`}
                state={{
                  menteeObj: { ...menteeObj, folderName: folder },
                }}
              >
                <div className={styles.folder_content}>
                  {folder === 'Videos' && <img src={VideoIcon} alt="video icon" />}
                  {folder === 'Images' && <img src={ImageIcon} alt="images icon" />}
                  {folder === 'Flyers' && <img src={FlyerIcon} alt="flyer icon" />}
                  {folder === 'Links' && <img src={LinkIcon} className={styles.folder_container_linksImg} alt="links icon" />}

                  <p>{folder}</p>
                </div>
              </Link>
            </div>
          )
        ))}
      </div>

      {/* displaying the list of all files */}
      <div className={styles2.fieldSpan}>
        <h5>File Name</h5>
        <h5>File Size</h5>
        <h5>Date Uploaded</h5>
        <h5>Category</h5>
      </div>
      <div className={styles2.resourcesDisplay}>
        {/* conditional rendering based on which tab (All/Favorites) ur on */}
        {/* maps favorites array if on favorites tab; maps recents array otherwise */}
        {(favTab ? favorites : recents).map((file, index) => (
          <div key={file.fileID} className={styles2.spanContainer}>
            <div className={styles2.spanFile}>
              <div
                key={file.fileID}
                onMouseEnter={() => handleMouseEnter(file.fileName)}
                onMouseLeave={handleMouseLeave}
              >
                {(checked.length > 0) || (hoveredFile === file.fileName) || (checked.includes(file)) ? (
                  <Checkbox
                    checked={checked.includes(file)}
                    onChange={(event) => handleCheckboxChange(event, file)}
                    className={styles2.checkbox}
                  />
                ) : (
                  <>
                    {(file.fileType.includes('image')) && <img src={imgIcon} alt="img icon" />}
                    {(file.fileType.includes('video')) && <img src={vidIcon} alt="vid icon" />}
                    {((file.fileType.includes('pdf')) || file.fileType.includes('text')) && <img src={pdfIcon} alt="pdf icon" />}
                    {((file.fileType === 'link')) && <img className={styles.smaller_img} src={linkIcon} alt="link icon" />}
                    {(file.fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) && <img src={wordIcon} width="24" alt="word icon" />}
                    {(file.fileType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) && <img src={excelIcon} width="24" alt="excel icon" />}
                  </>
                )}
              </div>
              {file.fileType !== 'link' && (
                <div onClick={() => (handleClickOpenFilePopup(file))} role="presentation" className={styles2.fileName}>
                  {file.fileName}
                </div>
              )}
              {file.fileType === 'link' && (
              <a href={file.url} target="_blank" rel="noreferrer">
                <div className={styles2.fileName}>
                  {file.fileName}
                </div>
              </a>
              )}
              <div><h5>{file.fileSize}</h5></div>
              <div><h5>{file.fileDate}</h5></div>
              <h5>{file.category}</h5>
              <button
                type="button"
                className={styles2.heart_button}
                onClick={() => { handleFillHeart(index, file); }}
              >
                {favorites.some((element) => element.url === file.url) ? (
                  <img src={filledHeart} alt="favorite file" />
                ) : (
                  <img src={heartIcon} alt="not a favorite file" />
                )}
              </button>
            </div>
            {file.fileType !== 'link' && openFilePopups[index] && (
            <FilePopup
              file={fileToDisplay}
              open={openFilePopups[index]}
              handleClose={() => handleCloseFilePopup(file)}
            />
            )}
          </div>
        ))}
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
                  {customFolders.map((folder) => (
                    (
                      <option value={folder}>{folder}</option>
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

      {/* show caregiver info */}
      <Dialog
        open={caregiverOpen}
        onClose={closeCaregiverInfo}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '350px', // Set your width here
            },
          },
        }}
      >
        <DialogContent>
          <div className={styles.caregiverInfo}>
            <h5>
              {caregiverFirst}
              {' '}
              {caregiverLast}
            </h5>
            <div className={styles.caregiverLine} />
            <div className={styles.caregiverFlex}>
              <img src={HomeIcon} alt="home icon" />
              <p>{address}</p>
            </div>
            <div className={styles.caregiverFlex}>
              <img src={PhoneIcon} alt="phone icon" />
              <p>{phone}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* this is the deleting files dialog popup */}
      <div>
        { openDeleteFilesPopup && checked.length > 0
          ? (
            <div>
              <Dialog open={openDeleteFilesPopup} onClose={handleDeleteFilesClose}>
                <DialogTitle className={styles2.dialogTitle}>
                  You have chosen to delete
                  {' '}
                  {checked.length}
                  {' '}
                  {(checked.length) === 1 ? 'file ' : 'files '}
                </DialogTitle>
                <DialogContent>
                  <div>
                    <div className={styles2.confirmMessage}>
                      Are you sure you want to continue with this action?
                    </div>
                    <div className={styles2.confirmButtons}>
                      <button className={styles2.confirmCancel} type="button" onClick={() => (clearCheckboxes())}>
                        Cancel
                      </button>
                      <button type="button" className={styles2.confirmDelete} onClick={() => { deleteFiles(checked); }}>
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
            <div className={styles2.deleteFilesBar}>
              <div className={styles2.totalSelected}>
                <div className={styles2.selectedNumber}>
                  {checked.length}
                </div>
                <div className={styles2.selectedText}>
                  {' '}
                  selected
                </div>
              </div>
              <div className={styles2.cancelOrDelete}>
                <button className={styles2.cancelButton} type="button" onClick={() => (clearCheckboxes())}>
                  Cancel
                </button>
                <button type="button" className={styles2.deleteButton} onClick={() => (setOpenDeleteFilesPopup(true))}>
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

ExpandedMentee.propTypes = {
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

export default ExpandedMentee;
