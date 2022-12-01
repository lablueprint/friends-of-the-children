import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Messages.module.css';

function Message(props) {
  const { title, body } = props;
  return (
    <div className={styles.message}>
      <h5>{title}</h5>
      <p>{body}</p>
      {/* <p>{date}</p> */}
    </div>
  );
}

Message.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  // date: PropTypes.instanceOf(Date).isRequired,
};
export default Message;
