import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import bcrypt from 'bcryptjs';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

/**
 * to resolve the warning about crypto, add fallback options
 * go to \friends-of-the-children\node_modules\react-scripts\config\webpack.config.js
 * Note: you can ctrl + P (cmd + P on Mac) and search for "webpack.config.js" to go to the file
 * from line 305 to line 309 should look like
  ...
    resolve: {
      fallback: {
        "crypto": false
      },
  ...
 */

import { db } from './firebase';

function Login({ updateAppProfile }) { // deconstruct the function props
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [userProfiles, setUserProfiles] = useState(null);
  // const [email, setEmail] = useState('');
  const [profile, setProfile] = useState(null);
  // const [userIsGoogleLoggedIn, setuserIsGoogleLoggedIn] = useState(false);

  const navigate = useNavigate();
  // const profile = useRef();

  const getUserProfiles = () => {
    db.collection('profiles').get().then((sc) => {
      const card = [];
      sc.forEach((doc) => {
        const data = doc.data();
        if (data && data.role) {
          data.id = doc.id;
          card.push(data);
        }
      });
      setUserProfiles(card);
      console.log(card);
    });
  };

  const setCookie = (cname, cvalue, exdays) => {
    console.log(cvalue);
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
  };

  const getCookie = (cname) => {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    console.log(document.cookie);
    console.log(decodedCookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i += 1) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  };

  const checkCookie = () => {
    const user = getCookie('username');
    console.log(user);
    if (user !== '' || user != null) {
      console.log(user);
      console.log(userProfiles);
      if (userProfiles) {
        const tempUserMatch = userProfiles.filter((p) => p.username === user);
        console.log(tempUserMatch);
        if (tempUserMatch !== '') {
          navigate('/modules');
          const data = tempUserMatch[0];
          data.id = tempUserMatch[0].id;
          updateAppProfile(data); // pass to the upper lever (parent components so that it can be used for other pages)
        }
      }
    }
    // } else {
    //   user = prompt('Please enter your name:', '');
    //   if (user !== '' && user != null) {
    //     setCookie('username', user, 30);
    //   }
    // }
  };

  const checkPassword = () => {
    console.log(profile);
    console.log(password);
    // check the hash password only if profile is not empty
    if (profile !== null) {
      console.log(true);
      if (!profile.google) {
        bcrypt.compare(password, profile.password) // compare passwords
          .then((isValid) => {
            if (isValid) { // check whether it is a valid credential
              navigate('/modules');
              console.log('login successful');
              setCookie('username', profile.username, 30); // username, expires in 30 days
              updateAppProfile(profile); // pass to the upper lever (parent components so that it can be used for other pages)
              // console.log(profile);
              // console.log(profile.password);
            } else {
              setError(true);
              console.log('invalid credentials');
            }
          })
          .catch(); // do error checking here if necessary
      } else {
        updateAppProfile(profile); // pass to the upper lever (parent components so that it can be used for other pages)
        navigate('/modules');
      }
      // HELLO WHY DID U GUYS INCLUDE THIS?
      // setProfile(null);
      // setPassword('');
      // setUsername('');
    }
  };

  const getUsers = (usernameSearch) => {
    const tempUserMatch = userProfiles.filter((p) => p.username === usernameSearch);
    console.log(tempUserMatch);
    if (tempUserMatch.length === 0) {
      console.log('if');
      setError(true);
    } else {
      console.log('else');
      console.log(tempUserMatch);
      const data = tempUserMatch[0];
      data.id = tempUserMatch[0].id;
      setProfile(data);
    }

    // console.log('called users');
    // let tempError = true;
    // fb.get()
    //   .where('username', '==', usernameSearch)
    //   .get()
    //   .then((sc) => {
    //     console.log(sc);
    //     // TODO: check that there is only one user with usernameSearch (error message if it does not exist)
    //     sc.forEach((doc) => {
    //       tempError = false;
    //       const data = doc.data();
    //       console.log(data);
    //       data.id = doc.id;
    //       setProfile(data);
    //     });
    //     setError(tempError);
    // if (data != null) {
    //   bcrypt.compare(password, data.password) // compare passwords
    //     .then((isValid) => {
    //       if (isValid) { // check whether it is a valid credential
    //         console.log('login successful');
    //         const { password: profilePassword, ...userProfile } = data; // peform destruction to get profile w/o password
    //         updateAppProfile(userProfile); // pass to the upper lever (parent components so that it can be used for other pages)
    //         navigate('/modules');
    //       } else {
    //         console.log('invalid credentials');
    //       }
    //     })
    //     .catch(); // do error checking here if necessary
    //   setPassword('');
    // }
    // });
  };

  useEffect(() => {
    checkPassword();
  }, [profile, navigate, updateAppProfile]);

  useEffect(() => {
    getUserProfiles();
    checkCookie();
  }, []);

  const provider = new GoogleAuthProvider();

  const getGoogleAccount = (userEmail) => {
    db.collection('profiles')
      .where('email', '==', userEmail)
      .get()
      .then((sc) => {
        // TODO: check that there is only one user with usernameSearch (error message if it does not exist)
        sc.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          // console.log(data);
          setProfile(data);
        });
      });
  };

  function signInWithGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('SC');
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log('credential: ', credential);
        const token = credential.accessToken;
        console.log(token);
        // The signed-in user info.
        const { user: googleUser } = result;
        console.log(googleUser);

        // setGoogleLoggedIn(true);
        // setEmail(googleUser.email);
        getGoogleAccount(googleUser.email);
        // setUsername(googleUser.displayName);
      // ...
      }).catch((e) => {
      // Handle Errors here.
        const errorCode = e.code;
        console.log(errorCode);

        const googleErrorMessage = e.message;
        console.log(googleErrorMessage);

        // The email of the user's account used.
        // const { email } = error.customData;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      });
  }

  const handleSubmit = (event) => {
    setError(false);
    console.log('called');
    event.preventDefault(); // this prevents from page to be refreshing
    console.log(username);
    getUsers(username);
    // setUsername('');
    // setPassword('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">

          <br />
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <br />
        <label htmlFor="password">
          <br />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? <div>Your username or password is incorrect.</div> : <div />}
        <label htmlFor="Submit">
          <br />
          <input type="submit" />
        </label>
        <br />
        <button type="button" onClick={signInWithGoogle}>Continue with Google</button>
      </form>
    </div>
  );
}

// props validation
Login.propTypes = {
  updateAppProfile: PropTypes.func.isRequired,
};

export default Login;
