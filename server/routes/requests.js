/* eslint-disable import/extensions */
import express from 'express';
import { db } from '../firebase.js';
import {
  getAllProfiles,
  getModulebyId,
  getGoogleaccount,
  getUsers,
} from '../controllers/controllers.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('We are live!');
});

router.get('/getAllProfiles', getAllProfiles);

router.get('/getModulebyId/:id/:currRole', getModulebyId);

router.get('/getGoogleaccount/:googleAccount', getGoogleaccount);
router.get('/getUsers/:users', getUsers);
export default router;
