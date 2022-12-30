import React, { useState, useEffect } from 'react';
import { app, db } from './firebase';
import Message from '../components/Message';

function MessageWall() {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [serviceArea, setServiceArea] = useState();
  const [mentor, setMentor] = useState();
  const [caregiver, setCaregiver] = useState();
  const [messages, setMessages] = useState([]);
  const target = [];
  const pinned = false;
  const myTimestamp = app.firebase.firestore.Timestamp.fromDate(new Date());

  if (mentor) {
    target.push('mentor');
  }
  if (caregiver) {
    target.push('caregiver');
  }
  const data = {
    title,
    body,
    serviceArea: [serviceArea],
    target,
    pinned,
    date: myTimestamp,
  };

  const getMessages = () => {
    db.collection('messages').get().then((sc) => {
      const message = [];
      sc.forEach((doc) => {
        const dat = doc.data();
        dat.id = doc.id;
        message.push(dat);
      });
      setMessages(message);
    });
  };

  useEffect(
    () => { getMessages(); },
    [],
  );

  messages.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  });

  const submitData = () => {
    db.collection('messages').doc().set(data);
    setTitle('');
    setBody('');
    setServiceArea('');
    getMessages();
  };

  const isAdmin = true;
  if (isAdmin) {
    return (
      <div>
        <h3>Message Wall</h3>
        {
          messages.map((message) => (
            <Message title={message.title} body={message.body} pinned={message.pinned} />
          ))
        }
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
            <label htmlFor="serviceArea">
              Service Area:
              <input type="text" id="serviceArea" name="serviceArea" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
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
      </div>
    );
  }
}
export default MessageWall;
