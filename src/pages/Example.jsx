import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { db } from './firebase';
import styles from '../styles/Example.module.css';

function Example({ profile }) {
  const { firstName, lastName, username } = profile;
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    db.collection('profiles').get().then((sc) => {
      const p = [];
      sc.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        p.push(data);
      });

      setProfiles(p);
    });
  }, []);

  return (
    <>
      <div>
        <div className={styles.exampleText}>
          {firstName}
        </div>
        <div>
          {lastName}
        </div>
        <div>
          {username}
        </div>
      </div>
      <br />
      {profiles.map((p) => (
        <div key={p.id}>
          <div className={styles.exampleText}>
            {p.firstName}
          </div>
          <div>
            {p.lastName}
          </div>
          <div>
            {p.username}
          </div>
        </div>
      ))}
    </>
  );
}

Example.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};

export default Example;
