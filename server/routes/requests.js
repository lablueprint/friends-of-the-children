/* eslint-disable no-await-in-loop */
// all api routes
/* eslint-disable import/extensions */
import express from 'express';
import mailchimp from '../mailchimp.js';

import {
  getMentees,
  updateClearance,
  createMentee,
  addMentee,
  getAllMentees,
  getMenteeFolders,
  addMenteeFolder,
  getMenteeFiles,
  addMenteeFile,
  uploadFile,
  getAllProfiles,
  getModules,
  getModulebyId,
  getGoogleaccount,
  updateTextField,
  updateFileLinksField,
  getUsernames,
  messagesController,
  addToMailchimpList,
  updateMailchimpList,
  sendMailchimpEmails,
  updateModuleChildren,
  getProfilesSortedByDate,
  getProfile,
  updateProfile,
  batchUpdateProfile,
  batchDeleteProfile,
  batchAddToList,
  batchDeleteFromList,
  deleteModule,
  deleteFolder,
  deleteFiles,
  deleteMenteeFiles,
  addModule,
} from '../controllers/controllers.js';
import { createEvent, patchEvent, getEvents } from '../controllers/calendarController.js';

const [createMessage, getMessages, getFilteredMessages, pinMessage, deleteMessage] = messagesController;

const router = express.Router();

router.get('/', (req, res) => {
  res.send('We are live!');
});

router.post('/getEvents', getEvents);

// creates an event on google calendar
router.post('/createEvent', createEvent);

// updates an event on google calendar
router.patch('/patchEvent', patchEvent);

// gets all the mentees
router.get('/getMentees/profileID=:profileID', getMentees);

router.get('/getAllMentees', getAllMentees);

// gets the mentee's folders
router.get('/getMenteeFolders/id=:id', getMenteeFolders);

// update clearance
router.post('/updateClearance', updateClearance);

// creates a new mentee doc
router.post('/createMentee', createMentee);

// add a new mentee (link to mentor + create default folders)
router.post('/addMentee/profileID=:profileID/menteeID=:menteeID/caregiverEmail=:caregiverEmail', addMentee);

// creates a new mentee folder
router.post('/addMenteeFolder/id=:id/folder=:folderName', addMenteeFolder);

// gets the mentee's folder contents
router.get('/getMenteeFiles/id=:id/folder=:folderName', getMenteeFiles);

// updates the mentee's folder with the new file
router.post('/addMenteeFile', addMenteeFile);

// uploads a file to firebase
router.post('/uploadFile', uploadFile);

// gets all profiles from firebase collection "profiles"
router.get('/getAllProfiles', getAllProfiles);

// gets all modules from firebase collection "modules"
router.get('/getModules/:currRole', getModules);

// gets a module by ID, and returns that module and all of its direct children
router.get('/getModulebyId/:id/:currRole', getModulebyId);

// gets profile via google email
router.get('/getGoogleaccount/:googleAccount', getGoogleaccount);

// updating module's text field
router.post('/updateTextField/:id/:field', updateTextField);

// updating module's file links field
router.post('/updateFileLinksField/:id/:field/:action/:collectionName', updateFileLinksField);

// gets existing users' usernames (for sign up username conflicts)
router.get('/getUsernames', getUsernames);

// adds a module to firebase
// then adds new module to the parent's children array
router.post('/updateModuleChildren', updateModuleChildren);

// deletes current module and all submodules underneath it
router.delete('/deleteModule/:moduleID', deleteModule);

// deletes current folder
router.delete('/deleteFolder/:menteeID/:folderID', deleteFolder);

// deletes file from module FileLink array field and Firebase storage
router.delete('/deleteFiles', deleteFiles);

// deletes files from a mentee's folder or the Root folder
router.post('/deleteMenteeFiles', deleteMenteeFiles);

// adds a module to Firebase, returns dataRef (containing module's id in firebase)
router.post('/addModule', addModule);

router.post('/createMessage', createMessage);

router.get('/getMessages', getMessages);

router.get('/getFilteredMessages', getFilteredMessages);

router.post('/deleteMessage', deleteMessage);

router.post('/pinMessage', pinMessage);

router.get('/getProfilesSortedByDate', getProfilesSortedByDate);

// get a single user profile
router.get('/getProfile', getProfile);

// update a single user profile
router.post('/updateProfile', updateProfile);

router.post('/batchUpdateProfile', batchUpdateProfile);

router.post('/batchDeleteProfile', batchDeleteProfile);

router.post('/batchAddToList', batchAddToList);

router.post('/batchDeleteFromList', batchDeleteFromList);

// mailchimp routes
router.post('/mailchimp/addToList', addToMailchimpList);

router.post('/mailchimp/updateList', updateMailchimpList);

router.post('/mailchimp/sendEmail', sendMailchimpEmails);

// for testing purposes (can remove from end product) REMOVE BEFORE DEPLOYMENT but keep since it could help with future debugging

router.get('/mailchimp/segments/viewAll', async (req, res) => {
  const response = await mailchimp.lists.listSegments(process.env.MAILCHIMP_AUDIENCE_ID);
  res.status(202).json(response);
});

router.get('/mailchimp/campaigns/viewAll', async (req, res) => {
  const response = await mailchimp.campaigns.list();
  res.status(202).json(response);
});

router.get('/mailchimp/templates/viewAll', async (req, res) => {
  const response = await mailchimp.templates.list();
  res.status(202).json(response);
});

router.get('/mailchimp', async (req, res) => {
  try {
    const response = await mailchimp.root.getRoot();
    res.send(response);
  } catch (error) {
    console.error(error.message);
    res.status(401).json(error.message);
    // console.log(`Error in mailchimp endpoint ${error.message}`);
  }
});

// router.post('/mailchimp/createList', async (req, res) => {
//   try {
//     const response = await mailchimp.lists.createList({
//       name: req.body.name,
//       permission_reminder: 'permission_reminder',
//       email_type_option: true,
//       contact: {
//         company: 'Friends of The Children',
//         city: 'Portland',
//         country: 'US',
//         address1: '44 NE Morris St.',
//         state: 'Oregon', // not required
//         zip: '97212', // not required
//       },
//       campaign_defaults: {
//         from_name: req.body.from_name,
//         from_email: req.body.from_email,
//         subject: 'New Admin Announcement!',
//         language: 'EN_US',
//       },
//     });

//     console.log(`Created list ${req.body.name} successfully`);
//     res.status(202).json(response);
//   } catch (error) {
//     // console.log(`Error in mailchimp createlist endpoint ${error.message}`);
//     res.status(401).json(error.message);
//   }
// });

// router.post('/mailchimp/createMergeField', async (req, res) => {
//   try {
//     const response = await mailchimp.lists.addListMergeField(process.env.MAILCHIMP_AUDIENCE_ID, {
//       name: req.body.name,
//       type: req.body.type,
//     });
//     console.log(`Created merge field ${req.body.name} successfully`);
//     res.status(202).json(response);
//   } catch (error) {
//     // console.log(`error generated by merge field endpoint: ${error.message}`);
//     res.status(401).json(error.message);
//   }
// });

export default router;
