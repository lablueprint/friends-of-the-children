// send client-side (frontend) data to server
import axios from 'axios';

const url = 'http://localhost:5000/fotc';

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

// gets all user profiles
export const getAllProfiles = async () => {
  try {
    const allProfiles = await axios.get(`${url}/getAllProfiles`);
    return allProfiles;
  } catch (error) {
    console.error(error.message);
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
// to use this function to get all profiles, put the following in a useEffect:
// async function fetchProfiles(){
//     const {data} = await api.getAllProfiles();
//     console.log(data);
//   }
//   fetchProfiles();
