import { React } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../styles/Modules.module.css';

function ExpandedModule() {
  const location = useLocation();
  const { title, body, attachments } = location.state;
  return (
    <div className={styles.card}>
      <h1>{title}</h1>
      <p>{body}</p>
      <div>{attachments}</div>
    </div>
  );
}

export default ExpandedModule;
