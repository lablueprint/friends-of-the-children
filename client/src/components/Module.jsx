import { React, useState, useEffect } from 'react';
import PropTypes, { string } from 'prop-types';
import { Link } from 'react-router-dom';
import {
  ref, getStorage, getDownloadURL, getMetadata,
} from 'firebase/storage';
import styles from '../styles/Modules.module.css';

function Module(props) {
  const {
    title, body, child, links,
  } = props;

  const [files, setFiles] = useState([]);

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
      setFiles(fileContents);
    }
  };

  useEffect(() => { updateImageURL(links); }, [links]);

  return (
    <div>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{body}</div>
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
};

Module.defaultProps = {
  links: [],
};

export default Module;
