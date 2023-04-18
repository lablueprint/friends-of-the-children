import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import NewModulePopup from '../components/NewModulePopup';
import styles from '../styles/Modules.module.css';
import * as api from '../api';

function Resources({ profile }) {
  const [modules, setModules] = useState([]);
  const [open, setOpen] = useState(false);
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

  // empty dependency array means getModules is only being called on page load
  useEffect(() => {
    // saving all the user profiles from Firebase in an array (useProfiles) only on first load
    fetchData().catch(console.error);
  }, []);

  if (currRole === 'admin') {
    return (
      <div>
        {modules.map((card) => (
          <div key={card.id}>
            <Link
              to="/expanded-module"
              state={{ id: card.id }}
            >
              <div className={styles.card}>
                <h1>{card.title}</h1>
              </div>
            </Link>
          </div>
        ))}
        <Button variant="outlined" onClick={handleClickOpen}>
          Add module
        </Button>
        <NewModulePopup
          updateModule={updateModule}
          open={open}
          handleClose={handleClose}
          parentID={null}
        />
      </div>
    );
  }
  return (
    <div>
      {modules.map((card) => (
        <div key={card.id}>
          <Link
            to="/expanded-module"
            state={{ id: card.id }}
          >
            <div className={styles.card}>
              <h1>{card.title}</h1>
            </div>
          </Link>
        </div>
      ))}
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
