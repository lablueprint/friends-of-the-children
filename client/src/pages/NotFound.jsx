// The purpose of the NotFound page is to indicate to the user that the page they tried to access is not defined
// or it doesn't exist.

// This function is imported in the App.jsx file where NotFound will be rendered if the user tries to access a
// route that wasn't defined by any previous routes such as login, signup, etc.

import React from 'react';
import styles from '../styles/NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.not_found_page}>
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.body}>Sorry, this page doesn&apos;t exist! Check if there is a typo in your URL.</p>
    </div>
  );
}
