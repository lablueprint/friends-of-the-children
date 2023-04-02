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
  const [allServiceAreas, setAllServiceAreas] = useState(false);
  const [statusMessage, seStatusMessage] = useState('');
  const target = [];
  let serviceAreas = [];

  const { role, serviceArea } = profile;

  const getMessagesfunc = async () => {
    const { data } = await api.getMessages();
    setMessages(data);
  };

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
      target.push('Mentor');
    }
    if (caregiver) {
      target.push('Caregiver');
    }

    if (allServiceAreas) {
      serviceAreas = await api.getAllProfiles();
      serviceAreas = serviceAreas.data.map((element) => ({ role: element.role, serviceArea: element.serviceArea }));
      if (!(mentor && caregiver)) {
        if (mentor) {
          serviceAreas = serviceAreas.filter((element) => element.role === 'Mentor');
        } else {
          serviceAreas = serviceAreas.filter((element) => element.role === 'Caregiver');
        }
      }
      serviceAreas = serviceAreas.map((element) => element.serviceArea);
      serviceAreas = serviceAreas.filter((value, index, self) => self.indexOf(value) === index);
    }

    const data = {
      title,
      body,
      serviceArea: allServiceAreas ? serviceAreas : msgserviceArea.split(',').map((element) => element.trim()),
      target,
      pinned: false,
      date: app.firebase.firestore.Timestamp.fromDate(new Date()),
    };

    // insert api call to send emails here
    const emailData = {
      adminName: profile.firstName,
      replyBackEmail: profile.email,
      role: target,
      serviceArea: allServiceAreas ? serviceAreas : msgserviceArea.split(',').map((element) => element.trim()),
    };

    const message = await api.sendEmails(emailData, target);
    seStatusMessage(message);

    db.collection('messages').doc().set(data).then(getMessagesfunc)
      .then(() => {
        setTitle('');
        setBody('');
        setmsgServiceArea('');
        setAllServiceAreas(false);
        setMentor(false);
        setCaregiver(false);
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
          Service Area (separated by commas):
          <input type="text" id="msgserviceArea" name="msgserviceArea" disabled={allServiceAreas} value={msgserviceArea} onChange={(e) => setmsgServiceArea(e.target.value)} />
        </label>
        <label htmlFor="mentor">
          All?
          <input type="checkbox" id="allServiceAreas" name="allServiceAreas" checked={allServiceAreas} onChange={(e) => setAllServiceAreas(e.target.checked)} />
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
      <button type="button" disabled={!(mentor || caregiver)} onClick={submitData}>Submit</button>
      <p>{statusMessage}</p>
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
          (message) => (message.pinned && (message.serviceArea.includes(serviceArea)
        && message.target.includes(role.toLowerCase()))),
        ).map(
          (message) => <Message key={message.id} id={message.id} title={message.title} body={message.body} pinned={message.pinned} updatePinned={updatePinned} />,
        )}
        {messages.filter(
          (message) => (!message.pinned && (message.serviceArea.includes(serviceArea)
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
