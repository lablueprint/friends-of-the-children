import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Messages.module.css';
import { db } from '../pages/firebase';

function Message(props) {
  const { id, title, body } = props;
  let pinned;
  const [pinDesc, setDesc] = useState('📌 PIN');
  const messageRef = db.collection('messages').doc(id);

  const setPinned = () => {
    messageRef.get().then((snap) => {
      if (snap.exists) {
        const data = snap.data();
        pinned = data.pinned;
        messageRef.set({
          pinned: !pinned,
        }, { merge: true });
        pinned = !pinned;
        if (pinned) setDesc('❗️📌 UNPIN');
        else setDesc('📌 PIN');
      } else {
        console.log('Document does not exist');
      }
    });
  };

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
      <button type="button" onClick={(setPinned)}>{pinDesc}</button>
    </div>
  );
}

Message.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};
export default Message;
