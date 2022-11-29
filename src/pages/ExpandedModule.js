import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Modules.module.css';

function ExpandedModule({
  title,
  body,
  attachments,
}) {
  return (
    <div className={styles.card}>
      <h1>{title}</h1>
      <p>{body}</p>
      <div>{attachments}</div>
    </div>
  );
}

export default ExpandedModule;

ExpandedModule.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  attachments: PropTypes.string.isRequired,
};
