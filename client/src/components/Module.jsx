import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from '../styles/Modules.module.css';
import {
  ref, getStorage, uploadBytesResumable, getDownloadURL, listAll, 
} from 'firebase/storage';
import { db, storage } from '../pages/firebase';



function Module(props) {

  const {
    title, body, attachments, child, link,
  } = props;

  const [img, setImg] = useState('');

  const setImageURL = (link) => {
    if(link.length > 0) {
      const storage = getStorage();
      const spaceRef = ref(storage, link);
      getDownloadURL(spaceRef).then((url) => {
        setImg(url);
      }).catch((error) => {
        console.log(error.message);
      })
    
    }
  };

  useEffect(() => {setImageURL(link)}, [link]);

  if(link.length === 0 || img.length === 0) return null;

  return (
    <div>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{body}</div>
      <div className={styles.attachments}>{attachments}</div>
      {/* keep bottom code for reference */}
      {/* <div>
        {link.map((image) => {
            return (
              <div key={image} className="image">
                  <img src={image} alt="" width="40%" height="auto" />
              </div>
            );
        })}
      </div> */}
      <img src={img} alt="" width="30%" height="auto" />
      {
        child.map((kid) => (
          <Link to="/expanded-module" state={{ id: kid.id }}>
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
  attachments: PropTypes.string.isRequired,
  child: PropTypes.array.isRequired,
  link: PropTypes.string.isRequired,
};

Module.defaultProps = {
  title: '',
  body: '',
  attachments: '',
  child: [],
  link: '',
};

export default Module;
