import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { db } from './firebase';
import styles from '../styles/Modules.module.css';

function Modules({ profile }) {
  // remove later
  console.log(profile);
  const [modules, setModules] = useState([]);
  const { role } = profile;
  const currRole = role.toLowerCase();

  const getModules = () => {
    db.collection('modules').get().then((sc) => {
      const card = [];
      sc.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        if (data.parent == null && (currRole === 'admin' || data.role.includes(currRole))) {
          card.push(data);
        }
      });
      setModules(card);
    });
  };

  useEffect(getModules, []);

  return modules.map((card) => (
    <div key={card.id}>
      <Link
        to="/expanded-module"
        state={{ id: card.id }}
      >
        <div className={styles.card}>
          <h1>{card.title}</h1>
        </div>
      </Link>
    </div>
  ));
}

Modules.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};
export default Modules;
