import { React } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from '../styles/Modules.module.css';
import Module from '../components/Module';

function ChildModule(props) {
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
            <Module
              title={titles[i]}
            />
          </Link>
        ))
        }
    </div>
  );
}

ChildModule.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  attachments: PropTypes.string.isRequired,
  titles: PropTypes.arrayOf.isRequired,
  child: PropTypes.arrayOf.isRequired,
};
export default ChildModule;
