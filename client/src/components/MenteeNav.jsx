import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as api from '../api';
import styles from '../styles/NavBar.module.css';
import styles2 from '../styles/Modules.module.css';
import deleteIcon from '../assets/icons/delete_icon.svg';
import editIcon from '../assets/icons/edit_pencil.svg';
import addIcon from '../assets/icons/add_icon.svg';

function MenteeNav({ profile }) {
  const location = useLocation();
  const locationPath = location.pathname;
  const { menteeObj } = location.state;
  const {
    id, firstName, lastName, avatar,
  } = menteeObj;
  const role = profile.role.toLowerCase();
  const [open, setOpen] = useState(false);
  const [editModule, setEditModule] = useState(false);
  const [folderArray, setFolderArray] = useState([]);
  const [openDeleteFolderPopup, setOpenDeleteFolderPopup] = useState(Array(folderArray.length).fill(false));

  useEffect(() => {
    // have all of the mentees' folders and root files display on page
    api.getMenteeFolders(id).then((res) => {
      if (res !== undefined) {
        const { customs } = res.data;
        const filteredArray = customs.filter((folder) => folder !== 'favorites');
        setFolderArray(filteredArray);
      }
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const displayCheckBoxes = () => {
    setEditModule(true);
  };

  const deleteFolder = async (menteeID, folderID) => {
    await api.deleteFolder(menteeID, folderID);
    setFolderArray(folderArray.filter((f) => f !== folderID));
  };

  const handleDeleteFolderOpen = (folder) => {
    const fileIndex = folderArray.findIndex((f) => f === folder);
    const updatedOpenDeleteFolderPopup = [...openDeleteFolderPopup];
    updatedOpenDeleteFolderPopup[fileIndex] = true;
    setOpenDeleteFolderPopup(updatedOpenDeleteFolderPopup);
  };

  const handleDeleteFolderClose = (folder) => {
    const fileIndex = folderArray.findIndex((f) => f === folder);
    const updatedOpenDeleteFolderPopup = [...openDeleteFolderPopup];
    updatedOpenDeleteFolderPopup[fileIndex] = false;
    setOpenDeleteFolderPopup(updatedOpenDeleteFolderPopup);
  };

  // when click on add new folder button
  const addNewFolder = () => {
    setOpen(true);
  };

  // called upon submitting the form that adds a new folder
  const addFolder = async (e) => {
    e.preventDefault();
    const name = e.target.folderName.value;
    // call api function to add folder to database
    api.addMenteeFolder(id, name).then(() => {
      setFolderArray([...folderArray, name]);
      setOpen(false);
      e.target.reset();
    });
  };

  return (
    <div>
      <div className={styles.second_container}>
        {
          locationPath !== `/youth/${firstName}${lastName}` && (
            <Link to={`/youth/${firstName}${lastName}`} state={{ menteeObj }}>
              <img src={avatar} alt="youth avatar" />
              <div className={styles.youth_label}>{`${firstName} ${lastName}`}</div>
            </Link>
          )
        }
        <div className={styles.nav2_btn_container}>
          <div className={styles.nav2_btn_content}>
            <div className={`${(locationPath === `/youth/${firstName}${lastName}` || locationPath.includes('/All_')) ? styles.nav2_btn_top : styles.nav2_btn_blue}`}>
              <div className={styles.nav2_btn_top_round} />
            </div>
            <Link to={`/youth/${firstName}${lastName}`} state={{ menteeObj }} className={`${styles.btn_info} ${styles.nav2_btn} ${styles.nav2_btn1} ${(locationPath === `/youth/${firstName}${lastName}` || locationPath.includes('/All_')) ? '' : styles.nav2_btn_selected}`}>
              All
            </Link>
            <div className={`${(locationPath === `/youth/${firstName}${lastName}` || locationPath.includes('/All_')) ? styles.nav2_btn_bottom : styles.nav2_btn_blue}`}>
              <div className={styles.nav2_btn_bottom_round} />
            </div>
          </div>
        </div>

        {folderArray.map((folder, index) => (
          <div className={styles.nav2_btn_container} key={folder}>
            <div className={styles.deleteIconContainer}>
              {editModule && (
                <button type="button" className={styles.delete_button} onClick={() => (handleDeleteFolderOpen(folder))}>
                  <img className={styles.deleteIcon} src={deleteIcon} alt="delete icon" />
                </button>
              )}
            </div>
            <div className={styles.nav2_btn_content}>
              <div className={`${locationPath.includes(`/folder_${folder}`) ? styles.nav2_btn_top : styles.nav2_btn_blue}`}>
                <div className={styles.nav2_btn_top_round} />
              </div>
              <Link
                key={`${location.pathname}_${folder}`} // Add key prop based on the location pathname
                to={`/youth/${firstName}${lastName}/folder_${folder}`}
                state={{ id: folder, menteeObj: { ...menteeObj, folderName: folder } }}
                className={`${styles.btn_info} ${styles.nav2_btn} ${styles.nav2_btn1} ${locationPath.includes(`/folder_${folder}`) ? '' : styles.nav2_btn_selected}`}
              >
                {folder}
              </Link>
              <div className={`${locationPath.includes(`/folder_${folder}`) ? styles.nav2_btn_bottom : styles.nav2_btn_blue}`}>
                <div className={styles.nav2_btn_bottom_round} />
              </div>
            </div>
            <Dialog open={openDeleteFolderPopup[index]} onClose={handleDeleteFolderClose}>
              <div className={styles2.dialogContainer}>
                <DialogTitle className={styles2.dialogTitle}>
                  You have chosen to delete
                  {' '}
                  &quot;
                  {folder}
                  &quot;.
                </DialogTitle>
                <DialogContent>
                  <div>
                    <div className={styles2.confirmMessage}>
                      Are you sure you want to continue with this action?
                    </div>
                    <div className={styles2.confirmButtons}>
                      <button className={styles2.confirmCancel} type="button" onClick={() => (handleDeleteFolderClose(folder))}>
                        Cancel
                      </button>
                      <button type="button" className={styles2.confirmDelete} onClick={() => { deleteFolder(id, folder); handleDeleteFolderClose(folder); }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </div>
            </Dialog>
          </div>
        ))}

        {role === 'mentor'
        && (
        <div>
          <div className={styles.line} />
          <div className={styles.navEditAdd}>
            {editModule ? (
              <>
                <button className={styles.cancelModuleChanges} type="button" onClick={() => setEditModule(false)}>
                  Cancel
                </button>
                <Link to={`/youth/${firstName}${lastName}`} state={{ menteeObj }} className={styles.saveModuleChanges} onClick={() => setEditModule(false)}>
                  Save
                </Link>
              </>
            ) : (
              <>
                <button type="button" onClick={displayCheckBoxes} className={styles.editModule}>
                  <img src={editIcon} alt="edit icon" />
                  Edit
                </button>
                <button type="button" onClick={addNewFolder} className={styles.editModule}>
                  <img src={addIcon} alt="add icon" />
                  Add
                </button>
                {/* create a new folder */}
                <div>
                  <Dialog open={open} onClose={handleClose}>
                    <DialogContent>
                      <h5>Create New Folder</h5>
                      Title
                      <form onSubmit={(e) => addFolder(e)}>
                        <input type="text" name="folderName" required />
                        <DialogActions>
                          <Button onClick={handleClose}>Cancel</Button>
                          <Button type="submit">Save</Button>
                        </DialogActions>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}
          </div>
        </div>
        ) }
      </div>
    </div>
  );
}

MenteeNav.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};

export default MenteeNav;
