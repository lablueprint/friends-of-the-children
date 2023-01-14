import React, { useState } from 'react';
// import bcrypt from 'bcryptjs';
// import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// import firebase from 'firebase/app';
// import 'firebase/firestore';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const getUsers = (usernameSearch) => {
    db.collection('profiles')
      .where('username', '==', usernameSearch)
      .get()
      .then((sc) => {
        // TODO: check that there is only one user with usernameSearch
        sc.forEach((doc) => {
          // console.log(doc.id);
          console.log(doc.data());
        });
      });
  };

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
    console.log(username);
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
