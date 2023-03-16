// code functionalities for all the api routes

import { createRequire } from 'module';
import {
  collection, addDoc, arrayUnion, updateDoc, doc,
} from 'firebase/firestore';
// eslint-disable-next-line import/extensions
import { db } from '../firebase.js';

// import google api
const require = createRequire(import.meta.url);
const { google } = require('googleapis');

// fotc google auth information
const {
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL, REFRESH_TOKEN,
} = process.env;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
);

// insert an event to google calendar
const createEvent = async (req, res) => {
  try {
    // obtain data from client side
    const {
      title, description, location, attachments, start, end,
    } = req.body;
    // set required auth credentials to use gcal api
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const calendar = google.calendar('v3');
    // call gcal api's "insert" method
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      supportsAttachments: true,
      requestBody: {
        summary: title,
        description,
        location,
        attachments,
        start: {
          dateTime: new Date(start),
        },
        end: {
          dateTime: new Date(end),
        },
      },
    });
    // promise chain to send response back to client
    res.status(202).json(response.data);
  } catch (error) {
    res.status(403).json(error);
  }
};

// updates gcal event without modifying event properties that you don't specify to (requires eventID)
const patchEvent = async (req, res) => {
  try {
    const { id, start, end } = req.body;
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const calendar = google.calendar('v3');
    const response = await calendar.events.patch({
      auth: oauth2Client,
      calendarId: 'primary',
      eventId: id,
      requestBody: {
        start: {
          dateTime: start,
          date: null,
        },
        end: {
          dateTime: end,
          date: null,
        },
      },
    });
    res.status(202).json(response.data);
  } catch (error) {
    res.status(403).json(error);
  }
};

const getAllProfiles = async (req, res) => {
  const sc = await db.collection('profiles').get();
  const p = [];
  sc.forEach((dc) => {
    const data = dc.data();
    data.id = dc.id;
    p.push(data);
  });
  res.status(202).json(p);
};

const updateModuleChildren = async (req, res) => {
  const { id } = req.body;
  const docRef = await addDoc(collection(db, 'modules'), req.body.data);
  const moduleRef = doc(db, 'modules', id);
  await updateDoc(moduleRef, {
    children: arrayUnion(docRef.id),
  });
  res.status(200).json('success');
};

const getModulebyId = async (req, res) => {
  const moduleId = req.params.id;
  const { currRole } = req.params;
  const childrenArray = [];
  let moddata;
  await db.collection('modules').doc(moduleId).get().then(async (sc) => {
    moddata = sc.data();
    // filter the children by role
    await Promise.all(moddata.children.map(async (child) => {
      const snap = await db.collection('modules').doc(child).get();
      const childData = snap.data();
      if (currRole === 'admin' || childData.role.includes(currRole)) {
        const friend = {
          id: child, title: childData.title, role: childData.role,
        };
        childrenArray.push(friend);
      }
    }));
  });
  res.status(202).json({ data: moddata, childrenArray });
};

const getGoogleaccount = async (req, res) => {
  const { googleAccount } = req.params;
  let googleData;
  await db.collection('profiles')
    .where('email', '==', googleAccount)
    .get()
    .then(async (sc) => {
      // TODO: check that there is only one user with usernameSearch (error message if it does not exist)
      sc.docs.forEach(async (dc) => {
        const data = await dc.data();
        data.id = dc.id;
        googleData = data;
      });
    });
  res.status(202).json(googleData);
};

const getUsers = async (req, res) => {
  const usernameSearch = req.params.users;
  let googleData;
  await db.collection('profiles').where('username', '==', usernameSearch).get().then(async (sc) => {
    // TODO: check that there is only one user with usernameSearch (error message if it does not exist)
    sc.docs.forEach(async (dc) => {
      const data = await dc.data();
      data.id = dc.id;
      googleData = data;
    });
  });
  res.status(202).json(googleData);
};

const getMessages = async (req, res) => {
  const message = [];
  await db.collection('messages').get().then((sc) => {
    sc.forEach((dc) => {
      const dat = dc.data();
      dat.id = dc.id;
      message.push(dat);
    });
    // sort in reverse chronological order (i.e. newest at first)
    message.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return 0;
    });
    res.status(202).json(message);
  });
};

export {
  createEvent,
  patchEvent,
  getAllProfiles,
  getModulebyId,
  getGoogleaccount,
  getUsers,
  getMessages,
  updateModuleChildren,
};
