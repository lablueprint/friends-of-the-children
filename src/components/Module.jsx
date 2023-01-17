import { React } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from '../styles/Modules.module.css';

function Module(props) {
  const {
    title, body, attachments, titles, child,
  } = props;

  return (
    <div>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{body}</div>
      <div className={styles.attachments}>{attachments}</div>
      {
        child.length === titles.length && child.length !== 0
        && child.map((kid, i) => (
          <Link to="/expanded-module" state={{ id: kid }}>
            <div className={styles.card}>
              <h1>{titles[i]}</h1>
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
  titles: PropTypes.arrayOf.isRequired,
  child: PropTypes.arrayOf.isRequired,
};
export default Module;
