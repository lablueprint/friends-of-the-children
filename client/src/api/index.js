import axios from 'axios';

const url = 'http://localhost:5000/fotc';

export const createEvent = async (eventData) => {
  try {
    const event = await axios.post(`${url}/createEvent`, eventData);
    const eventID = event.data.id;
    return eventID;
  } catch (error) {
    console.log(error.message);
    console.log('could not create event');
  }
  return null;
};

export const updateEvent = async (eventData) => {
  try {
    const event = await axios.put(`${url}/updateEvent`, eventData);
    return event;
  } catch (error) {
    console.log(error.message);
    console.log('could not create event');
  }
  return null;
};

export const getAllProfiles = async () => {
  try {
    const allProfiles = await axios.get(`${url}/getAllProfiles`);
    return allProfiles;
  } catch (error) {
    console.log(error.message);
    console.log('could not get all profiles');
  }
  return null;
};

export const getModulebyId = async (id, currRole) => { // gets ID of root module that the user clicked on
  try {
    const module = await axios.get(`${url}/getModulebyId/${id}/${currRole}`);
    return module;
  } catch (error) {
    console.log(error.message);
    console.log('could not get module by ID');
  }
  return null;
};

export const getGoogleaccount = async (googleEmail) => { // gets google email
  try {
    const account = await axios.get(`${url}/getGoogleaccount/${googleEmail}`);
    return account;
  } catch (error) {
    console.log(error.message);
    console.log('could not get google account');
  }
  return null;
};

export const getUsers = async (users) => {
  try {
    const user = await axios.get(`${url}/getUsers/${users}`);
    console.log('axios user returns', user);
    return user;
  } catch (error) {
    console.log(error.message);
    console.log('could not get user');
  }
  return null;
};

export const createList = async (data) => {
  try {
    const response = await axios.post(`${url}/mailchimp/createList`, data);
    console.log('createList endpoint returns', response);
  } catch (error) {
    console.log(`occurred in createList endpoint: ${error.message}`);
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
  } catch (error) {
    console.log(`occurred in addToList endpoint: ${error.message}`);
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
  } catch (error) {
    console.log(`error occured in updateList endpoint:${error.message}`);
  }
  return null;
};

export const getMessages = async () => {
  try {
    const messages = await axios.get(`${url}/getMessages`);
    return messages;
  } catch (error) {
    console.log(error.message);
    console.log('could not get messages');
  }
  return null;
};
// to use this function to get all profiles, put the following in a useEffect:
// async function fetchProfiles(){
//     const {data} = await api.getAllProfiles();
//     console.log(data);
//   }
//   fetchProfiles();
