import { React } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from '../styles/Modules.module.css';

function ExpandedModule() {
  const location = useLocation();
  const { title, body, attachments } = location.state;
  return (
    <div className={styles.card}>
      <Link to="/modules" className={styles.backButton}>
        Back
      </Link>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{body}</div>
      <div>{attachments}</div>
    </div>
  );
}

export default ExpandedModule;
