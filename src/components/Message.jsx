import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Messages.module.css';
import { db } from '../pages/firebase';

function Message(props) {
  const {
    id, title, body, updateMessages,
  } = props;
  const [pinned, setPinned] = useState(false);
  const [pinDesc, setDesc] = useState('📌 PIN');
  const messageRef = db.collection('messages').doc(id);

  // getPinned: get pin status from fb (in useEffect)
  const getPinned = () => {
    messageRef.get().then((snap) => {
      if (snap.exists) {
        setPinned(snap.data().pinned);
      }
      if (snap.data().pinned) setDesc('❗️📌 UNPIN');
      else setDesc('📌 PIN');
    });
  };

  // changePinned: change local pin status, then push it to fb
  const changePinned = () => {
    // push to fb
    messageRef.set({
      pinned: !pinned,
    }, { merge: true });
    console.log('pin pushed');
    if (!pinned) setDesc('❗️📌 UNPIN');
    else setDesc('📌 PIN');
    // change local pin status
    setPinned(!pinned);
    console.log('changed pin status');
    updateMessages();
  };

  useEffect(
    () => { getPinned(); },
    [],
  );

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
      <button type="button" onClick={(changePinned)}>{pinDesc}</button>
    </div>
  );
}

Message.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  updateMessages: PropTypes.func.isRequired,
};
export default Message;
