import React from 'react';
import styles from '../styles/NotFound.module.css';

export default function PermissionDenied() {
  return (
    <div className={styles.not_found_page}>
      <h1 className={styles.title}>Permission Denied</h1>
      <p className={styles.body}>Sorry, this page is only for administrators.</p>
    </div>
  );
}
