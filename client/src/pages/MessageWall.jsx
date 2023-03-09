import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { app, db } from './firebase';
import Message from '../components/Message';
import * as api from '../api';

function MessageWall({ profile }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [msgserviceArea, setmsgServiceArea] = useState('');
  const [mentor, setMentor] = useState(false);
  const [caregiver, setCaregiver] = useState(false);
  const [messages, setMessages] = useState([]);
  const target = [];

  const { role, serviceArea } = profile;

  const getMessagesfunc = async () => {
    const { data } = await api.getMessages();
    console.log(data);
    setMessages(data);
    // return message;
  };

  useEffect(() => {
    console.log('this is user messages', messages);
    console.log('this is filtered and pinned messages', messages.filter(
      (message) => (message.pinned && (message.serviceArea.includes(serviceArea.toLowerCase())
    && message.target.includes(role.toLowerCase()))),
    ));
    console.log('this is unpinned filtered messages', messages.filter(
      (message) => (!message.pinned && (message.serviceArea.includes(serviceArea.toLowerCase())
    && message.target.includes(role.toLowerCase()))),
    ));
  }, [messages]);
  // const getMessages = () => {
  //     getMessagesfunc().then((message) => {

  //     })
  // };

  useEffect(() => {
    getMessagesfunc();
  }, []);

  const updatePinned = (id, pinned) => {
    // deep copy for useState to work properly
    // see https://www.coletiv.com/blog/dangers-of-using-objects-in-useState-and-useEffect-ReactJS-hooks/ for more context
    const tempMessages = [...messages];

    // change local variable, then push to firebase
    /* eslint no-param-reassign: ["error", { "props": false }] */
    tempMessages.find((message) => (message.id === id)).pinned = pinned;
    setMessages(tempMessages);

    db.collection('messages').doc(id).set({
      pinned,
    }, { merge: true });
  };

  const submitData = async () => {
    if (mentor) {
      target.push('mentor');
    }
    if (caregiver) {
      target.push('caregiver');
    }

    const data = {
      title,
      body,
      serviceArea: [msgserviceArea],
      target,
      pinned: false,
      date: app.firebase.firestore.Timestamp.fromDate(new Date()),
    };

    db.collection('messages').doc().set(data).then(getMessagesfunc)
      .then(() => {
        setTitle('');
        setBody('');
        setmsgServiceArea('');
      });
  };

  const messageForm = (
    <form>
      <div>
        <label htmlFor="title">
          Title:
          <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
      </div>
      <div>
        <label htmlFor="body">
          Body:
          <input type="text" id="body" name="body" value={body} onChange={(e) => setBody(e.target.value)} />
        </label>
      </div>
      <div>
        <label htmlFor="msgserviceArea">
          Service Area:
          <input type="text" id="msgserviceArea" name="msgserviceArea" value={msgserviceArea} onChange={(e) => setmsgServiceArea(e.target.value)} />
        </label>
      </div>
      <div>
        <label htmlFor="mentor">
          Mentor
          <input type="checkbox" id="mentor" name="mentor" checked={mentor} onChange={(e) => setMentor(e.target.checked)} />
        </label>
      </div>
      <div>
        <label htmlFor="caregiver">
          Caregiver
          <input type="checkbox" id="caregiver" name="caregiver" checked={caregiver} onChange={(e) => setCaregiver(e.target.checked)} />
        </label>
      </div>
      <button type="button" onClick={submitData}>Submit</button>
    </form>
  );

  return (
    role.toLowerCase() === 'admin' ? (
      <div>
        <h3>Message Wall</h3>
        {
          messages.filter((message) => (message.pinned)).map(
            (message) => <Message key={message.id} id={message.id} title={message.title} body={message.body} pinned={message.pinned} updatePinned={updatePinned} />,
          )
        }
        {
          messages.filter((message) => (!message.pinned)).map(
            (message) => <Message key={message.id} id={message.id} title={message.title} body={message.body} pinned={message.pinned} updatePinned={updatePinned} />,
          )
        }
        {messageForm}
      </div>
    ) : (
      <div>
        <h3>Message Wall</h3>
        {messages.filter(
          (message) => (message.pinned && (message.serviceArea.includes(serviceArea.toLowerCase())
        && message.target.includes(role.toLowerCase()))),
        ).map(
          (message) => <Message key={message.id} id={message.id} title={message.title} body={message.body} pinned={message.pinned} updatePinned={updatePinned} />,
        )}
        {messages.filter(
          (message) => (!message.pinned && (message.serviceArea.includes(serviceArea.toLowerCase())
        && message.target.includes(role.toLowerCase()))),
        ).map(
          (message) => <Message key={message.id} id={message.id} title={message.title} body={message.body} pinned={message.pinned} updatePinned={updatePinned} />,
        )}
      </div>
    )
  );
}

MessageWall.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};

export default MessageWall;
