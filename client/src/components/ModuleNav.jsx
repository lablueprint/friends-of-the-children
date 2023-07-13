import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as api from '../api';
import NewModulePopup from './NewModulePopup';
import styles from '../styles/NavBar.module.css';
import styles2 from '../styles/Modules.module.css';
import deleteIcon from '../assets/icons/delete_icon.svg';
import editIcon from '../assets/icons/edit_pencil.svg';
import addIcon from '../assets/icons/add_icon.svg';

// Navigation Bar component used to navigate to different pages

function ModuleNav({ profile }) {
  // uses React Redux to log user out and
  // remove profile info from localStorage
  const location = useLocation();
  const locationPath = location.pathname.split('/');
  const role = profile.role.toLowerCase();
  const [modules, setModules] = useState([{ title: 'All' }]);
  const [openNewUploadPopup, setOpenNewUploadPopup] = useState(false);
  const [openDeleteModulePopups, setOpenDeleteModulePopups] = useState(Array(modules.length).fill(false));
  const [editModule, setEditModule] = useState(false);

  useEffect(() => {
    api.getModules(role).then((temp) => {
      setModules(modules.concat(temp.data.modules));
    });
  }, []);

  // opening add module popup
  const handleClickOpen = () => {
    setOpenNewUploadPopup(true);
  };

  const handleClose = () => {
    setOpenNewUploadPopup(false);
  };

  const displayCheckBoxes = () => {
    setEditModule(true);
  };

  const deleteModule = async (moduleId) => {
    await api.deleteModule(moduleId);
    setModules(modules.filter((module) => module.id !== moduleId));
  };

  const handleDeleteModulesOpen = (module) => {
    const fileIndex = modules.findIndex((m) => m.title === module.title);
    const updatedOpenDeleteModulePopups = [...openDeleteModulePopups];
    updatedOpenDeleteModulePopups[fileIndex] = true;
    setOpenDeleteModulePopups(updatedOpenDeleteModulePopups);
  };

  const handleDeleteModulesClose = (module) => {
    const fileIndex = modules.findIndex((m) => m.title === module.title);
    const updatedOpenDeleteModulePopups = [...openDeleteModulePopups];
    updatedOpenDeleteModulePopups[fileIndex] = false;
    setOpenDeleteModulePopups(updatedOpenDeleteModulePopups);
  };

  return (
    <div>
      <div className={styles.second_container}>
        {modules.map((module, index) => (
          <div className={styles.nav2_btn_container} key={module.title}>
            <div className={styles.deleteIconContainer}>
              {editModule && module.title !== 'All' && (
                <button type="button" className={styles.delete_button} onClick={() => (handleDeleteModulesOpen(module))}>
                  <img className={styles.deleteIcon} src={deleteIcon} alt="delete icon" />
                </button>
              )}
            </div>
            <div className={styles.nav2_btn_content}>
              <div className={`${locationPath.includes(module.title) ? styles.nav2_btn_top : styles.nav2_btn_blue}`}>
                <div className={styles.nav2_btn_top_round} />
              </div>
              <Link
                to={`/resources/${module.title}`}
                state={{ id: module.id, root: module.title }}
                className={`${styles.btn_info} ${styles.nav2_btn} ${styles.nav2_btn1} ${locationPath.includes(module.title) ? '' : styles.nav2_btn_selected}`}
              >
                {module.title}
              </Link>
              <div className={`${locationPath.includes(module.title) ? styles.nav2_btn_bottom : styles.nav2_btn_blue}`}>
                <div className={styles.nav2_btn_bottom_round} />
              </div>
            </div>
            <Dialog open={openDeleteModulePopups[index]} onClose={handleDeleteModulesClose}>
              <div className={styles2.dialogContainer}>
                <DialogTitle className={styles2.dialogTitle}>
                  You have chosen to delete
                  {' '}
                  &quot;
                  {module.title}
                  &quot;.
                </DialogTitle>
                <DialogContent>
                  <div>
                    <div className={styles2.confirmMessage}>
                      Are you sure you want to continue with this action?
                    </div>
                    <div className={styles2.confirmButtons}>
                      <button className={styles2.confirmCancel} type="button" onClick={() => (handleDeleteModulesClose(module))}>
                        Cancel
                      </button>
                      <button type="button" className={styles2.confirmDelete} onClick={() => { deleteModule(module.id); handleDeleteModulesClose(module); }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </div>
            </Dialog>
          </div>
        ))}

        {/* TODO: have requests link instead for admin */}
        {role === 'admin'
        && (
        <div>
          <div className={styles.line} />
          <div className={styles.navEditAdd}>
            {editModule ? (
              <>
                <button className={styles.cancelModuleChanges} type="button" onClick={() => setEditModule(false)}>
                  Cancel
                </button>
                <button type="button" className={styles.saveModuleChanges} onClick={() => setEditModule(false)}>
                  Save
                </button>
              </>
            ) : (
              <>
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
                      updateModule={() => {}}
                      open={openNewUploadPopup}
                      handleClose={handleClose}
                    />
                  </DialogContent>
                </Dialog>
              </>
            )}
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
