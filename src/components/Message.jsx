import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Messages.module.css';
import { db } from '../pages/firebase';

function Message(props) {
  const {
    id, title, body, updateMessages,
  } = props;
  const [pinned, setPinned] = useState(false);
  // const [pinDesc, setDesc] = useState('📌 PIN');
  const messageRef = db.collection('messages').doc(id);

  // getPinned: get pin status from fb (in useEffect)
  const getPinned = () => {
    console.log('got pinned');
    messageRef.get().then((snap) => {
      if (snap.exists) {
        setPinned(snap.data().pinned);
      }
    });
  };

  // changePinned: change local pin status, then push it to fb
  const changePinned = () => {
    // push to fb
    messageRef.set({
      pinned: !pinned,
    }, { merge: true }).then(() => {
      console.log('pin pushed');
      // if (!pinned) setDesc('❗️📌 UNPIN');
      // else setDesc('📌 PIN');
      // change local pin status
      setPinned(!pinned);
      console.log('changed pin status');
      updateMessages();
    });
  };

  useEffect(getPinned, []);
  // () => { getPinned(); },
  // [],

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
      {/* <button type="button" onClick={(changePinned)}>{pinned ? '❗️📌 UNPIN' : '📌 PIN' }</button> */}
      <button type="button" className={pinned ? styles.pinnedbutton : styles.button} onClick={(changePinned)}>{pinned ? '❗️📌 UNPIN' : '📌 PIN' }</button>
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
