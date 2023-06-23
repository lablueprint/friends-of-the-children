import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ref, getStorage, getDownloadURL, getMetadata,
} from 'firebase/storage';
import FilePopup from '../components/FilePopup';
import heartIcon from '../assets/icons/heart.svg';
import imgIcon from '../assets/icons/file_img.svg';
import vidIcon from '../assets/icons/file_vid.svg';
import pdfIcon from '../assets/icons/file_pdf.svg';
import * as api from '../api';
import styles from '../styles/Modules.module.css';

// root page for all modules, displays Module components to the user
// admin can select Modules to delete or edit, or add new Modules
function Resources({ profile }) {
  const [files, setFiles] = useState([]);
  const [fileToDisplay, setFileToDisplay] = useState({});
  const [openFilePopup, setOpenFilePopup] = useState(false);
  const { role } = profile;
  const currRole = role.toLowerCase();

  console.log(files);
  const updateImageURL = async (fileLinks) => {
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
          url, fileType, fileName, category, fileSize, fileDate,
        });
      }));
      // sorting files alphabetically
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

  // getting all modules relevant to current user
  const fetchData = async () => {
    const { data } = await api.getModules(currRole);
    updateImageURL(data.rootFiles);
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
    setOpenFilePopup(true);
    setFileToDisplay(file);
  };

  const handleCloseFilePopup = () => {
    setOpenFilePopup(false);
  };

  // empty dependency array means getModules is only being called on page load
  useEffect(() => {
    // saving all the user profiles from Firebase in an array (useProfiles) only on first load
    fetchData().catch(console.error);
  }, []);

  console.log(files);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.pageTitle}>
          All Resources
        </div>
      </div>
      <div className={styles.resourcesContainer}>
        <div className={styles.fieldSpan}>
          <h5>File Name</h5>
          <h5>File Size</h5>
          <h5>Date Uploaded</h5>
          <h5>Category</h5>
        </div>
        <div className={styles.resourcesDisplay}>
          {files.map((file) => (
            <div key={file.url} className={styles.spanContainer}>
              <div className={styles.spanFile}>
                {(file.fileType.includes('image'))
                  && <img src={imgIcon} alt="img icon" />}
                {(file.fileType.includes('video'))
                  && <img src={vidIcon} alt="vid icon" />}
                {(file.fileType.includes('pdf'))
                  && <img src={pdfIcon} alt="pdf icon" />}
                <div onClick={() => (handleClickOpenFilePopup(file))} role="presentation" className={styles.fileName}>
                  {file.fileName}
                </div>
                <div><h5>{file.fileSize}</h5></div>
                <div><h5>{file.fileDate}</h5></div>
                <div><h5>{file.category}</h5></div>
                <img src={heartIcon} alt="heart icon" />
              </div>
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
