import { React } from 'react';
import PropTypes from 'prop-types';
import { useLocation, Link } from 'react-router-dom';
import styles from '../styles/Modules.module.css';

function ExpandedModule(profile) {
  // remove later
  console.log(profile);

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

ExpandedModule.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};

export default ExpandedModule;
