import { React, useState, useEffect } from 'react';
import PropTypes, { string } from 'prop-types';
import { Link } from 'react-router-dom';
import {
  ref, getStorage, getDownloadURL, getMetadata,
} from 'firebase/storage';
import {
  TextField, Button, Checkbox, IconButton,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ModeIcon from '@mui/icons-material/Mode';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilePopup from './FilePopup';
import imgIcon from '../assets/icons/file_img.svg';
import vidIcon from '../assets/icons/file_vid.svg';
import pdfIcon from '../assets/icons/file_pdf.svg';
import styles from '../styles/Modules.module.css';
import * as api from '../api';

function Module(props) {
  const {
    title, body, child, links, role, deleteChild, id, parent,
  } = props;

  const [files, setFiles] = useState([]);
  const [titleText, setTitleText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [editText, setEditText] = useState(false); // toggles edit button
  const [checked, setChecked] = useState([]);
  const [hoveredFile, setHoveredFile] = useState(null);
  const [fileToDisplay, setFileToDisplay] = useState({});
  const [open, setOpen] = useState(false);
  const [openDeleteFilesPopup, setOpenDeleteFilesPopup] = useState(false);

  const handleMouseEnter = (fileId) => {
    setHoveredFile(fileId);
  };

  const handleMouseLeave = () => {
    setHoveredFile(null);
  };

  const handleClickOpen = (file) => {
    setOpen(true);
    setFileToDisplay(file);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteFilesClose = () => {
    setOpenDeleteFilesPopup(false);
  };

  const handleCheckboxChange = (event, fileName) => {
    if (checked.includes(fileName)) {
      setChecked(checked.filter((file) => (file !== fileName)));
      return;
    }

    const isChecked = event.target.checked;
    setChecked(() => {
      if (isChecked) {
        return [...checked, fileName];
      }
      return checked.filter((file) => id !== file);
    });
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
  const setValueofBodyandTitle = (b, t) => {
    setBodyText(b);
    setTitleText(t);
  };
  useEffect(() => { updateImageURL(links); }, [links]);
  // Since page does not refresh when showing expanded module from root module, must manually change the text displayed when body/title changes
  useEffect(() => { setValueofBodyandTitle(body, title); }, [body, title]);

  const toggleEdit = async (save) => {
    setEditText(!editText);
    console.log('save is ', save);
    if (save) {
      // Only call firebase if edits were made
      if (bodyText !== body) {
        await api.updateTextField(bodyText, id, 'body');
      } else if (titleText !== title) {
        await api.updateTextField(titleText, id, 'title');
      }
    }
  };

  const deleteModule = async (moduleId) => { // calls api to delete modules, then removes that module from state children array in ExpandedModule
    api.deleteModule(moduleId).then(() => {
      // reloads the page
      deleteChild(moduleId);
    });
    // setOpenDeleteFilesPopup(false);
  };

  const clearCheckboxes = () => {
    setChecked([]);
    setOpenDeleteFilesPopup(false);
  };

  const deleteFiles = async (filesToDelete) => {
    api.deleteFiles(id, filesToDelete).then(() => {
      const tempFiles = [...files.filter((file) => !filesToDelete.includes(file.fileLink))];
      setFiles(tempFiles); // updates list of presenting files
      clearCheckboxes(); // resets checked state to be empty, gets rid of "selected" bar on the bottom side of page
    });
    setOpenDeleteFilesPopup(false);
  };

  return (
    <div>
      <div className={styles.titleContainer}>
        <div className={styles.backAndTitle}>
          <div className={styles.backContainer}>
            <IconButton>
              {parent != null ? (
                <Link to="/expanded-module" state={{ id: parent }} className={styles.backButton}>
                  <ArrowBackIcon />
                </Link>
              ) : (
                <Link to="/resources" className={styles.backButton}>
                  <ArrowBackIcon />
                </Link>
              )}
            </IconButton>
          </div>
          <div>
            {editText ? (
              <TextField
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                variant="outlined"
                multiline={false}
                className={styles.title}
              />
            ) : (
              <div className={styles.title}>{title}</div>
            )}
          </div>
        </div>
        <div className={styles.editAndAddFile}>
          <Button variant="outlined" className={styles.editButton} onClick={() => toggleEdit(editText)}>
            <ModeIcon />
            {editText ? ('Save') : ('Edit Text')}
          </Button>
        </div>
      </div>
      <div className={styles.bodyContainer}>
        {editText ? (
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
            <div className={styles.preview} onClick={() => (handleClickOpen(file))} role="presentation">
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
            <div className={styles.preview} onClick={() => (handleClickOpen(file))} role="presentation">
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
            <div className={styles.preview} onClick={() => (handleClickOpen(file))} role="presentation">
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
          {open && (
          <FilePopup
            file={fileToDisplay}
            open={open}
            handleClose={handleClose}
          />
          )}
        </div>
      ))}
      {
        child.map((kid) => (
          <div>
            <div className={styles.card}>
              <Link to="/expanded-module" state={{ id: kid.id }} key={kid.id}>
                <h1>{kid.title}</h1>
              </Link>
              {role === 'admin' && (
              <button className={styles.deleteButton} type="button" onClick={() => { deleteModule(kid.id); }}>
                {' '}
                Delete Module
                {' '}
                {kid.id}
                {' '}
              </button>
              )}
            </div>

          </div>
        ))
      }
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

Module.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  child: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    role: PropTypes.arrayOf(string).isRequired,
  })).isRequired,
  links: PropTypes.arrayOf(string),
  role: PropTypes.string.isRequired,
  deleteChild: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  parent: PropTypes.string.isRequired,
};

Module.defaultProps = {
  links: [],
};

export default Module;
