import {
  React, useState, useEffect,
} from 'react';
import {
  ref, getStorage, getDownloadURL, getMetadata,
} from 'firebase/storage';
import PropTypes from 'prop-types';
import { useLocation, Link } from 'react-router-dom';
// import Button from '@mui/material/Button';
// import Module from '../components/Module';
import {
  TextField, Checkbox, IconButton,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// import ModeIcon from '@mui/icons-material/Mode';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilePopup from '../components/FilePopup';
import imgIcon from '../assets/icons/file_img.svg';
import vidIcon from '../assets/icons/file_vid.svg';
import pdfIcon from '../assets/icons/file_pdf.svg';
import editIcon from '../assets/icons/editicon.svg';
import styles from '../styles/Modules.module.css';

import NewModulePopup from '../components/NewModulePopup';
import NewFilePopup from '../components/NewFilePopup';
import Module from '../components/Module';
import * as api from '../api';

// Loads additional modules once user clicks into a root module
function ExpandedModule({ profile }) {
  const { role } = profile;
  const location = useLocation();
  const { id } = location.state;
  const [title, setTitle] = useState('');
  const [ParentTitle, setParentTitle] = useState('');
  const [body, setBody] = useState('');
  const [parent, setParent] = useState();
  const [children, setChildren] = useState([]);
  const currRole = role.toLowerCase();
  const [openNewUploadPopup, setOpenNewUploadPopup] = useState(false);
  const [openNewModulePopup, setOpenNewModulePopup] = useState(false);
  const [openNewFilePopup, setOpenNewFilePopup] = useState(false);
  const [openFilePopup, setOpenFilePopup] = useState(false);

  const [currModuleFiles, setCurrModuleFiles] = useState([]);

  const [files, setFiles] = useState([]);
  const [titleText, setTitleText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [editModule, setEditModule] = useState(false);
  // const [saveModuleChanges, setSaveModuleChanges] = useState(false);
  const [checked, setChecked] = useState([]);
  const [hoveredFile, setHoveredFile] = useState(null);
  const [fileToDisplay, setFileToDisplay] = useState({});
  const [openDeleteFilesPopup, setOpenDeleteFilesPopup] = useState(false);

  const getModulebyIdfunc = async (tempId, tempcurrRole) => {
    // data object structured as {data, children_array}
    const { data } = await api.getModulebyId(tempId, tempcurrRole);
    return data;
  };

  const getModule = () => { // gets data object from api using async "wrapper function" above
    // getModule cannot be async because it is used in the useEffect
    setChildren([]);
    getModulebyIdfunc(id, currRole).then((object) => {
      setTitle(object.data.title);
      setBody(object.data.body);
      setParent(object.data.parent);
      setChildren(object.childrenArray);
      setCurrModuleFiles(object.data.fileLinks);
      return object.data.parent;
    }).then((parentID) => {
      if (parentID !== null) {
        getModulebyIdfunc(parentID, currRole).then((object) => {
          setParentTitle(object.data.title);
        });
      }
    });
  };

  const updateModule = (data) => {
    setChildren([...children, data]);
  };

  // opening add module popup
  const handleClickOpen = () => {
    setOpenNewUploadPopup(true);
  };

  const handleClickOpenNewModule = () => {
    setOpenNewModulePopup(true);
  };

  const handleClickOpenNewFile = () => {
    setOpenNewFilePopup(true);
  };

  // opening file popup
  const handleClickOpenFilePopup = (file) => {
    setOpenFilePopup(true);
    setFileToDisplay(file);
  };

  const handleClose = () => {
    setOpenNewUploadPopup(false);
    setOpenNewModulePopup(false);
    setOpenNewFilePopup(false);
  };

  const handleCloseFilePopup = () => {
    setOpenFilePopup(false);
  };

  const handleDeleteFilesClose = () => {
    setOpenDeleteFilesPopup(false);
  };

  useEffect(getModule, [id, currRole]); // possible TODO: refresh in dependency list

  const deleteChild = (childId) => {
    setChildren(children.filter((child) => child.id !== childId));
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

  const updateImageURL = async (fileLinks) => { // i'm gonna be slow bc i contain a Promise function!
    setFiles([]);
    const fileContents = [];
    if (fileLinks.length > 0) {
      await Promise.all(fileLinks.map(async (fileLink) => { // i'm also gonna be slow bc i contain a Promise function!
        const storage = getStorage();
        const spaceRef = ref(storage, fileLink);
        const file = await getMetadata(spaceRef); // getMetadata is a promise function,
        // ^ so it's very slow (you need to wait for it to be fulfilled before u do anything w it)
        const fileType = file.contentType;
        const url = await getDownloadURL(spaceRef);
        const fileName = file.name;
        fileContents.push({
          url, fileType, fileName, fileLink,
        });
      }));
      // sorting files alphabetically TODO: is this how you want it?
      fileContents.sort((a, b) => {
        if (a.fileName < b.fileName) {
          return -1;
        }
        if (a.fileName > b.fileName) {
          return 1;
        }
        return 0;
      });
      setFiles(fileContents);
    }
  };

  const updateBodyAndTitleFirebase = async () => {
    // Only call firebase if edits were made
    if (titleText !== title && bodyText !== body) {
      await Promise.all([api.updateTextField(titleText, id, 'title'), api.updateTextField(bodyText, id, 'body')]);
    } else if (titleText !== title) {
      await api.updateTextField(titleText, id, 'title');
    } else if (bodyText !== body) {
      await api.updateTextField(bodyText, id, 'body');
    }
  };

  const displayCheckBoxes = () => {
    setEditModule(true);
  };

  useEffect(() => { updateImageURL(currModuleFiles); }, [currModuleFiles]);
  // Since page does not refresh when showing expanded module from root module, must manually change the text displayed when body/title changes
  useEffect(() => { setBodyText(body); }, [body]);
  useEffect(() => { setTitleText(title); }, [title]);

  const deleteModule = async (moduleId) => { // calls api to delete modules, then removes that module from state children array in ExpandedModule
    if (checked.length > 0) {
      api.deleteModule(moduleId).then(() => {
        // reloads the page
        deleteChild(moduleId);
      });
    }
    setOpenDeleteFilesPopup(false);
    setEditModule(false);
  };

  const clearCheckboxes = () => {
    setChecked([]);
    setOpenDeleteFilesPopup(false);
    setEditModule(false);
  };

  const deleteFiles = async (filesToDelete) => {
    api.deleteFiles(id, filesToDelete).then(() => {
      const tempFiles = [...files.filter((file) => !filesToDelete.includes(file.fileLink))];
      setFiles(tempFiles); // updates list of presenting files
      clearCheckboxes(); // resets checked state to be empty, gets rid of "selected" bar on the bottom side of page
    });
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.backAndTitle}>
          <div className={styles.backContainer}>
            <IconButton>
              {parent != null ? (
                <Link to={`/resources/${ParentTitle}`} state={{ id: parent, parentTitle: ParentTitle }} className={styles.backButton}>
                  <ArrowBackIcon />
                </Link>
              ) : (
                <Link to="/resources/All" className={styles.backButton}>
                  <ArrowBackIcon />
                </Link>
              )}
            </IconButton>
          </div>
          <div className={styles.title}>
            {editModule ? (
              <TextField
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                variant="outlined"
                multiline={false}
              />
            ) : (
              <div>{titleText}</div>
            )}
          </div>
        </div>
        {editModule ? (
          <div className={styles.cancelOrSave}>
            <button className={styles.cancelModuleChanges} type="button" onClick={() => (clearCheckboxes())}>
              Cancel
            </button>
            <button
              type="button"
              className={styles.saveModuleChanges}
              onClick={() => {
                deleteModule(checked);
                updateBodyAndTitleFirebase();
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <div className={styles.editOrAddModule}>
            <div className={styles.editModuleContainer}>
              <button type="button" onClick={displayCheckBoxes} className={styles.editModule}>
                <img src={editIcon} alt="edit icon" />
                Edit Module
              </button>
            </div>
            <button type="button" onClick={handleClickOpen} className={styles.addModule}>
              + New Upload
            </button>
            <Dialog
              open={openNewUploadPopup}
              onClose={handleClose}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <DialogContent>
                <button type="button" onClick={handleClickOpenNewFile} className={styles.addModule}>
                  New File
                </button>
                <NewFilePopup open={openNewFilePopup} handleClose={handleClose} currModuleFiles={currModuleFiles} id={id} />
                <button type="button" onClick={handleClickOpenNewModule} className={styles.addModule}>
                  New Folder
                </button>
                <NewModulePopup
                  updateModule={updateModule}
                  open={openNewModulePopup}
                  handleClose={handleClose}
                  parentID={id}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className={styles.content_container}>
        <div className={styles.cards_container}>
          {
            children.map((kid) => (
              <div className={styles.filecards}>
                <Module id={kid.id} title={kid.title} role={currRole} deleteModule={deleteModule} />
              </div>
            ))
          }
        </div>
        <div className={styles.bodyContainer}>
          {editModule ? (
            <TextField
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              variant="outlined"
              multiline={false}
              className={styles.body}
            />
          ) : (
            <TextField
              value={bodyText}
              InputProps={{ readOnly: true }}
              variant="outlined"
              multiline={false}
              className={styles.body}
            />
          )}
        </div>

        {/* checks if file is img (png, jpg, jpeg), vid (np4, mpeg, mov), or pdf */}
        {files.map((file) => (
          <div className={styles.fileContainer}>
            {(file.fileType.includes('image')) && (
            <div key={file.url}>
              <div className={styles.preview} onClick={() => (handleClickOpenFilePopup(file))} role="presentation">
                <img className={styles.displayImg} src={file.url} alt={file.fileName} />
              </div>
              <div className={styles.descriptionContainer}>
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
                      className={styles.checkbox}
                    />
                  ) : (<img src={imgIcon} alt="img icon" />)}
                </div>
                <div className={styles.fileName}>{file.fileName}</div>
              </div>
            </div>
            )}
            {(file.fileType.includes('video')) && (
            <div key={file.url}>
              <div className={styles.preview} onClick={() => (handleClickOpenFilePopup(file))} role="presentation">
                <video className={styles.displayImg} controls src={file.url} alt={file.fileName}>
                  <track default kind="captions" />
                </video>
              </div>
              <div className={styles.descriptionContainer}>
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
                      className={styles.checkbox}
                    />
                  ) : (<img src={vidIcon} alt="video icon" />)}
                </div>
                <div className={styles.fileName}>{file.fileName}</div>
              </div>
            </div>
            )}
            {(file.fileType.includes('pdf')) && (
            <div key={file.url}>
              <div className={styles.preview} onClick={() => (handleClickOpenFilePopup(file))} role="presentation">
                <embed className={styles.preview} src={file.url} alt={file.fileName} />
              </div>
              <div className={styles.descriptionContainer}>
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
                      className={styles.checkbox}
                    />
                  ) : (<img src={pdfIcon} alt="pdf icon" />)}
                </div>
                <div className={styles.fileName}>{file.fileName}</div>
              </div>
            </div>
            )}
            {openFilePopup && (
            <FilePopup
              file={fileToDisplay}
              open={openFilePopup}
              handleClose={handleCloseFilePopup}
            />
            )}
          </div>
        ))}
      </div>

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
                  from
                  {' '}
                  {title}
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
                      <button type="button" className={styles.confirmDelete} onClick={() => (deleteFiles(checked))}>
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
        { checked.length > 0
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
  );
}

ExpandedModule.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};
export default ExpandedModule;
