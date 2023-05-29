import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from '../styles/NavBar.module.css';

// Navigation Bar component used to navigate to different pages

function NavBar2() {
  // uses React Redux to log user out and
  // remove profile info from localStorage
//   const location = useLocation();
  const locationPath = '/dummy';

  return (
    <div>
      <div className={styles.second_container}>
        <Link to="/resources/all" className={`${styles.btn_info} ${styles.nav2_btn} ${locationPath === '/resources' ? styles.btn_selected : ''}`}>
          Resources
        </Link>
        {/* TODO: have requests link instead for admin */}
        <Link to="/resources/education" className={`${styles.btn_info} ${styles.nav2_btn} ${locationPath === '/mentees' ? styles.btn_selected : ''}`}>
          My Youth
        </Link>
      </div>
    </div>

  );
}

NavBar2.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};

export default NavBar2;
