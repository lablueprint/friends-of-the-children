import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Modules.module.css';

function Module({
  title,
  body,
  attachment,
}) {
  return (
    <div className={styles.module}>
      <h1>
        {title}
      </h1>

      <p>
        {body}
      </p>

      <div>
        {attachment}
      </div>
    </div>
  );
}

Module.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string,
  attachment: PropTypes.string,
};

Module.defaultProps = {
  body: '',
  attachment: null,
};

export default Module;
