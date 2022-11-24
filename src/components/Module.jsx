import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Modules.module.css';

function Module({
  title,
  // body,
  // attachments,
}) {
  return (
    <div className={styles.module}>
      <h1>{title}</h1>
      {/* <p>{body}</p>
      <div>{attachments}</div> */}
    </div>
  );
}

Module.propTypes = {
  title: PropTypes.string.isRequired,
  // body: PropTypes.string.isRequired,
  // attachments: PropTypes.string.isRequired,
};

// Module.defaultProps = {
//   attachments: ,
// };

export default Module;
