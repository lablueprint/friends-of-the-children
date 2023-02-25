/* eslint-disable import/extensions */
import express from 'express';
import { db } from '../firebase.js';
import {
  getAllProfiles,
  getModulebyId,
  getGoogleaccount,
  getUsers,
  getMessages,
} from '../controllers/controllers.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('We are live!');
});
//gets all profiles from firebase collection "profiles"
router.get('/getAllProfiles', getAllProfiles);

//gets a module by ID, and returns that module and all of its direct children
router.get('/getModulebyId/:id/:currRole', getModulebyId);

//gets profile via google email
router.get('/getGoogleaccount/:googleAccount', getGoogleaccount);

//gets profile via regular sign in
router.get('/getUsers/:users', getUsers);

router.get('/getMessages', getMessages);

export default router;
