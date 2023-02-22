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

export const getGoogleaccount = async() => {
    try{
        const account = await axios.get(`${url}/getGoogleaccount/:googleAccount`);
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
//to use this function to get all profiles, put the following in a useEffect: 
// async function fetchProfiles(){
//     const {data} = await api.getAllProfiles();
//     console.log(data);
//   }
//   fetchProfiles();