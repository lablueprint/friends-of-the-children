import { db } from '../firebase.js';
//so that the require('googleapis') statement doesn't throw error
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { google } = require('googleapis');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL, REFRESH_TOKEN } = process.env;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL
);

const createEvent = async(req, res) => {
  try{
    const{title, description, location, attachments, start, end} = req.body;
    oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
    const calendar = google.calendar('v3');
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      supportsAttachments: true,
      requestBody:{
        summary: title,
        description,
        location,
        attachments,
        start: {
          dateTime: new Date(start),
        },
        end: {
          dateTime: new Date(end),
        }
      }
    })
    res.send(response.data);
  } catch(error){
    console.log(error);
  }
};

const patchEvent = async (req, res) => {
  try{
    const{id, start, end} = req.body;
    oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
    const calendar = google.calendar('v3');
    const response = await calendar.events.patch({
      auth: oauth2Client,
      calendarId: 'primary',
      eventId: id,
      requestBody:{
        start: {
          dateTime: start,
        },
        end: {
          dateTime: end,
        }
      }
    })
    res.send(response.data);
  } catch(error){
    console.log(error);
  }
};
import {
  collection, addDoc, arrayUnion, updateDoc, doc,
} from 'firebase/firestore';

const getAllProfiles = async (req, res) => {
  console.log('getAllProfiles');
  const sc = await db.collection('profiles').get();

  const p = [];
  sc.forEach((doc) => {
    const data = doc.data();
    data.id = doc.id;
    p.push(data);
  });
  // res.send(p);
  res.status(202).json(p);
};

const firebase_updateModulechildren = async (req, res) => {
  // console.log("This is docRef in modulechildren", req.body.docRef)
  // console.log("this is moduleRef", req.body.moduleRef)
  const id = req.body.id;
  console.log("this is id", id);
  const docRef = await addDoc(collection(db, 'modules'), req.body.data);
  console.log("this is docref", docRef);
  console.log("docref's id", docRef.id);
  const moduleRef = doc(db, 'modules', id);
  await updateDoc(moduleRef, {
    children: arrayUnion(docRef.id),
  });
  res.status(200).json("success");
}

const getModulebyId = async (req, res) => {
  console.log('getModulebyId');
  const moduleId = req.params.id;
  const { currRole } = req.params;
  // console.log('this is moduleId,', moduleId);
  // console.log('this is currRole', currRole);
  const children_array = [];
  let moddata;
  await db.collection('modules').doc(moduleId).get().then(async (sc) => {
    moddata = sc.data();
    // console.log("reading moddata", moddata);
    // filter the children by role
    for (const child of moddata.children) {
      await db.collection('modules').doc(child).get().then((snap) => {
        const childData = snap.data();
        if (currRole === 'admin' || childData.role.includes(currRole)) {
          const friend = {
            id: child, title: childData.title, role: childData.role,
          };
          children_array.push(friend);
          // console.log('pushed into TC', children_array);
        }
      }); 
    }
  });
  res.status(202).json({ data: moddata, children_array });
};

const getGoogleaccount = async (req, res) => {
  // console.log("getGoogleaccount");
  const googleAccount  = req.params.googleAccount;
  let googleData;
  const account = await db.collection('profiles')
    .where('email', '==', googleAccount)
    .get()
    .then(async (sc) => {
      // TODO: check that there is only one user with usernameSearch (error message if it does not exist)
      for (const doc of sc.docs) {
        const data = await doc.data();
        data.id = doc.id;
        console.log('this is doc.data()', data);
        googleData = data;
      }
    });
  console.log(googleData);
  res.status(202).json(googleData);
};

const getUsers = async (req, res) => {
  console.log('getUsers');
  const usernameSearch = req.params.users;
  let userData;
  let googleData;
  console.log('this is usernameSearch', usernameSearch);
  const profile = await db.collection('profiles').where('username', '==', usernameSearch).get().then(async (sc) => {
    // TODO: check that there is only one user with usernameSearch (error message if it does not exist)
    for (const doc of sc.docs) {
      const data = await doc.data();
      data.id = doc.id;
      console.log('this is doc.data()', data);
      googleData = data;
    }
  });
  console.log(googleData);
  res.status(202).json(googleData);
};

const getMessages = async (req, res) => {
  const message = [];
  await db.collection('messages').get().then((sc) => {
    sc.forEach((doc) => {
      const dat = doc.data();
      dat.id = doc.id;
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
    console.log(message);
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
  firebase_updateModulechildren,
};
