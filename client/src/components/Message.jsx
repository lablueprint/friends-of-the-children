import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Messages.module.css';

function Message(props) {
  const {
    id, title, body, pinned, updatePinned,
  } = props;

  const update = () => {
    updatePinned(id, !pinned);
  };

  return (
    <div className={pinned ? styles.pinnedmessage : styles.message}>
      <div className={styles.titlediv}>
        <p1 className={styles.title_css}>
          {title}
        </p1>
        <button type="button" className={pinned ? styles.pinnedbutton : styles.button} onClick={update}>{pinned ? '❗️📌 UNPIN' : '📌 PIN' }</button>
      </div>

      <h6 className={styles.body_css}>
        {body}
      </h6>
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
