import React, { useState, useEffect } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import Module from '../components/Module';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// load firebase:
firebase.initializeApp(firebaseConfig);

function ExpandedModules() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    firebase.firestore().collection('modules').get().then((sc) => {
      const module = [];
      sc.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;

        module.push(data);
      });

      setModules(module);
    });
  }, []);

  return modules.map((module) => (
    <div key={module.id}>
      <div>
        <Module
          title={module.title}
          body={module.body}
          attachment={module.attachments}
        />
      </div>
    </div>
  ));
}

export default ExpandedModules;

// ExpandedModules.proptype = id
