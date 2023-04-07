import { React, useState, useEffect } from 'react';
import PropTypes, { string } from 'prop-types';
import { Link } from 'react-router-dom';
import {
  ref, getStorage, getDownloadURL, getMetadata,
} from 'firebase/storage';
import styles from '../styles/Modules.module.css';

function Module(props) {
  const {
    title, body, attachments, child, links,
  } = props;

  const [imgs, setImgs] = useState([]);

  const setImageURL = async (fileLinks) => { // i'm gonna be slow bc i contain a Promise function!
    const urls = [];
    if (fileLinks.length > 0) {
      await Promise.all(fileLinks.map(async (fileLink) => { // i'm also gonna be slow bc i contain a Promise function!
        const storage = getStorage();
        const spaceRef = ref(storage, fileLink);
        const fileType = (await getMetadata(spaceRef)).contentType; // getMetadata is a promise function,
        // ^ so it's very slow (you need to wait for it to be fulfilled before u do anything w it)
        if (fileType === 'image/png' || fileType === 'image/jpeg') {
          getDownloadURL(spaceRef).then((url) => {
            console.log('pls work');
            console.log(urls.length);
            console.log('bye');
            console.log(url);
            urls.push(url);
            console.log(urls.length);
          }).catch((error) => {
            console.error(error.message);
          });
        }
      }));
      setImgs(urls);
    }
    // } else { // might not need this anymore
    //   setImgs([]);
    // }
    console.log(urls);
    console.log('hi');
    console.log(urls.length);
  };

  useEffect(() => { setImageURL(links); }, [links]);

  return (
    <div>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{body}</div>
      <div className={styles.attachments}>{attachments}</div>
      {/* keep bottom code for reference */}
      <div>
        {console.log(imgs)}
        {/* {console.log(imgs.length)} */}
        {/* {console.log(typeof imgs)} */}
        {/* {console.log(typeof imgs['0'])} */}
        {console.log(JSON.stringify(imgs, null, '\t'))}
        {imgs.map((image) => (
          <div>
            hello
            {/* <div key={image} className="image"> */}
            {console.log(image)}
            <img src={image} alt="" width="40%" height="auto" />
            <br />
          </div>
        ))}
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
  attachments: PropTypes.string.isRequired,
  child: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    role: PropTypes.arrayOf(string).isRequired,
  })).isRequired,
  links: PropTypes.arrayOf(string),
};

Module.defaultProps = {
  links: [''],
};

export default Module;
