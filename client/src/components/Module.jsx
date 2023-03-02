import { React, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from '../styles/Modules.module.css';
import {
  ref, getStorage, uploadBytesResumable, getDownloadURL, listAll, 
} from 'firebase/storage';
import { db, storage } from '../pages/firebase';

const setImageURL = (link) => {
  let img = '';
  const storageRef = ref(storage);
  const starsRef = ref(storageRef).child(storage, '/' + link);
  starsRef.getDownloadURL().then((url) => {
      img = url;
    }).catch(function(error){
      // handle any errors
    });

  // const storage = getStorage();
  // console.log(link);
  // getDownloadURL(ref(storage, {link}))
  //   .then((url) => {
    
  //   });
  return img;
}

function Module(props) {

  const {
    title, body, attachments, child, link,
  } = props;
  // const [allImages, setImages] = useState([]);

  // const storageRef = ref(storage, '/' + {link}); // allImages is set by object.data.link (from getModulebyIdfunc)
  
  // getDownloadURL(storageRef).then((url) => {
  //   // `url` is the download URL for 'images/stars.jpg'

  //   // Or inserted into an <img> element
  //   const img = document.getElementById('myimg');
  //   img.setAttribute('src', url);
  // })
  // .catch((error) => {
  //   // Handle any errors
  // });
  // // console.log(allImages);

  return (
    <div>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{body}</div>
      <div className={styles.attachments}>{attachments}</div>
      {/* <div>
        {link.map((image) => {
            return (
              <div key={image} className="image">
                  <img src={image} alt="" width="40%" height="auto" />
              </div>
            );
        })}
      </div> */}
      <img src={setImageURL({link})} alt="" width="40%" height="auto" />
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
  child: PropTypes.arrayOf.isRequired,
  link: PropTypes.string.isRequired,
};
export default Module;
