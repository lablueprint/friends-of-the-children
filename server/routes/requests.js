/* eslint-disable import/extensions */
import express from 'express';
import { db } from '../firebase.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('We are live!');
});

router.get('/getAllProfiles', async (req, res) => {
  const sc = await db.collection('profiles').get();

  const p = [];
  sc.forEach((doc) => {
    const data = doc.data();
    data.id = doc.id;
    p.push(data);
  });
  // res.send(p);
  res.status(202).json(p);
});

router.get('/getModulebyId/:id/:currRole', async (req, res) => {
  const moduleId = req.params.id;
  const { currRole } = req.params;
  console.log('this is moduleId,', moduleId);
  console.log('this is currRole', currRole);
  const children_array = [];
  let moddata;
  await db.collection('modules').doc(moduleId).get().then(async (sc) => {
    moddata = sc.data();
    // filter the children by role
    for (const child of moddata.children) {
      await db.collection('modules').doc(child).get().then((snap) => {
        const childData = snap.data();
        if (currRole === 'admin' || childData.role.includes(currRole)) {
          const friend = {
            id: child, title: childData.title, role: childData.role,
          };
          children_array.push(friend);
          console.log('pushed into TC', children_array);
        }
      });
    }
  });
  res.status(202).json({ data: moddata, children_array });
});

router.get('/getGoogleaccount/:googleAccount', async (req, res) => {
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
});

router.get('/getUsers/:users', async (req, res) => {
  const usernameSearch = req.params.users;
  let userData;
  console.log('this is usernameSearch', usernameSearch);
  const profile = await db.collection('profiles').where('username', '==', usernameSearch).get().then(async (sc) => {
    // TODO: check that there is only one user with usernameSearch (error message if it does not exist)
    console.log('this is sc', sc.docs);
    for (const doc of sc.docs) {
      const data = await doc.data();
      data.id = doc.id;
      console.log('this is doc.data()', data);
      userData = data;
    }
    // if (data != null) {
    //   bcrypt.compare(password, data.password) // compare passwords
    //     .then((isValid) => {
    //       if (isValid) { // check whether it is a valid credential
    //         console.log('login successful');
    //         const { password: profilePassword, ...userProfile } = data; // peform destruction to get profile w/o password
    //         updateAppProfile(userProfile); // pass to the upper lever (parent components so that it can be used for other pages)
    //         navigate('/modules');
    //       } else {
    //         console.log('invalid credentials');
    //       }
    //     })
    //     .catch(); // do error checking here if necessary
    //   setPassword('');
    // }
  });
  console.log('this is userData', userData);
  res.status(202).json(userData);
});
export default router;
