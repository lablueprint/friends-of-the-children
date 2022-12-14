import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { db } from './firebase';
import Module from '../components/Module';

function Modules(profile) {
  // remove later
  console.log(profile);

  const [modules, setModules] = useState([]);

  const getModules = () => {
    db.collection('modules').get().then((sc) => {
      const card = [];
      sc.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        card.push(data);
      });
      setModules(card);
    });
  };

  useEffect(getModules, []);

  return modules.map((card) => (
    <div key={card.id}>
      <Link to="/expanded-module" state={{ title: card.title, body: card.body, attachments: card.attachments }}>
        <Module
          title={card.title}
        />
      </Link>
    </div>
  ));
}

Modules.propTypes = {
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

export default Modules;
