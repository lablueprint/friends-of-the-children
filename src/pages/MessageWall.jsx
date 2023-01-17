import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { app, db } from './firebase';
import Message from '../components/Message';

function MessageWall(profile) {
  // remove later
  console.log(profile);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [mentor, setMentor] = useState(false);
  const [caregiver, setCaregiver] = useState(false);
  const [messages, setMessages] = useState([]);
  const target = [];
  const myTimestamp = app.firebase.firestore.Timestamp.fromDate(new Date());
  const [isAdmin, setIsadmin] = useState(false);

  const { role, serviceArea } = profile;

  if (role === 'Admin') {
    setIsadmin(true);
  }
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
    pinned: false,
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

  // this is used to re-render the page when a msg gets pinned (not necessarily sort anything, since that's done right before)
  const updateMessages = () => {
    getMessages(messages);
    console.log(messages);
    messages.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return 0;
    });
    console.log('hi');
  };

  const submitData = () => {
    db.collection('messages').doc().set(data);
    setTitle('');
    setBody('');
    setServiceArea('');
    getMessages();
  };

  if (isAdmin === false) {
    return (
      <div>
        <h3>Message Wall</h3>
        {
              messages.filter((message) => (message.pinned === true && message.msgserviceArea === serviceArea && message.target[0] === role)).map((message) => <Message key={message.id} id={message.id} title={message.title} body={message.body} updateMessages={updateMessages} />)
            }
        {
              messages.filter((message) => (message.pinned === false && message.msgserviceArea === serviceArea && message.target[0] === role)).map((message) => <Message key={message.id} id={message.id} title={message.title} body={message.body} updateMessages={updateMessages} />)
            }
      </div>
    );
  }

  return (
    <div>
      <h3>Message Wall</h3>
      {
        messages.filter((message) => (message.pinned === true)).map((message) => <Message key={message.id} id={message.id} title={message.title} body={message.body} updateMessages={updateMessages} />)
      }
      {
        messages.filter((message) => (message.pinned === false)).map((message) => <Message key={message.id} id={message.id} title={message.title} body={message.body} updateMessages={updateMessages} />)
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
  //   return (
  //     <div>
  //       {console.log(messages)}
  //       <h3>Message Wall</h3>
  //           {
  //             messages.filter((message) => (message.pinned === true && message.msgserviceArea === serviceArea && message.target[0] === role)).map((message) => <Message key={message.id} id={message.id} title={message.title} body={message.body} updateMessages={updateMessages} />)
  //           }
  //           {
  //             messages.filter((message) => (message.pinned === false && message.msgserviceArea === serviceArea && message.target[0] === role)).map((message) => <Message key={message.id} id={message.id} title={message.title} body={message.body} updateMessages={updateMessages} />)
  //           }
  //         if (isAdmin) {
  //           {
  //           messages.filter((message) => (message.pinned === true)).map((message) => <Message key={message.id} id={message.id} title={message.title} body={message.body} updateMessages={updateMessages} />)
  //         }
  //         {
  //           messages.filter((message) => (message.pinned === false)).map((message) => <Message key={message.id} id={message.id} title={message.title} body={message.body} updateMessages={updateMessages} />)
  //         }
  //         }
  //       <form>
  //         <div>
  //           <label htmlFor="title">
  //             Title:
  //             <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
  //           </label>
  //         </div>
  //         <div>
  //           <label htmlFor="body">
  //             Body:
  //             <input type="text" id="body" name="body" value={body} onChange={(e) => setBody(e.target.value)} />
  //           </label>
  //         </div>
  //         <div>
  //           <label htmlFor="serviceArea">
  //             Service Area:
  //             <input type="text" id="serviceArea" name="serviceArea" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
  //           </label>
  //         </div>
  //         <div>
  //           <label htmlFor="mentor">
  //             Mentor
  //             <input type="checkbox" id="mentor" name="mentor" checked={mentor} onChange={(e) => setMentor(e.target.checked)} />
  //           </label>
  //         </div>
  //         <div>
  //           <label htmlFor="caregiver">
  //             Caregiver
  //             <input type="checkbox" id="caregiver" name="caregiver" checked={caregiver} onChange={(e) => setCaregiver(e.target.checked)} />
  //           </label>
  //         </div>
  //         <button type="button" onClick={submitData}>Submit</button>
  //       </form>
  //     </div>
  //   );
  // }
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
