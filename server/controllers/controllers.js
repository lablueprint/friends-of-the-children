import {
  collection, addDoc, arrayUnion, updateDoc, doc,
} from 'firebase/firestore';

import crypto from 'crypto';
import { uuid } from 'uuidv4';
import mailchimp from '../mailchimp.js';
import { db } from '../firebase.js';

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

const addDocument = async (req, res) => {
  const data = JSON.stringify(req.body);
  const docRef = await addDoc(collection(db, 'modules'), req.body);
  console.log('this is docref', docRef.id);
  res.status(200).json({ id: docRef.id }); // idk if this is correct - dk
};

const getModulebyId = async (req, res) => {
  console.log('getModulebyId');
  const moduleId = req.params.id;
  const { currRole } = req.params;
  console.log('this is moduleId,', moduleId);
  console.log('this is currRole', currRole);
  const children_array = [];
  let moddata;
  await db.collection('modules').doc(moduleId).get().then(async (sc) => {
    moddata = sc.data();
    console.log('reading moddata', moddata);
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
};

const getGoogleaccount = async (req, res) => {
  console.log('getGoogleaccount');
  const { googleAccount } = req.params;
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
    // console.log(error.message);
    res.status(401).json(error.message);
  }
};

const sendMailchimpEmails = async (req, res) => {
  try {
    // let sendToMentor = false;
    // let sendToCaregiver = true;
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
  addDocument,
  getAllProfiles,
  getModulebyId,
  getGoogleaccount,
  getUsers,
  getMessages,
  addToMailchimpList,
  updateMailchimpList,
  sendMailchimpEmails,
};
