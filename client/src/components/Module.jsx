import { React, useState, useEffect } from 'react';
import PropTypes, { string } from 'prop-types';
import { Link } from 'react-router-dom';
import {
  ref, getStorage, getDownloadURL, getMetadata,
} from 'firebase/storage';
import {
  TextField, Button,
} from '@mui/material';
import styles from '../styles/Modules.module.css';
import * as api from '../api';

function Module(props) {
  const {
    title, body, child, links, role, deleteChild, id,
  } = props;

  const [files, setFiles] = useState([]);
  // const [value, setValue] = useState('');
  const [titleText, setTitleText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [editText, setEditText] = useState(false); // toggles edit button

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
        fileContents.push({ url, fileType, fileName });
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
  };
  return (
    <div>
      <div className={styles.title}>{title}</div>
      <div>
        {editText ? (
          <>
            <TextField
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              variant="outlined"
              multiline={false}
              className="styles.title" // TODO style title, body
            />
            <TextField
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              variant="outlined"
              multiline={false}
              className="styles.body"
            />
            <Button onClick={() => toggleEdit(true)}>
              Save
            </Button>
          </>
        ) : (
          <>
            <TextField
              value={titleText}
              InputProps={{ readOnly: true }}
              variant="outlined"
              multiline={false}
              className="styles.title"
            />
            <TextField
              value={bodyText}
              InputProps={{ readOnly: true }}
              variant="outlined"
              multiline={false}
            />
            <Button onClick={() => toggleEdit(false)}>
              Edit
            </Button>
          </>
        )}
      </div>
      {/* checks if file is img (png, jpg, jpeg), vid (np4, mpeg, mov), or pdf */}
      <div>
        {files.map((file) => {
          if (file.fileType === 'image/png' || file.fileType === 'image/jpeg') {
            return (
              <div key={file.url} className="image">
                {' '}
                <img src={file.url} alt={file.fileName} width="40%" height="auto" />
                <br />
              </div>
            );
          }
          if (file.fileType === 'video/mp4' || file.fileType === 'video/mpeg' || file.fileType === 'video/quicktime') {
            return (
              <div key={file.url} className="video">
                <video width="40%" height="auto" controls src={file.url} alt={file.fileName}>
                  <track default kind="captions" />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          }
          if (file.fileType === 'application/pdf') {
            return (
              <div key={file.url} className="pdf">
                <embed src={file.url} width="80%" height="800em" alt={file.fileName} />
              </div>
            );
          }
          return null;
        })}
      </div>
      {' '}
      {
        child.map((kid) => (
          <div>
            <div className={styles.card}>
              <Link to="/expanded-module" state={{ id: kid.id }} key={kid.id}>
                <h1>{kid.title}</h1>
              </Link>
              {role === 'admin' && (
              <button type="button" onClick={() => { deleteModule(kid.id); }}>
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
};

Module.defaultProps = {
  links: [],
};

export default Module;
