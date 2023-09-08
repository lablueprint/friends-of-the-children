// send client-side (frontend) data to server
import axios from 'axios';

const url = process.env.REACT_APP_SERVER_URL;

// get all events
export const getEvents = async (start, end, calendars) => {
  try {
    const events = await axios.post(`${url}/getEvents`, { start, end, calendars });
    return events;
  } catch (error) {
    console.error(error.message);
    console.error('could not get events');
  }
  return null;
};

// creates an event on gcal
export const createEvent = async (eventData) => {
  try {
    // eventData is sent as request body
    const event = await axios.post(`${url}/createEvent`, eventData);
    const eventID = event.data.id;
    return eventID;
  } catch (error) {
    console.error(error.message);
    console.error('could not create this gcal event');
  }
  return null;
};

// updates an event on gcal
export const patchEvent = async (eventData) => {
  try {
    // eventData is sent as request body
    const event = await axios.patch(`${url}/patchEvent`, eventData);
    return event;
  } catch (error) {
    console.error(error.message);
    console.error('could not update this gcal event');
  }
  return null;
};

// get all mentees
export const getAllMentees = async () => {
  try {
    const mentees = await axios.get(`${url}/getAllMentees`);
    return mentees;
  } catch (error) {
    console.error(error.message);
    console.error('could not get mentees');
  }
  return null;
};

// get a profile's specific mentees
export const getMentees = async (profileID) => {
  try {
    const mentees = await axios.get(`${url}/getMentees/profileID=${profileID}`);
    return mentees;
  } catch (error) {
    console.error(error.message);
    console.error('could not get mentees');
  }
  return null;
};

// creates a new mentee doc
export const createMentee = async (stuff) => {
  try {
    const menteeID = await axios.post(`${url}/createMentee`, stuff);
    return menteeID;
  } catch (error) {
    console.log(error.message);
    console.log('could not create mentee document and fetch mentee id');
  }
  return null;
};

// update medical clearance of a mentee
export const updateClearance = async (id, clearance) => {
  try {
    const med = await axios.post(`${url}/updateClearance`, { id, clearance });
    return med;
  } catch (error) {
    console.log(error.message);
    console.log('could not update medical clearance');
  }
  return null;
};

// add a new mentee (link to mentor + create default folders)
export const addMentee = async (profileID, menteeID, caregiverEmail) => {
  try {
    const newMentee = await axios.post(`${url}/addMentee/profileID=${profileID}/menteeID=${menteeID}/caregiverEmail=${caregiverEmail}`);
    return newMentee;
  } catch (error) {
    console.error(error.message);
    console.error('could not add new mentee');
  }
  return null;
};

// get a mentee's folders
export const getMenteeFolders = async (id) => {
  try {
    const folders = await axios.get(`${url}/getMenteeFolders/id=${id}`);
    return folders;
  } catch (error) {
    console.log(error.message);
    console.log('could not get mentee folders');
  }
  return null;
};

// adds a new mentee folder
export const addMenteeFolder = async (id, folderName) => {
  try {
    const newFolder = await axios.post(`${url}/addMenteeFolder/id=${id}/folder=${folderName}`);
    return newFolder;
  } catch (error) {
    console.error(error.message);
    console.error(`could not add the new mentee folder ${folderName}`);
  }
  return null;
};

// get a mentee's folder contents (must specify the mentee's id and folder name)
export const getMenteeFiles = async (id, folderName) => {
  try {
    const folder = await axios.get(`${url}/getMenteeFiles/id=${id}/folder=${folderName}`);
    return folder;
  } catch (error) {
    console.log(error.message);
    console.log(`could not get files in mentee folder ${folderName}`);
  }
  return null;
};

export const addMenteeFile = async (id, folderName, data, type) => {
  try {
    const updatedMentee = await axios.post(`${url}/addMenteeFile`, {
      id, folderName, data, type,
    });
    return updatedMentee;
  } catch (error) {
    console.error(error.message);
    console.error('could not update mentees');
  }
  return null;
};

export const uploadFile = async (files) => {
  try {
    console.log(files);
    const formData = new FormData();
    formData.append('file', this.file);
    const fileURL = await axios.post(`${url}/uploadFile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return fileURL;
  } catch (error) {
    console.error(error.message);
    console.error('could not upload file');
  }
  return null;
};

// gets all user profiles
//
// to use this function to get all profiles, put the following in a useEffect:
// async function fetchProfiles(){
//     const {data} = await api.getAllProfiles();
//     console.log(data);
//   }
//   fetchProfiles();
export const getAllProfiles = async () => {
  try {
    const allProfiles = await axios.get(`${url}/getAllProfiles`);
    return allProfiles;
  } catch (error) {
    console.error(error.message);
    console.error(`url: ${url}/getAllProfiles`);
    console.error('could not get all profiles');
  }
  return null;
};

// creates a new child module
export const updateModuleChildren = async (id, data) => {
  try {
    // id and data are sent as request body
    const updatedChildren = await axios.post(`${url}/updateModuleChildren`, { id, data });
    return updatedChildren;
  } catch (error) {
    console.error(error.message);
    console.error('could not create new module');
  }
  return null;
};

// gets modules, filtered by role
export const getModules = async (currRole) => {
  try {
    // currRole are sent as route parameters
    const modules = await axios.get(`${url}/getModules/${currRole}`);
    return modules;
  } catch (error) {
    console.error(error.message);
    console.error('could not get modules');
  }
  return null;
};

// gets a module and its children, filtered by role
export const getModulebyId = async (id, currRole) => {
  try {
    // id and currRole are sent as route parameters
    const module = await axios.get(`${url}/getModulebyId/${id}/${currRole}`);
    return module;
  } catch (error) {
    console.error(error.message);
    console.error('could not get module by ID');
  }
  return null;
};

// deletes a module with moduleID
export const deleteModule = async (moduleID) => {
  try {
    await axios.delete(`${url}/deleteModule/${moduleID}`);
  } catch (error) {
    console.error(error.message);
    console.error('could not delete modules');
  }
};

// deletes the folder with folderID from the mentee with menteeID
export const deleteFolder = async (menteeID, folderID) => {
  try {
    await axios.delete(`${url}/deleteFolder/${menteeID}/${folderID}`);
  } catch (error) {
    console.error(error.message);
    console.error('could not delete mentee folder');
  }
};

// deletes all files within array filesToDelete belonging to module moduleID
export const deleteFiles = async (moduleID, filesToDelete) => {
  try {
    await axios.delete(`${url}/deleteFiles`, { data: { moduleID, filesToDelete } });
  } catch (error) {
    console.error(error.message);
    console.error('could not delete files');
  }
};

// deletes files in a mentee folder
export const deleteMenteeFiles = async ({
  menteeID, folderID, type, filesToDelete,
}) => {
  try {
    await axios.post(`${url}/deleteMenteeFiles`, {
      menteeID, folderID, type, filesToDelete,
    });
  } catch (error) {
    console.error(error.message);
    console.error('could not delete mentee files');
  }
};

// gets google email
export const getGoogleaccount = async (googleEmail) => {
  try {
    // googleEmail is sent as a route parameter
    const account = await axios.get(`${url}/getGoogleaccount/${googleEmail}`);
    return account;
  } catch (error) {
    console.error(error.message);
    console.error('could not get google account');
  }
  return null;
};

// updates title, body text in a module with id
export const updateTextField = async (inputText, id, field) => {
  try {
    const updatedText = await axios.post(`${url}/updateTextField/${id}/${field}`, { inputText });
    return updatedText;
  } catch (error) {
    console.error(error.message);
    console.error('could not update text field');
  }
  return null;
};

// updates file links array in module with id
export const updateFileLinksField = async (newFileLinks, id, field, action, collectionName) => {
  try {
    const updatedFileLinks = await axios.post(`${url}/updateFileLinksField/${id}/${field}/${action}/${collectionName}`, newFileLinks);
    console.log(updatedFileLinks);
    return updatedFileLinks;
  } catch (error) {
    console.error(error.message);
    console.error('could not update file links field');
  }
  return null;
};

export const getUsernames = async () => {
  try {
    const user = await axios.get(`${url}/getUsernames`);
    return user;
  } catch (error) {
    console.log(error.message);
    console.log('could not get list of usernames from profiles');
  }
  return null;
};

// adds module to firebase
export const addModule = async (data) => {
  try {
    const moduleRef = await axios.post(`${url}/addModule`, { data });
    return moduleRef;
  } catch (error) {
    console.log(error.message);
    console.log('could not add module');
  }
  return null;
};

export const getUserProfiles = async (users) => {
  try {
    const user = await axios.get(`${url}/getUserProfiles/${users}`);
    console.log('axios user returns', user);
    return user;
  } catch (error) {
    console.error(error.message);
    console.error('could not get user');
  }
  return null;
};

export const createList = async (data) => {
  try {
    const response = await axios.post(`${url}/mailchimp/createList`, data);
    console.log('createList endpoint returns', response);
    return response;
  } catch (error) {
    console.error(`occurred in createList endpoint: ${error.message}`);
  }
  return null;
};

// addToList data should be of the form:
// {
//     email_address: "",
//     firstName: "",
//     lastName: "",
//     role: "",
//     serviceArea: "",
// }
export const addToList = async (data) => {
  try {
    const response = await axios.post(`${url}/mailchimp/addToList`, data);
    console.log('updateList endpoint returns', response);
    return response;
  } catch (error) {
    console.error(`occurred in addToList endpoint: ${error.message}`);
  }
  return null;
};

// updateList data should just be of the form:
// {
//     ... profile object without email,
//     newEmail: updated email,
//     currentEmail: current email of profile
// }
export const updateList = async (data) => {
  try {
    const response = await axios.post(`${url}/mailchimp/updateList`, data);
    console.log('updateList endpoint returns', response);
    return response;
  } catch (error) {
    console.error(`error occured in updateList endpoint:${error.message}`);
  }
  return null;
};

// sendEmail data should just be of the form:
// {
//     adminName: "".
//     replyBackEmail:"",
//     role: []
// }
export const sendEmails = async (data) => {
  try {
    const response = await axios.post(`${url}/mailchimp/sendEmail`, data);
    console.log('sendEmail endpoint returns', response);
    return 'Members have been notified via Email!';
  } catch (error) {
    console.error(`error occured in sendEmail endpoint:${error.message}`);
    if (error.response.status === 422) {
      return 'No profiles match the service area and role combinations.';
    }

    return 'Emails could not be sent due to an error!';
  }
};

export const createMessage = async (messageData) => {
  try {
    const res = await axios.post(`${url}/createMessage`, { messageData });
    return res;
  } catch (error) {
    console.error(error.message);
    console.error('could not create message');
  }
  return null;
};

export const getMessages = async () => {
  try {
    const messages = await axios.get(`${url}/getMessages`);
    return messages;
  } catch (error) {
    console.error(error.message);
    console.error('could not get messages');
  }
  return null;
};

export const getFilteredMessages = async (serviceArea, role) => {
  try {
    const messages = await axios.get(`${url}/getFilteredMessages`, { params: { serviceArea, role } });
    return messages;
  } catch (error) {
    console.error(error.message);
    console.error('could not get filtered messages');
  }
  return null;
};

export const pinMessage = async (id, pinned) => {
  try {
    const res = await axios.post(`${url}/pinMessage`, { id, pinned });
    return res;
  } catch (error) {
    console.error(error.message);
    console.error('could not pin/unpin message');
  }
  return null;
};

export const deleteMessage = async (id) => {
  try {
    const deletedMessage = await axios.post(`${url}/deleteMessage`, { id });
    return deletedMessage;
  } catch (error) {
    console.error(error.message);
    console.error('could not delete message');
  }
  return null;
};

export const getProfilesSortedByDate = async () => {
  try {
    const sortedProfiles = await axios.get(`${url}/getProfilesSortedByDate`);
    return sortedProfiles;
  } catch (error) {
    console.error(error.message);
    console.error('could not get profiles sorted by date');
  }
  return null;
};

export const getProfile = async (id) => {
  try {
    const profile = await axios.get(`${url}/getProfile`, { params: { id } });
    return profile;
  } catch (error) {
    console.error(error.message);
    console.error('could not get user profile');
  }
  return null;
};

export const updateProfile = async (id, updatedProfile) => {
  try {
    const profile = await axios.post(`${url}/updateProfile`, { id, updatedProfile });
    return profile;
  } catch (error) {
    console.error(error.message);
    console.error('could not update user profile');
  }
  return null;
};

// profile object should have the following fields:
// [{id: number, fields:{fieldName: fieldValue}}]
export const batchUpdateProfile = async (data) => {
  try {
    const payload = { profileUpdates: data };
    const response = await axios.post(`${url}/batchUpdateProfile`, payload);
    console.log('updateProfile endpoint returns', response);
    return response;
  } catch (error) {
    console.error(`error occured in updateProfile endpoint:${error.message}`);
  }
  return null;
};

export const batchDeleteProfile = async (data) => {
  try {
    const payload = { profileDeletes: data };
    const response = await axios.post(`${url}/batchDeleteProfile`, payload);
    console.log('batchDeleteProfile endpoint returns', response);
    return response;
  } catch (error) {
    console.error(`error occured in batchDeleteProfile endpoint:${error.message}`);
  }
  return null;
};

export const batchAddToList = async (data) => {
  try {
    const payload = { listUpdates: data };
    const response = await axios.post(`${url}/batchAddToList`, payload);
    console.log('batchAddToList endpoint returns', response);
    return response;
  } catch (error) {
    console.error(`error occured in batchAddToList endpoint:${error.message}`);
  }
  return null;
};

export const batchDeleteFromList = async (data) => {
  try {
    const payload = { listDeletes: data };
    const response = await axios.post(`${url}/batchDeleteFromList`, payload);
    console.log('batchDeleteFromList endpoint returns', response);
    return response;
  } catch (error) {
    console.error(`error occured in batchDeleteFromList endpoint:${error.message}`);
  }
  return null;
};
