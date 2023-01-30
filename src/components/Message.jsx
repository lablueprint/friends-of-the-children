import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Messages.module.css';
// import { db } from '../pages/firebase';

function Message(props) {
  const {
    id, title, body, pinned, updatePinned,
  } = props;

  const update = () => {
    updatePinned(id, !pinned);
    console.log('pressed');
  };

  return (
    <div className={pinned ? styles.pinnedmessage : styles.message}>
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
      <button type="button" className={pinned ? styles.pinnedbutton : styles.button} onClick={update}>{pinned ? '❗️📌 UNPIN' : '📌 PIN' }</button>
    </div>
  );
}

Message.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  pinned: PropTypes.bool.isRequired,
  updatePinned: PropTypes.func.isRequired,
};
export default Message;
