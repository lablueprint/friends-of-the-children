// Message Wall is a page that is used to fetch and display messages. When a user submits a message, that message
// is stored in the firebase data. From there, we can retrieve that data from the firebase and display it onto
// the page. If the user is admin, all messages will be displayed, otherwise, it is specified to service area & target.
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Button, Dialog, DialogActions, DialogContent, MenuItem, FormControl, InputLabel, Select,
} from '@mui/material';
import { app, db } from './firebase';
import Message from '../components/Message';
import * as api from '../api';
import styles from '../styles/Messages.module.css';
import { createTextField } from '../components/MuiComps';
import { serviceAreas } from '../constants';

function MessageWall({ profile }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [msgserviceArea, setmsgServiceArea] = useState('');
  const [audience, setAudience] = useState('');
  const [messages, setMessages] = useState([]);
  const [statusMessage, seStatusMessage] = useState('');
  const [open, setOpen] = useState(false);
  const target = [];

  const { role, serviceArea } = profile;

  const theme = createTheme({
    overrides: {
      MuiDialog: {
        paper: {
          backgroundColor: 'blue',
          padding: '30px',
        },
      },
    },
  });

  // async function: an async function is a type of JS function that returns a promise (represents success or failure
  // of our operation) and allows for other code to continue running while a time-consuming operation runs.

  // in this specific getMessagesfunc, we extract the data by making a call to api.getMessages using the await
  // keyword which pauses execution until it's done. Then we update the messages state with the data.
  const getMessagesfunc = async () => {
    const { data } = await api.getFilteredMessages(serviceArea, role);
    setMessages(data);
  };

  // this function's purpose is to update the pinned update. it first stores all the messages in a temp variable
  // so those messages aren't affected, then it goes and finds the with a correspinding id and updates that pinned
  // status. Lastly, it sets the messages state to that message.
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

  const submitData = async (e) => {
    e.preventDefault();
    setOpen(false);

    if (audience === 'Friends') {
      target.push('Mentor');
    } else if (audience === 'Caregivers') {
      target.push('Caregiver');
    } else if (audience === 'ALL') {
      target.push('Mentor');
      target.push('Caregiver');
    }

    const data = {
      title,
      body,
      serviceArea: msgserviceArea === 'ALL' ? serviceAreas : [msgserviceArea],
      target,
      pinned: false,
      date: app.firebase.firestore.Timestamp.fromDate(new Date()),
    };

    // insert api call to send emails here
    const emailData = {
      adminName: profile.firstName,
      replyBackEmail: profile.email,
      role: target,
      serviceArea: msgserviceArea === 'ALL' ? serviceAreas : [msgserviceArea],
    };

    const message = await api.sendEmails(emailData, target);
    seStatusMessage(message);

    // this code updates the database with new messages and resets the state variables back to empty strings after
    // a message is succesfully submitted
    db.collection('messages').doc().set(data).then(getMessagesfunc)
      .then(() => {
        setTitle('');
        setBody('');
        setmsgServiceArea('');
        setAudience('');
      });
  };

  // convert firebase timestamp to a date string, passed as a prop into Message component
  const convertToDate = (timestampObject) => {
    const timestamp = new Date(timestampObject.seconds * 1000 + timestampObject.nanoseconds / 1000000);
    const month = String(timestamp.getMonth() + 1).padStart(2, '0');
    const day = String(timestamp.getDate()).padStart(2, '0');
    const year = String(timestamp.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // this function creates a form with different text fields such as title, body, and serviceArea, and also allows
  // you to set whether the messages are "mentors" or "caregivers". this function also handles the submit button,
  // when you click submit, it will call submitData function which will store everything in the databse.

  // this useEffect hook calls the getMessagesfunc the first time the page is loaded
  useEffect(() => {
    getMessagesfunc();
  }, []);

  // this a conditional and will render different things on the page based on the role. if role is admin, it will
  // display all messages and allow for new messages to be submitted. else, it will display the messages specific
  // to service area and target
  return (
    role.toLowerCase() === 'admin' ? (
      <div>
        <h1 className={styles.announcement}>Announcements</h1>
        <div className={styles.buttonBox}>
          <button className={styles.createPostButton} type="button" onClick={handleClickOpen}>
            + Create Post
          </button>
        </div>

        {messages.some((message) => message.pinned) && <h4 className={styles.pinnedtitle}>Pinned</h4>}
        {
          messages.filter((message) => (message.pinned)).map(
            (message) => <Message key={message.id} id={message.id} title={message.title} body={message.body} pinned={message.pinned} updatePinned={updatePinned} />,
          )
        }
        <h4 className={styles.pinnedtitle}>Posts</h4>
        {
          messages.filter((message) => (!message.pinned)).map(
            (message) => <Message key={message.id} id={message.id} title={message.title} body={message.body} pinned={message.pinned} updatePinned={updatePinned} />,
          )
        }

        <ThemeProvider theme={theme}>
          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogContent>
              <div className={styles.dialogContainer}>
                <h3 className={styles.dialog_h3}>Create a Message</h3>
                <form onSubmit={(e) => submitData(e)}>
                  <div className={styles.labels_container}>
                    {createTextField('Announcement Title', title, setTitle, '100%')}
                  </div>
                  <div className={styles.labels_container}>
                    <p>Service Area</p>
                    <p>Audience</p>
                  </div>
                  <div className={styles.labels_container}>
                    <FormControl sx={{ width: '48%' }}>
                      <InputLabel>Service Area</InputLabel>
                      <Select
                        className={styles.half_width}
                        id="servicearea"
                        label="Service Area"
                        name="servicearea"
                        defaultValue="ALL"
                        value={msgserviceArea}
                        onChange={(e) => setmsgServiceArea(e.target.value)}
                        required
                      >
                        <MenuItem value="ALL">ALL</MenuItem>
                        {serviceAreas.map((sa) => <MenuItem value={sa}>{sa}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ width: '48%' }}>
                      <InputLabel>Audience</InputLabel>
                      <Select
                        className={styles.half_width}
                        id="audience"
                        label="Audience"
                        name="audience"
                        defaultValue="ALL"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        required
                      >
                        <MenuItem value="Friends">Friends</MenuItem>
                        <MenuItem value="Caregivers">Caregivers</MenuItem>
                        <MenuItem value="ALL">ALL</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className={styles.space}> </div>
                  <div className={styles.labels_container}>
                    {createTextField('Write your message here', body, setBody, '100%', 'text', false, '', '', true)}
                  </div>
                  <p>{statusMessage}</p>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Post</Button>
                  </DialogActions>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </ThemeProvider>
      </div>
    ) : (
      <div>
        <h1 className={styles.announcement}>Announcements</h1>
        {messages.some((message) => message.pinned && (message.serviceArea.includes(serviceArea)
        && message.target.includes(role))) && <h4 className={styles.pinnedtitle}>Pinned</h4>}
        {messages.filter(
          (message) => (message.pinned && (message.serviceArea.includes(serviceArea)
        && message.target.includes(role))),
        ).map(
          (message) => <Message key={message.id} id={message.id} message={message} date={convertToDate(message.date)} updatePinned={updatePinned} />,
        )}
        <h4 className={styles.pinnedtitle}>Posts</h4>
        {messages.filter(
          (message) => (!message.pinned && (message.serviceArea.includes(serviceArea)
        && message.target.includes(role))),
        ).map(
          (message) => <Message key={message.id} message={message} date={convertToDate(message.date)} updatePinned={updatePinned} />,
        )}
      </div>
    )
  );
}

// defines the types of properties and required datatypes that the profile object should contain and that should
// be passed into the MessageWall component
MessageWall.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    google: PropTypes.bool,
    mentees: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default MessageWall;
