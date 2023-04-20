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
    title, body, child, links, id,
  } = props;

  const [files, setFiles] = useState([]);
  const [value, setValue] = useState('');
  const [editText, setEditText] = useState(false);

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
        fileContents.push({ url, fileType });
      }));
      setFiles(fileContents);
    }
  };
  const setValueofBody = (b) => {
    setValue(b);
  };
  useEffect(() => { updateImageURL(links); }, [links]);
  useEffect(() => { setValueofBody(body); }, [body]);
  const toggleEdit = async (save) => {
    setEditText(!editText);
    if (save) {
      console.log('value is ', value);
      await api.updateTextField(value, id);
    }
  };

  return (
    <div>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{body}</div>
      <div>
        {editText ? (
          <>
            <TextField
              value={value}
              onChange={(e) => setValue(e.target.value)}
              variant="outlined"
              multiline={false}
            />
            <Button onClick={() => toggleEdit(true)}>
              Save
            </Button>
          </>
        ) : (
          <>
            <TextField
              value={value}
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
              <div>
                {' '}
                {/* i want to use key={i} but eslint won't let me (will change to (file, i) above) :o */}
                {/* <div key={image} className="image"> */}
                <img src={file.url} alt="" width="40%" height="auto" />
                <br />
              </div>
            );
          }
          if (file.fileType === 'video/mp4' || file.fileType === 'video/mpeg' || file.fileType === 'video/quicktime') {
            return (
              <div>
                <video width="40%" height="auto" controls src={file.url}>
                  <track default kind="captions" />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          }
          if (file.fileType === 'application/pdf') {
            return (
              <div>
                <embed src={file.url} width="80%" height="800em" />
              </div>
            );
          }
          return null;
        })}
      </div>
      {/* add actual alt text for images */}
      {' '}
      {
        child.map((kid) => (
          <Link to="/expanded-module" state={{ id: kid.id }} key={kid.id}>
            <div className={styles.card}>
              <h1>{kid.title}</h1>
            </div>
          </Link>
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
  id: PropTypes.string.isRequired,
};

Module.defaultProps = {
  links: [''],
};

export default Module;
