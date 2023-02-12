import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { db } from './firebase';
import styles from '../styles/Example.module.css';
import * as api from '../api';

function Example({ profile }) {
  const { firstName, lastName, username } = profile;
  const [profiles, setProfiles] = useState([]);

  useEffect( () => {
    async function fetchProfiles(){
      const {data} = await api.getAllProfiles();
      setProfiles(data);
    }
    fetchProfiles();
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
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};

export default Example;
