import { React } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from '../styles/Modules.module.css';

function Module(props) {
  const {
    title, body, attachments, child,
  } = props;

  return (
    <div>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{body}</div>
      <div className={styles.attachments}>{attachments}</div>
      {
        child.map((kid) => (
          <Link to="/expanded-module" state={{ id: kid.id }}>
            <div className={styles.card}>
              <h1>{kid.title}</h1>
            </div>
          </Link>
        ))
        }
    </div>
  );
}

Module.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  attachments: PropTypes.string.isRequired,
  child: PropTypes.arrayOf.isRequired,
};
export default Module;
