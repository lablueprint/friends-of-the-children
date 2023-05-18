import { React } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from '../styles/Modules.module.css';

function Module(props) {
  const {
    title, id, role,
  } = props;

  return (
    <div>
      <div className={styles.card}>
        <Link to="/expanded-module" state={{ id }} key={id}>
          <h1>{title}</h1>
        </Link>
        {role === 'admin' && (
        <button className={styles.deleteButton} type="button" onClick={() => { deleteModule(kid.id); }}>
          {' '}
          Delete Module
          {' '}
          {id}
          {' '}
        </button>
        )}
      </div>
    </div>
  );
}

Module.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};

export default Module;
