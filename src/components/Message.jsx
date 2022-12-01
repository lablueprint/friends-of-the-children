import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Messages.module.css';

function Message(props) {
  const { title, body } = props;
  // const pinMessage = () => {
  //   pinned = true;
  // };
  return (
    <div className={styles.message}>
      <h5>
        Title:
        {' '}
        {title}
      </h5>
      <p>
        Body:
        {' '}
        {body}
      </p>
      <button type="button">pin 📌</button>
      {/* <p>{date}</p> */}
    </div>
  );
}

Message.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  // pinned: PropTypes.bool.isRequired,
  // date: PropTypes.instanceOf(Date).isRequired,
};
export default Message;
