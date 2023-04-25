// code functionalities for all the api routes
import { createRequire } from 'module';
import {
  collection, addDoc, arrayUnion, updateDoc, doc, FieldValue,
} from 'firebase/firestore';

import crypto from 'crypto';
import { uuid } from 'uuidv4';
// eslint-disable-next-line import/extensions
import { db } from '../firebase.js';
// eslint-disable-next-line import/extensions
import mailchimp from '../mailchimp.js';

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

// inserts an event to google calendar
const createEvent = async (req, res) => {
  try {
    // obtain data from client side
    const {
      title, description, location, attachments, start, end,
    } = req.body;
    // set required auth credentials to use gcal api
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const calendar = google.calendar('v3');
    // call gcal api's "insert" method w valid json object
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
    res.status(400).json(error);
  }
};

// updates gcal event without modifying any unspecified event properties (requires eventID)
const patchEvent = async (req, res) => {
  try {
    const { id, start, end } = req.body;
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const calendar = google.calendar('v3');
    // call gcal api's "patch" method
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
    res.status(400).json(error);
  }
};

// returns an array of all existing user profiles
const getAllProfiles = async (req, res) => {
  try {
    // await user profile data from firebase
    const sc = await db.collection('profiles').get();
    const profiles = [];
    // push each profile into response array
    sc.forEach((dc) => {
      const data = dc.data();
      data.id = dc.id;
      profiles.push(data);
    });
    res.status(202).json(profiles);
  } catch (error) {
    res.status(400).json(error);
  }
};

// creates a child module, then adds its id to its parent's 'children' field
const updateModuleChildren = async (req, res) => {
  try {
    // pass in parent id and child (new module) data from frontend
    const { id, data } = req.body;
    // create new module in firebase
    const docRef = await addDoc(collection(db, 'modules'), data);
    // get parent module and update its children array w new id
    const moduleRef = doc(db, 'modules', id);
    await updateDoc(moduleRef, {
      children: arrayUnion(docRef.id),
    });
    res.status(200).json('success');
  } catch (error) {
    res.status(400).json(error);
  }
};

// returns a module's data and a filtered array of its children (by role)
const getModulebyId = async (req, res) => {
  try {
    const { id, currRole } = req.params;
    const childrenArray = [];
    let moduleData;
    await db.collection('modules').doc(id).get().then(async (sc) => {
      moduleData = sc.data();
      // filter children modules by role, push to childrenArray
      await Promise.all(moduleData.children.map(async (child) => {
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
    res.status(202).json({ data: moduleData, childrenArray });
  } catch (error) {
    res.status(400).json(error);
  }
};

const recursivelyDeletemodules = async (moduleID) => {
  try {
    const moduleRef = await db.collection('modules').doc(moduleID).get();
    const currModule = moduleRef.data();
    if (Array.isArray(currModule.children) && currModule.children.length > 0) {
      // if there are submodules, recursively delete them
      for (const child of currModule.children) {
        await recursivelyDeletemodules(child);
      }
    }
    if (currModule.parent) { // if the parent exists, remove the current module from the parent's children array
      const parentRef = db.collection('modules').doc(currModule.parent);
      const parentRefSnapshot = await parentRef.get();
      const currParent = parentRefSnapshot.data();
      const updatedChildren = currParent.children.filter((id) => id !== moduleID);
      await parentRef.update({ children: updatedChildren }).then();
    }
    await db.collection('modules').doc(moduleID).delete(); // delete the current module
  } catch (error) {
    console.log(error);
  }
};

const deleteModule = async (req, res) => {
  try {
    const { moduleID } = req.params;
    await recursivelyDeletemodules(moduleID);
    res.status(202).json('successfully deleted module');
  } catch (error) {
    res.status(400).json('could not delete module');
  }
};

// finds a matching profile in firebase, given a google account email
const getGoogleaccount = async (req, res) => {
  try {
    // gets google account email from route parameter (check /routes)
    const { googleAccount } = req.params;
    // returns data in firebase 'profiles' that matches email
    let googleData;
    await db.collection('profiles').where('email', '==', googleAccount).get().then(async (sc) => {
      // TODO: check that there is only one user with usernameSearch (error message if it does not exist)
      sc.docs.forEach(async (tempDoc) => {
        const data = await tempDoc.data();
        data.id = tempDoc.id;
        googleData = data;
      });
    });
    // error message if user doesn't exist (when data is undefined)
    if (googleData === undefined) {
      res.status(400).json('no existing user!');
    }
    res.status(202).json(googleData);
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateTextField = async (req, res) => {
  try {
    const { updatedText } = req.params;
    db.collection('modules')
      .doc(module.id)
      .update(updatedText)
      .catch((error) => {
        // setUpdateProfileMessage('We ran into an error updating your text field!');
        console.log(error);
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

// checking if the username already exists in database (new user signing up)
const getUsernames = async (req, res) => {
  try {
    const usernames = [];
    db.collection('profiles').get().then((sc) => {
      sc.forEach((user) => {
        const data = user.data();
        if (data && data.username) {
          usernames.push(data.username);
        }
      });
      res.status(202).json(usernames);
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getModules = async (req, res) => {
  try {
    const { currRole } = req.params;
    const modules = [];
    db.collection('modules').get().then((sc) => {
      sc.forEach((module) => { // display all modules that match the role of the profile (admin sees all modules)
        const data = module.data();
        if (data && data.role) {
          data.id = module.id;
          // fetching parent-level modules that we have permission to view
          if (data.parent == null && (currRole === 'admin' || data.role.includes(currRole))) {
            modules.push(data);
          }
        }
      });
      res.status(202).json(modules);
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getMessages = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json(error);
  }
};

// mailchimp controllers

const addToMailchimpList = async (req, res) => {
  try {
    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
      email_address: req.body.email_address,
      status: 'subscribed',
      merge_fields: {
        FNAME: req.body.firstName,
        LNAME: req.body.lastName,
        ROLE: req.body.role,
        SAREA: req.body.serviceArea,
      },
    });

    console.log(`Added to list ${process.env.MAILCHIMP_AUDIENCE_ID}`);
    res.status(202).json(response);
  } catch (error) {
    res.status(401).json(error.message);
  }
};

const updateMailchimpList = async (req, res) => {
  // field == email or status or fname or lname or role or serviceArea
  try {
    const updatedFields = {};
    let subHash = '';

    if ('currentEmail' in req.body) {
      updatedFields.email_address = req.body.currentEmail;
      subHash = crypto.createHash('md5').update(req.body.currentEmail.toLowerCase()).digest('hex');
    } else {
      throw new Error('Request body must contain an email');
    }
    if ('status' in req.body) {
      updatedFields.status = req.body.status;
    }
    if ('newEmail' in req.body) {
      updatedFields.email_address = req.body.newEmail;
    }
    if ('firstName' in req.body || 'lastName' in req.body || 'role' in req.body || 'serviceArea' in req.body) {
      updatedFields.merge_fields = {};
      if ('lastName' in req.body) {
        updatedFields.merge_fields.LNAME = req.body.lastName;
      }
      if ('firstName' in req.body) {
        updatedFields.merge_fields.FNAME = req.body.firstName;
      }
      if ('role' in req.body) {
        updatedFields.merge_fields.ROLE = req.body.role;
      }
      if ('serviceArea' in req.body) {
        updatedFields.merge_fields.SAREA = req.body.serviceArea;
      }
    }

    console.log('updated fields:', updatedFields);

    const response = await mailchimp.lists.updateListMember(process.env.MAILCHIMP_AUDIENCE_ID, subHash, updatedFields);

    res.status(202).json(response);
  } catch (error) {
    res.status(401).json(error.message);
  }
};

const sendMailchimpEmails = async (req, res) => {
  try {
    // pull required emails from firebase
    const sc = await db.collection('profiles').get();

    let records = sc.docs.map((docu) => docu.data());
    records = records.filter((data) => req.body.role.includes(data.role));
    records = records.filter((data) => req.body.serviceArea.includes(data.serviceArea));

    console.log('the records retrieved are: ', records);

    // check for no records
    if (records.length === 0) {
      throw new Error('there are no profiles that match any of the roles and service area combination provided');
    }

    // create a static segment
    const segment = await mailchimp.lists.createSegment(process.env.MAILCHIMP_AUDIENCE_ID, {
      name: `${uuid()}`,
      static_segment: records.map((element) => element.email),
    });

    console.log('segment created');
    // create a campaign
    const campaign = await mailchimp.campaigns.create({
      type: 'regular',
      recipients: {
        segment_opts: {
          saved_segment_id: segment.id,
        },
        list_id: process.env.MAILCHIMP_AUDIENCE_ID,
      },
      settings: {
        subject_line: `New Admin Announcement for ${req.body.role.join(' and ')} on the Portal`,
        preview_text: 'New Announcement Posted!',
        title: `Admin Announcement to ${req.body.role.join(' and ')}`,
        from_name: req.body.adminName,
        reply_to: req.body.replyBackEmail,
        template_id: parseInt(process.env.MAILCHIMP_ADMIN_ANNOUNCEMENT_TEMPLATE_ID, 10),
      },
      content_type: 'template',
    });

    // send the campaign
    const emailResponse = await mailchimp.campaigns.send(campaign.id);

    // get all campaigns + check if any completed campaign segments can be deleted
    let allCampaigns = await mailchimp.campaigns.list();
    allCampaigns = allCampaigns.campaigns.filter((element) => element.status === 'sent' && element.recipients.segment_opts.saved_segment_id);
    for (const element of allCampaigns) {
      const delSegmentId = element.recipients.segment_opts.saved_segment_id;
      const delResponse = await mailchimp.lists.deleteSegment(process.env.MAILCHIMP_AUDIENCE_ID, element.recipients.segment_opts.saved_segment_id);
    }

    // delete the segment (maybe clean up when a new segment is about to be created and store all the segment ids in a list)
    // const response = await mailchimp.lists.deleteSegment(process.env.MAILCHIMP_AUDIENCE_ID, segment.id);
    res.status(202).json(emailResponse);
  } catch (error) {
    console.log(error);
    if (error.message === 'there are no profiles that match any of the roles and service area combination provided') {
      res.status(422).json(error.message);
    } else {
      res.status(401).json(error.message);
    }
  }
};

export {
  createEvent,
  patchEvent,
  getAllProfiles,
  getModules,
  getModulebyId,
  getGoogleaccount,
  updateTextField,
  getUsernames,
  getMessages,
  addToMailchimpList,
  updateMailchimpList,
  sendMailchimpEmails,
  updateModuleChildren,
  deleteModule,
};
