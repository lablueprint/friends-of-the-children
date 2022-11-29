import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Modules.module.css';

function Module({
  title,
<<<<<<< HEAD
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
=======
  // body,
  // attachments,
}) {
  return (
    <div className={styles.card}>
      <h1>{title}</h1>
      {/* <p>{body}</p>
      <div>{attachments}</div> */}
>>>>>>> dcc34ec708d5bfc36d3fff99333a44ef3bfeb7ff
    </div>
  );
}

Module.propTypes = {
  title: PropTypes.string.isRequired,
<<<<<<< HEAD
  body: PropTypes.string,
  attachment: PropTypes.string,
};

Module.defaultProps = {
  body: '',
  attachment: null,
};
=======
  // body: PropTypes.string.isRequired,
  // attachments: PropTypes.string.isRequired,
};

// Module.defaultProps = {
//   attachments: ,
// };
>>>>>>> dcc34ec708d5bfc36d3fff99333a44ef3bfeb7ff

export default Module;
