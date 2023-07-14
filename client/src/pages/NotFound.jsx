// The purpose of the NotFound page is to indicate to the user that the page they tried to access is not defined
// or it doesn't exist.

// This function is imported in the App.jsx file where NotFound will be rendered if the user tries to access a
// route that wasn't defined by any previous routes such as login, signup, etc.

import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/NotFound.module.css';

export default function NotFound({ isLoggedIn }) {
  return (
    <div className={styles.not_found_page}>
      {isLoggedIn
        ? (
          <div>
            <h1 className={styles.title}>Page Not Found</h1>
            <p className={styles.body}>Please contact the system administrator if you believe you are seeing this page in error.</p>
          </div>
        )
        : (
          <div>
            <h1 className={styles.title}>Page not accesible.</h1>
            <p className={styles.body}>Please login first!</p>
          </div>
        )}

    </div>
  );
}

NotFound.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};
