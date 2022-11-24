import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import styles from '../styles/Example.module.css';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

function Example() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    firebase.firestore().collection('profiles').get().then((sc) => {
      const profile = [];
      sc.forEach((doc) => {
        profile.push(doc.data());
      });

      setProfiles(profile);
    });
  }, []);

  return profiles.map((profile) => (
    <div key={profile.id}>
      <div className={styles.exampleText}>
        {profile.firstName}
      </div>
      <div>
        {profile.lastName}
      </div>
      <div>
        {profile.username}
      </div>
    </div>
  ));
}

export default Example;
