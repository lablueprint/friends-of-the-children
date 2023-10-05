// code functionalities for all the api routes
import {
  collection, addDoc, getDoc, arrayUnion, updateDoc, doc, arrayRemove,
} from 'firebase/firestore';
// import { v4 as uuidv4 } from 'uuid';
import {
  ref, deleteObject,
  uploadBytes, getDownloadURL,
} from 'firebase/storage';
import crypto from 'crypto';
import { uuid } from 'uuidv4';
// eslint-disable-next-line import/extensions
import { db, storage } from '../firebase.js';
// eslint-disable-next-line import/extensions
import mailchimp from '../mailchimp.js';
import messagesController from './messagesController.js';

// calculates the age of a person given a birthdate of YYYY-MM-DD format
const calculateAge = (birthdate) => {
  const today = new Date();
  const birthdateObj = new Date(birthdate);
  let age = today.getFullYear() - birthdateObj.getFullYear();
  const monthDiff = today.getMonth() - birthdateObj.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdateObj.getDate())) {
    age -= 1;
  }
  return age;
};

// update medical clearance
const updateClearance = async (req, res) => {
  try {
    const { id, clearance } = req.body;
    await db.collection('mentees').doc(id)
      .update({
        clearance: !clearance,
      });
    res.status(202).json('success');
  } catch (error) {
    res.status(400).json(error);
  }
};

// returns an array of filtered mentees
const getMentees = async (req, res) => {
  try {
    const { profileID } = req.params;
    const docRef = doc(db, 'profiles', profileID);
    const allMentees = (await getDoc(docRef)).data().mentees;
    db.collection('mentees').get().then((sc) => {
      const tempMentees = [];
      sc.forEach((snap) => {
        const data = snap.data();
        const { id } = snap;
        if (allMentees && allMentees.includes(id)) {
          const age = calculateAge(data.birthday);
          const data2 = {
            ...data,
            id,
            age,
          };
          tempMentees.push(data2);
        }
      });
      res.status(202).json(tempMentees);
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

// returns an array of all existing mentees
const getAllMentees = async (req, res) => {
  try {
    // await user profile data from firebase
    const sc = await db.collection('mentees').get();
    const mentees = [];
    // push each profile into response array
    sc.forEach((dc) => {
      const data = dc.data();
      data.id = dc.id;
      mentees.push(data);
    });
    res.status(202).json(mentees);
  } catch (error) {
    res.status(400).json(error);
  }
};

// adds new mentee doc to firebase mentees collection & returns its doc id
const createMentee = async (req, res) => {
  try {
    const mentee = await db.collection('mentees').add(req.body);
    res.status(202).json(mentee.id);
  } catch (error) {
    res.status(400).json(error);
  }
};

// update mentor's profile by adding the new mentee to mentee array field & create default folders
const addMentee = async (req, res) => {
  try {
    const { profileID, menteeID, caregiverEmail } = req.params;
    const mentorRef = doc(db, 'profiles', profileID);

    // add mentee ID to the caregiver's mentee array (based on the caregiver email)
    await db.collection('profiles').where('email', '==', caregiverEmail).where('role', '==', 'Caregiver')
      .get()
      .then((sc) => {
        sc.forEach((dc) => {
          db.collection('profiles').doc(dc.id)
            .update({
              mentees: arrayUnion(menteeID),
            });
        });
      });

    // add mentee ID to the mentor's mentee array
    await updateDoc(mentorRef, {
      mentees: arrayUnion(menteeID),
    });

    await db.collection('mentees').doc(menteeID).collection('folders').doc('Root')
      .set({
        files: [],
      });

    await db.collection('mentees').doc(menteeID).collection('folders').doc('Images')
      .set({
        files: [],
      });

    await db.collection('mentees').doc(menteeID).collection('folders').doc('Videos')
      .set({
        files: [],
      });

    await db.collection('mentees').doc(menteeID).collection('folders').doc('Flyers')
      .set({
        files: [],
      });

    await db.collection('mentees').doc(menteeID).collection('folders').doc('Links')
      .set({
        files: [],
      });
    res.status(202).json('success');
  } catch (error) {
    res.status(400).json(error);
  }
};

// returns array of the specified mentee's folders
const getMenteeFolders = async (req, res) => {
  try {
    const { id } = req.params;
    const tempFolders = [];
    const customs = [];
    let clear;
    let age;
    db.collection('mentees').doc(id).get().then((sc) => {
      const { birthday } = sc.data();
      age = calculateAge(birthday);
      clear = sc.data().clearance;
    });
    db.collection('mentees').doc(id).collection('folders').get()
      .then((sc) => {
        if (sc.empty) {
          return;
        }
        sc.forEach((currDoc) => {
          const folderName = currDoc.id;
          if (folderName !== 'Root' && folderName !== 'favorites') {
            if (folderName !== 'Videos' && folderName !== 'Images' && folderName !== 'Flyers' && folderName !== 'Links') {
              customs.push(folderName);
            } else {
              tempFolders.push(folderName);
            }
          }
        });
      })
      .then(() => {
        res.status(202).json({
          customs, tempFolders, clear, age,
        });
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

// adds a new folder doc to the mentee's folders collection
const addMenteeFolder = async (req, res) => {
  try {
    const { id, folderName } = req.params;
    await db.collection('mentees').doc(id).collection('folders').doc(folderName)
      .set({
        files: [],
      });
    res.status(200).json('success');
  } catch (error) {
    res.status(400).json(error);
  }
};

// returns a mentee's folder contents (all its files/images/links)
const getMenteeFiles = async (req, res) => {
  try {
    const { id, folderName } = req.params;
    if (folderName !== '') {
      const folderRef = db.collection('mentees').doc(id).collection('folders').doc(folderName);
      const folderSnapshot = await folderRef.get();

      if (folderSnapshot.exists) {
        const data = folderSnapshot.data();
        const { files } = data;
        res.status(202).json(files);
      } else {
        res.status(404).json('Folder not found');
      }
    } else {
      res.status(400).json('Invalid folder name');
    }
  } catch (error) {
    res.status(500).json('An error occurred');
  }
};

// adds file in respective firebase folders (if type image -> Image folder too, etc)
const addMenteeFile = async (req, res) => {
  try {
    const {
      id, folderName, data, type,
    } = req.body;

    if (folderName !== 'Root') {
      await db.collection('mentees').doc(id).collection('folders').doc(folderName)
        .update({
          files: arrayUnion(data),
        });
    }
    await db.collection('mentees').doc(id).collection('folders').doc('Root')
      .update({
        files: arrayUnion({ ...data, category: folderName === 'Root' ? 'All' : folderName }),
      });

    if (type.includes('image')) {
      await db.collection('mentees').doc(id).collection('folders').doc('Images')
        .update({
          files: arrayUnion(data),
        });
    } else if (type.includes('video')) {
      await db.collection('mentees').doc(id).collection('folders').doc('Videos')
        .update({
          files: arrayUnion(data),
        });
    } else if (type === 'link') {
      await db.collection('mentees').doc(id).collection('folders').doc('Links')
        .update({
          files: arrayUnion(data),
        });
    } else if (type.includes('pdf')) {
      await db.collection('mentees').doc(id).collection('folders').doc('Flyers')
        .update({
          files: arrayUnion(data),
        });
    }
    res.status(200).json('success');
  } catch (error) {
    res.status(400).json(error);
  }
};

// uploads file to firebase storage
const uploadFile = async (req, res) => {
  try {
    const { files } = req.body;
    // const name = uuidv4(files.name);
    const { name } = files;
    const storageRef = ref(storage, `/images/${name}`);
    uploadBytes(storageRef, files).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        res.status(202).json(url);
      });
    });
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
    res.status(202).json(docRef.id);
  } catch (error) {
    res.status(400).json(error);
  }
};

// adds module to firebase db
const addModule = async (req, res) => {
  try {
    const { data } = req.body;
    const dataRef = await db.collection('modules').add(data);
    const { id } = dataRef; // newly added module's id
    res.status(202).json(id);
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

// deletes a module and all of its children from firebase
const recursivelyDeleteModules = async (moduleID) => {
  try {
    const moduleRef = await db.collection('modules').doc(moduleID).get();
    const currModule = moduleRef.data();

    if (currModule && currModule.children !== undefined && Array.isArray(currModule.children) && currModule.children.length > 0) {
      // if there are submodules, recursively delete them
      await Promise.all(currModule.children.map(async (child) => {
        await recursivelyDeleteModules(child);
      }));
    }

    if (currModule && currModule.parent !== undefined && currModule.parent) {
      const parentRef = db.collection('modules').doc(currModule.parent);
      const parentRefSnapshot = await parentRef.get();
      const currParent = parentRefSnapshot.data();
      if (currParent && currParent.children) {
        const updatedChildren = currParent.children.filter((id) => id !== moduleID);
        await parentRef.update({ children: updatedChildren });
      }
    }

    // delete all files in current module from firebase storage
    if (currModule && currModule.fileLinks) {
      await Promise.all(currModule.fileLinks.map(async (fileLink) => {
        const fileRef = ref(storage, fileLink);
        await deleteObject(fileRef);
      }));
    }

    // delete the current module
    await db.collection('modules').doc(moduleID).delete();
  } catch (error) {
    console.error(error);
  }
};

// deletes a module, and all of its children from firebase db
const deleteModule = async (req, res) => {
  try {
    const { moduleID } = req.params;
    await recursivelyDeleteModules(moduleID); // helper function
    res.status(202).json('successfully deleted module');
  } catch (error) {
    res.status(400).json('could not delete module');
  }
};

// helper function, removes a mentee's file from various folders
const removeMenteeFile = async (menteeID, file) => {
  console.log('FILE TO DELETE: ', file);
  const { fileType } = file;
  const menteeRef = db.collection('mentees').doc(menteeID).collection('folders');
  // remove file from firebase storage
  if (fileType !== 'link') {
    const fileRef = ref(storage, file.url);
    await deleteObject(fileRef);
  }
  // remove file from custom folder
  if (file.category !== 'All') {
    menteeRef.doc(file.category)
      .update({
        files: arrayRemove(file),
      });
  }
  // remove file from Root folder
  menteeRef.doc('Root')
    .update({
      files: arrayRemove(file),
    });
  // if exists in favorites folder, remove file from there too
  const favRef = await menteeRef.doc('favorites').get();
  if (favRef.exists) {
    menteeRef.doc('favorites')
      .update({
        files: arrayRemove(file),
      });
  }
  // remove from the default folders
  if (fileType.includes('image')) {
    menteeRef.doc('Images')
      .update({
        files: arrayRemove(file),
      });
  } else if (fileType.includes('video')) {
    menteeRef.doc('Videos')
      .update({
        files: arrayRemove(file),
      });
  } else if (fileType === 'link') {
    menteeRef.doc('Links')
      .update({
        files: arrayRemove(file),
      });
  } else if (fileType.includes('pdf')) {
    menteeRef.doc('Flyers')
      .update({
        files: arrayRemove(file),
      });
  }
};

const deleteMenteeFiles = async (req, res) => {
  const {
    menteeID, filesToDelete,
  } = req.body;

  try {
    await Promise.all(filesToDelete.map(async (file) => {
      // get rid of fileSize/fileDate fields if deleting from expandedmentee page
      const fileObj = {
        url: file.url,
        fileType: file.fileType,
        fileName: file.fileName,
        category: file.category,
        fileID: file.fileID,
      };
      await removeMenteeFile(menteeID, fileObj);
    }));
    res.status(202).json('successfully deleted mentee files');
  } catch (error) {
    res.status(400).json('could not delete mentee files');
  }
};

// deletes a folder from a mentee
const deleteFolder = async (req, res) => {
  const { menteeID, folderID } = req.params;
  try {
    const folderRef = db.collection('mentees').doc(menteeID).collection('folders').doc(folderID);
    const sc = await folderRef.get();
    // iterate through the array of files in the doc
    const { files } = sc.data();
    await Promise.all(files.map(async (file) => {
      await removeMenteeFile(menteeID, file);
    }));
    await folderRef.delete();
    res.status(202).json(`successfully deleted folder: ${folderID}`);
  } catch (error) {
    res.status(400).json(`could not delete folder: ${folderID}`);
  }
};

const deleteFiles = async (req, res) => {
  try {
    // delete path from module files array field
    const { moduleID, filesToDelete } = req.body;
    console.log('TO DELETE: ', filesToDelete);
    const moduleRef = await db.collection('modules').doc(moduleID);
    // const moduleRefSnapshot = await moduleRef.get();
    // const currModule = moduleRefSnapshot.data();
    // console.log('currModule is ', currModule);
    filesToDelete.forEach(async (file) => {
      const fileRef = ref(storage, file);
      await deleteObject(fileRef);
    });
    moduleRef.update({
      fileLinks: arrayRemove(...filesToDelete),
    }).then(() => {
      console.log('Array items removed successfully.');
    })
      .catch((error) => {
        console.error('Error removing array items:', error);
      });
    res.status(202).json('successfully deleted module');
  } catch (error) {
    res.status(400).json('could not delete file');
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
    const { id, field } = req.params;
    const { inputText } = req.body;
    if (field === 'body') {
      await db.collection('modules')
        .doc(id)
        .update({ body: inputText })
        .catch((error) => {
        // setUpdateProfileMessage('We ran into an error updating your text field!');
          console.log(error);
        });
    } else if (field === 'title') {
      await db.collection('modules')
        .doc(id)
        .update({ title: inputText })
        .catch((error) => {
          // setUpdateProfileMessage('We ran into an error updating your text field!');
          console.log(error);
        });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateFileLinksField = async (req, res) => {
  try {
    const {
      id, field, action, collectionName,
    } = req.params;
    const newFileLinks = req.body;
    console.log(newFileLinks);

    if (action === 'addFile') {
      const currRef = collectionName === 'mentees' ? db.collection('mentees').doc(id).collection('folders').doc('favorites') : db.collection(collectionName).doc(id);
      const currDoc = await currRef.get();
      const currFiles = currDoc.exists ? currDoc.data()[field] || [] : [];
      const currLinks = newFileLinks || [];
      const updatedLinks = currFiles.concat(currLinks);
      if (currDoc.exists) {
        await currRef.update({ [field]: updatedLinks }).catch((error) => {
          console.log(error);
        });
      } else {
        await currRef.set({ [field]: updatedLinks }).catch((error) => {
          console.log(error);
        });
      }
    } else if (action === 'removeFile') {
      const currRef = collectionName === 'mentees' ? db.collection('mentees').doc(id).collection('folders').doc('favorites') : db.collection(collectionName).doc(id);
      const currDoc = await currRef.get();
      const currFiles = currDoc.exists ? currDoc.data()[field] || [] : [];
      const updatedLinks = currFiles.filter((file) => file.url !== newFileLinks.url);
      await currRef
        .update({ [field]: updatedLinks })
        .catch((error) => {
          console.log(error);
        });
    }
    res.status(202).json({});
  } catch (error) {
    res.status(400).json(error);
  }
};

// checking if the username/email already exists in database (new user signing up)
const getUsernames = async (req, res) => {
  try {
    const usernames = [];
    const emails = [];
    db.collection('profiles').get().then((sc) => {
      sc.forEach((user) => {
        const data = user.data();
        if (data) {
          if (data.username) {
            usernames.push(data.username);
          }
          if (data.email) {
            emails.push(data.email);
          }
        }
      });
      res.status(202).json({ usernames, emails });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getModules = async (req, res) => {
  try {
    const { currRole } = req.params;
    const modules = [];
    const rootFiles = [];
    const favoriteFiles = [];
    db.collection('modules').get().then((sc) => {
      sc.forEach((module) => { // display all modules that match the role of the profile (admin sees all modules)
        const data = module.data();
        if (module.id === 'root') { // fill up the root array (files in 'All Resources')
          const { fileLinks } = data;
          const category = 'All';
          fileLinks.forEach((file) => {
            rootFiles.push({ file, category, id: 'root' });
          });
        } else if (module.id === 'favorites') { // fill up the favorites array
          const { fileLinks } = data;
          fileLinks.forEach((file) => {
            favoriteFiles.push(file);
          });
        }
        if (data && data.role) {
          data.id = module.id;
          // fetching parent-level modules that we have permission to view
          if (currRole === 'admin' || data.role.includes(currRole)) {
            if (data.parent == null) {
              modules.push(data);
            }
            const files = data.fileLinks;
            const category = data.title;
            files.forEach((file) => {
              rootFiles.push({ file, category, id: module.id });
            });
          }
        }
      });
      res.status(202).json({ modules, rootFiles, favoriteFiles });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getProfilesSortedByDate = async (req, res) => {
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

    profiles.sort((a, b) => {
      if (a.date > b.date) {
        return -1;
      }
      if (a.date < b.date) {
        return 1;
      }
      return 0;
    });

    res.status(202).json(profiles);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getProfile = async (req, res) => {
  const { id } = req.query;
  try {
    const profileDoc = await db.collection('profiles').doc(id).get();
    if (!profileDoc.exists) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    const profileData = profileDoc.data();
    res.status(200).json(profileData);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateProfile = async (req, res) => {
  const { id, updatedProfile } = req.body;
  try {
    const profile = await db.collection('profiles').doc(id).update(updatedProfile);
    res.status(202).json(profile);
  } catch (error) {
    res.status(400).json(error);
  }
};

const batchUpdateProfile = async (req, res) => {
  try {
    const batch = db.batch();

    const { profileUpdates } = req.body;

    profileUpdates.forEach((element) => {
      const updateRef = db.collection('profiles').doc(element.id);
      const updates = element.fields;

      batch.update(updateRef, updates);
    });

    await batch.commit();

    res.status(202).json('Profiles Successfully Updated');
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error);
  }
};

const batchDeleteProfile = async (req, res) => {
  try {
    const batch = db.batch();

    const { profileDeletes } = req.body;

    profileDeletes.forEach((element) => {
      const delRef = db.collection('profiles').doc(element);

      batch.delete(delRef);
    });

    await batch.commit();

    res.status(202).json('Profiles Successfully Deleted');
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error);
  }
};

const batchAddToList = async (req, res) => {
  try {
    const { listUpdates } = req.body;

    const memberList = listUpdates.map((element) => ({
      email_address: element.email_address,
      status: 'subscribed',
      merge_fields: {
        FNAME: element.firstName,
        LNAME: element.lastName,
        ROLE: element.role,
        SAREA: element.serviceArea,
      },
    }));

    const response = await mailchimp.lists.batchListMembers(process.env.MAILCHIMP_AUDIENCE_ID, {
      members: memberList,
    });

    res.status(202).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error);
  }
};

const batchDeleteFromList = async (req, res) => {
  try {
    const { listDeletes } = req.body;

    console.log(`lists to be deleted are: ${listDeletes}`);

    const memberList = listDeletes.map((element) => ({
      email_address: element.email_address,
      status: 'archived',
      merge_fields: {
        FNAME: element.firstName,
        LNAME: element.lastName,
        ROLE: element.role,
        SAREA: element.serviceArea,
      },
    }));

    const response = await mailchimp.lists.batchListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
      members: memberList,
    });

    res.status(202).json(response);
  } catch (error) {
    console.log(error.message);
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
    const deletePromises = allCampaigns.map((element) => {
      const delSegmentId = element.recipients.segment_opts.saved_segment_id;
      return mailchimp.lists.deleteSegment(process.env.MAILCHIMP_AUDIENCE_ID, delSegmentId);
    });

    await Promise.all(deletePromises);

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
  messagesController,
  getMentees,
  updateClearance,
  createMentee,
  addMentee,
  getMenteeFolders,
  addMenteeFolder,
  getMenteeFiles,
  addMenteeFile,
  getAllMentees,
  uploadFile,
  getAllProfiles,
  getModules,
  getModulebyId,
  getGoogleaccount,
  updateTextField,
  updateFileLinksField,
  getUsernames,
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
};
