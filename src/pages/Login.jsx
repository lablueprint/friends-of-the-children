import React, { useState, useEffect } from 'react';
// import bcrypt from 'bcryptjs';
// import { doc, getDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import { db } from './firebase';

// import firebase from 'firebase/app';
// import 'firebase/firestore';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState('');
  // const profile = useRef();

  const getUsers = (usernameSearch) => {
    db.collection('profiles')
      .where('username', '==', usernameSearch)
      .get()
      .then((sc) => {
        // TODO: check that there is only one user with usernameSearch
        sc.forEach((doc) => {
          // console.log(doc.id);
          const data = doc.data();
          data.id = doc.id;
          setProfile(data);
          // console.log(doc.data());
        });
      });
  };

  useEffect(() => {
    // console.log(profile.username);
    // console.log('here');

    // check the hash password only if profile is not empty
    if (profile !== null) {
      bcrypt.hash(password, 10)
        .then((hashedPassword) => {
          console.log('here', hashedPassword);
          console.log('there', profile.password);
          if (hashedPassword === profile.password) {
            console.log('valid credentials');
          } else {
            console.log('invalid credentials');
          }
        });
    }
  // eslint-disable-next-line
  }, [profile]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(username);
    // console.log(password);

    // search for the username and compare hashed passwords to log in
    // bcrypt.hash(password, 10) // asychronous hashing function
    //   .then((hashedps) => {
    //     db.collection('users').doc().set({ username, hashedps });
    //   });

    // const docRef = doc(db, "cities", "SF");
    // getDoc(docRef).then(
    //   () =>
    // );

    // if (docSnap.exists()) {
    //   console.log("Document data:", docSnap.data());
    // } else {
    //   // doc.data() will be undefined in this case
    //   console.log("No such document!");
    // }

    // console.log('herehrer');œ
    // const searchUsers = (usernameSearch) => db
    //   .collection('profiles')
    //   .where('username', '==', usernameSearch)
    //   .get()
    //   .then((snapshot) => snapshot.docs.map((doc) => doc.data()));

    // searchUsers(username)
    //   .then((users) => {
    //     console.log('here');
    //     console.log(users);
    //   })
    //   .catch((err) => {
    //     console.log('failed', err);
    //   });
    getUsers(username);
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <form>
        <label htmlFor="username">
          Username:
          <br />
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <br />
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <label htmlFor="Submit">
          <br />
          <input type="submit" onClick={handleSubmit} />
        </label>
      </form>
    </div>
  );
}
export default Login;
