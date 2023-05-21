import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import NewModulePopup from '../components/NewModulePopup';
import Module from '../components/Module';
import * as api from '../api';
import styles from '../styles/Modules.module.css';

function Resources({ profile }) {
  const [modules, setModules] = useState([]);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState([]);
  const [editModule, setEditModule] = useState(false);
  const [openDeleteModulesPopup, setOpenDeleteModulesPopup] = useState(false);
  const { role } = profile;
  const currRole = role.toLowerCase();

  // getting all modules relevant to current user
  const fetchData = async () => {
    const { data } = await api.getModules(currRole);
    setModules(data);
  };

  const updateModule = (data) => {
    setModules([...modules, data]);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteModule = async (moduleId) => {
    await api.deleteModule(moduleId);
    setModules(modules.filter((module) => module.id !== moduleId));
  };

  // TODO: implement deleteModules to delete all modules, not just one at a time
  // const deleteFiles = async (filesToDelete) => {
  //   api.deleteFiles(id, filesToDelete).then(() => {
  //     const tempFiles = [...files.filter((file) => !filesToDelete.includes(file.fileLink))];
  //     setFiles(tempFiles); // updates list of presenting files
  //     clearCheckboxes(); // resets checked state to be empty, gets rid of "selected" bar on the bottom side of page
  //   });
  // };

  // const handleCheckboxChange = (event, fileName) => {
  //   if (checked.includes(fileName)) {
  //     setChecked(checked.filter((file) => (file !== fileName)));
  //     return;
  //   }

  //   const isChecked = event.target.checked;
  //   setChecked(() => {
  //     if (isChecked) {
  //       return [...checked, fileName];
  //     }
  //     return checked.filter((file) => id !== file);
  //   });
  // };

  const clearCheckboxes = () => {
    setChecked([]);
    setEditModule(false);
  };

  const displayCheckBoxes = () => {
    setEditModule(true);
  };

  const handleDeleteModulesClose = () => {
    setOpenDeleteModulesPopup(false);
  };

  // empty dependency array means getModules is only being called on page load
  useEffect(() => {
    // saving all the user profiles from Firebase in an array (useProfiles) only on first load
    fetchData().catch(console.error);
  }, []);

  if (currRole === 'admin') {
    return (
      <div>
        <div className={styles.header}>
          {editModule ? (
            <div className={styles.cancelOrSave}>
              <button className={styles.cancelModuleChanges} type="button" onClick={() => (clearCheckboxes())}>
                Cancel
              </button>
              <button type="button" className={styles.saveModuleChanges} onClick={() => (deleteModule(checked))}>
                Save
              </button>
            </div>
          ) : (
            <div>
              <Button variant="outlined" onClick={displayCheckBoxes} className={styles.editModule}>
                Edit Module
              </Button>
              <Button variant="outlined" onClick={handleClickOpen} className={styles.addModule}>
                Add module
              </Button>
              <NewModulePopup
                updateModule={updateModule}
                open={open}
                handleClose={handleClose}
                parentID={null}
              />
            </div>
          )}
        </div>
        <div className={styles.resourcesContainer}>
          <div className={styles.resourcesDisplay}>
            {modules.map((card) => (
              <Module title={card.title} id={card.id} role={currRole} deleteModule={deleteModule} checkboxes={editModule} />
            ))}
          </div>
        </div>
        <div>
          { openDeleteModulesPopup && checked.length > 0
            ? (
              <div>
                <Dialog open={openDeleteModulesPopup} onClose={handleDeleteModulesClose}>
                  <DialogTitle className={styles.dialogTitle}>
                    You have chosen to delete
                    {' '}
                    {checked.length}
                    {' '}
                    {(checked.length) === 1 ? 'file ' : 'files '}
                    from
                    {' '}
                    {/* {title} TODO: include the name of the main folder */}
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
                        {/* <button type="button" className={styles.confirmDelete} onClick={() => (deleteFiles(checked))}>
                          Delete
                        </button> */}
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
                  <button type="button" className={styles.deleteButton} onClick={() => (setOpenDeleteModulesPopup(true))}>
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
  return (
    <div className={styles.resourcesContainer}>
      <div className={styles.resourcesDisplay}>
        {modules.map((card) => (
          <Module title={card.title} id={card.id} role={currRole} deleteModule={deleteModule} />
        ))}
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
  }).isRequired,
};
export default Resources;
