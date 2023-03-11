import axios from 'axios';

const url = 'http://localhost:5000/fotc'

export const getAllProfiles = async() => {
    try{
        const allProfiles = await axios.get(`${url}/getAllProfiles`);
        return allProfiles;
    }
    catch(error){
        console.log(error.message)
        console.log("could not get all profiles")
    }
}

export const addDoc = async(data) => {
    try {
        let res = await axios.post(`${url}/addDoc`, data);
        return res;

    }
    catch(error) {
        console.log(error.message);
        console.log("could not add doc");
    }
}

export const getDocref = async(collection, id) => {
    try{
        let docref = await axios.get(`${url}/doc/${collection}/${id}`);
        return docref;
    }
    catch(error) {
        console.log(error.message);
        console.log("could not get doc ref");
    }
}

export const updateModulechildren = async(id, data) => {
    try{
        await axios.post(`${url}/updateModulechildren`, {id: id, data: data});
    }
    catch(error) {
        console.log(error.message);
        console.log("could not update module children");
    }
}

export const getModulebyId = async(id, currRole) => { //gets ID of root module that the user clicked on 
    try{
        const module = await axios.get(`${url}/getModulebyId/${id}/${currRole}`);
        return module;
    }
    catch(error){
        console.log(error.message)
        console.log("could not get module by ID")
    }
}

export const getGoogleaccount = async(googleEmail) => { //gets google email
    try{
        const account = await axios.get(`${url}/getGoogleaccount/${googleEmail}`);
        return account;
    }
    catch(error){
        console.log(error.message)
        console.log("could not get google account")
    }
}

export const getUsers = async(users) => {
    try{
        const user = await axios.get(`${url}/getUsers/${users}`);
        console.log("axios user returns", user)
        return user;
    }
    catch(error){
        console.log(error.message)
        console.log("could not get user")
    }
}

export const createList = async(data)=>{
    try{
        const response = await axios.post(`${url}/mailchimp/createList`, data);
        console.log("createList endpoint returns", response);
    }
    catch(error){
        console.log(`occurred in createList endpoint: ${error.message}`);
    }

}

//addToList data should be of the form:
// {
//     email_address: "",
//     firstName: "",
//     lastName: "",
//     role: "",
//     serviceArea: "",
// }
export const addToList = async(data)=>{
    try{
        const response = await axios.post(`${url}/mailchimp/addToList`, data);
        console.log("updateList endpoint returns", response);
    }
    catch(error){
        console.log(`occurred in addToList endpoint: ${error.message}`);
    }

}

//updateList data should just be of the form:
// {
//     ... profile object without email,
//     newEmail: updated email,
//     currentEmail: current email of profile
// }
export const updateList = async(data) =>{
    try{
        const response = await axios.post(`${url}/mailchimp/updateList`, data);
        console.log("updateList endpoint returns", response);
    }
    catch(error){
        console.log(`error occured in updateList endpoint:${error.message}`)
    }
}

export const getMessages = async() => {
    try{
        const messages = await axios.get(`${url}/getMessages`);
        return messages;
    }
    catch(error){
        console.log(error.message);
        console.log("could not get messages")
    }
}
//to use this function to get all profiles, put the following in a useEffect: 
// async function fetchProfiles(){
//     const {data} = await api.getAllProfiles();
//     console.log(data);
//   }
//   fetchProfiles();