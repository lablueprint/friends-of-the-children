import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/NavBar.module.css';
import * as api from '../api';

// Navigation Bar component used to navigate to different pages

function ModuleNav({ profile }) {
  // uses React Redux to log user out and
  // remove profile info from localStorage
  const location = useLocation();
  const locationPath = location.pathname;
  const role = profile.role.toLowerCase();
  const [modules, setModules] = useState([{ title: 'All' }]);

  useEffect(() => {
    api.getModules(role).then((temp) => {
      setModules(modules.concat(temp.data));
    });
  }, []);

  console.log(modules);

  return (
    <div>
      <div className={styles.second_container}>
        {modules.map((module) => (
          <div className={styles.nav2_btn_container}>
            <div className={`${locationPath.includes(module.title) ? styles.nav2_btn_top : styles.nav2_btn_blue}`}>
              <div className={styles.nav2_btn_top_round} />
            </div>

            <Link to={`/resources/${module.title}`} state={{ id: module.id }} className={`${styles.btn_info} ${styles.nav2_btn} ${styles.nav2_btn1} ${locationPath.includes(module.title) ? '' : styles.nav2_btn_selected}`}>
              {module.title}
            </Link>

            <div className={`${locationPath.includes(module.title) ? styles.nav2_btn_bottom : styles.nav2_btn_blue}`}>
              <div className={styles.nav2_btn_bottom_round} />
            </div>
          </div>
        ))}
        {/* TODO: have requests link instead for admin */}
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
