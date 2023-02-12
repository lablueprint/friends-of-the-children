import axios from 'axios';

const url = 'http://localhost:5000/fotc'

export const getAllProfiles = async() => {
    try{
        const allProfiles = await axios.get(`${url}/getAllProfiles`);
        return allProfiles;
    }
    catch(error){
        console.log(error.message)
    }
}

//to use this function to get all profiles, put the following in a useEffect: 
// async function fetchProfiles(){
//     const {data} = await api.getAllProfiles();
//     console.log(data);
//   }
//   fetchProfiles();