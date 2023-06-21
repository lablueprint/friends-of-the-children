import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import * as api from '../api';
import NewModulePopup from './NewModulePopup';
import styles from '../styles/NavBar.module.css';
import editIcon from '../assets/icons/edit_pencil.svg';
import addIcon from '../assets/icons/add_icon.svg';

// Navigation Bar component used to navigate to different pages

function ModuleNav({ profile }) {
  // uses React Redux to log user out and
  // remove profile info from localStorage
  const location = useLocation();
  const locationPath = location.pathname;
  // const { root } = location.state;
  const role = profile.role.toLowerCase();
  const [modules, setModules] = useState([{ title: 'All' }]);
  const [openNewUploadPopup, setOpenNewUploadPopup] = useState(false);
  // const [checked, setChecked] = useState([]);
  // const [editModule, setEditModule] = useState(false); // toggles edit button
  // const [hoveredFile, setHoveredFile] = useState(null);

  useEffect(() => {
    api.getModules(role).then((temp) => {
      setModules(modules.concat(temp.data));
    });
  }, []);

  console.log(modules);

  const updateModule = () => {
    // setChildren([...children, data]);
  };

  // opening add module popup
  const handleClickOpen = () => {
    setOpenNewUploadPopup(true);
  };

  const handleClose = () => {
    setOpenNewUploadPopup(false);
  };

  // const deleteChild = (childId) => {
  //   setChildren(children.filter((child) => child.id !== childId));
  // };

  // const handleMouseEnter = (fileId) => {
  //   setHoveredFile(fileId);
  // };

  // const handleMouseLeave = () => {
  //   setHoveredFile(null);
  // };

  // const handleCheckboxChange = (event, fileName) => {
  //   if (checked.includes(fileName)) {
  //     setChecked(checked.filter((file) => (file !== fileName)));
  //     return;
  //   }

  //   setChecked([...checked, fileName]);
  // };

  const displayCheckBoxes = () => {
    // setEditModule(true);
    // toggleEdit(editModule);
  };

  // const deleteModule = async (moduleId) => { // calls api to delete modules, then removes that module from state children array in ExpandedModule
  //   if (checked.length > 0) {
  //     api.deleteModule(moduleId).then(() => {
  //       // reloads the page
  //       deleteChild(moduleId);
  //     });
  //   }
  //   setEditModule(false);
  // };

  // const clearCheckboxes = () => {
  //   setChecked([]);
  //   setEditModule(false);
  // };

  // const deleteFiles = async (filesToDelete) => {

  // };

  return (
    <div>
      <div className={styles.second_container}>
        {modules.map((module) => (
          <div className={styles.nav2_btn_container}>
            <div className={`${locationPath.includes(module.title) ? styles.nav2_btn_top : styles.nav2_btn_blue}`}>
              <div className={styles.nav2_btn_top_round} />
            </div>

            <Link to={`/resources/${module.title}`} state={{ id: module.id, root: module.title }} className={`${styles.btn_info} ${styles.nav2_btn} ${styles.nav2_btn1} ${locationPath.includes(module.title) ? '' : styles.nav2_btn_selected}`}>
              {module.title}
            </Link>

            <div className={`${locationPath.includes(module.title) ? styles.nav2_btn_bottom : styles.nav2_btn_blue}`}>
              <div className={styles.nav2_btn_bottom_round} />
            </div>
          </div>
        ))}
        {/* TODO: have requests link instead for admin */}
        {role === 'admin'
        && (
        <div>
          <div className={styles.line} />
          <div className={styles.navEditAdd}>
            <button type="button" onClick={displayCheckBoxes} className={styles.editModule}>
              <img src={editIcon} alt="edit icon" />
              Edit
            </button>
            <button type="button" onClick={handleClickOpen} className={styles.editModule}>
              <img src={addIcon} alt="add icon" />
              Add
            </button>
            <Dialog
              open={openNewUploadPopup}
              onClose={handleClose}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <DialogContent>
                <NewModulePopup
                  updateModule={updateModule}
                  open={openNewUploadPopup}
                  handleClose={handleClose}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        ) }
      </div>
    </div>
  );
}

ModuleNav.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};

export default ModuleNav;
