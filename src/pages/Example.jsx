import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import styles from '../styles/Example.module.css';

function Example() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    db.collection('profiles').get().then((sc) => {
      const profile = [];
      sc.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        profile.push(data);
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
