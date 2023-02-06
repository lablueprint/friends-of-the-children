import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { db } from './firebase';
import styles from '../styles/Modules.module.css';

function Modules({ profile }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [mentor, setMentor] = useState(false);
  const [caregiver, setCaregiver] = useState(false);
  const roles = [];
  const [modules, setModules] = useState([]);
  const { role } = profile;
  const currRole = role.toLowerCase();

  if (mentor) {
    roles.push('mentor');
  }
  if (caregiver) {
    roles.push('caregiver');
  }

  const getModules = () => {
    db.collection('modules').get().then((sc) => {
      const card = [];
      sc.forEach((doc) => {
        const data = doc.data();
        if (data && data.role) {
          data.id = doc.id;
          if (data.parent == null && (currRole === 'admin' || data.role.includes(currRole))) {
            card.push(data);
          }
        }
      });
      setModules(card);
    });
  };

  const submitForm = () => {
    const data = {
      title,
      body,
      serviceArea,
      role: roles,
      children: [],
      parent: null,
    };
    db.collection('modules').doc().set(data);

    setTitle('');
    setBody('');
    setServiceArea('');
    setCaregiver(false);
    setMentor(false);
  };

  useEffect(getModules, [submitForm]);

  if (currRole === 'admin') {
    return (
      <div>
        {modules.map((card) => (
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
        ))}
        <form action="post">
          <h1>Upload Module</h1>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          Body:
          <input type="text" value={body} onChange={(e) => setBody(e.target.value)} />
          Choose a role!!
          Caregiver
          <input type="checkbox" id="caregiver" name="caregiver" checked={caregiver} onChange={(e) => setCaregiver(e.target.checked)} />
          Mentor
          <input type="checkbox" id="mentor" name="mentor" checked={mentor} onChange={(e) => setMentor(e.target.checked)} />
          Service Area:
          <input type="text" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
          {/* Caregiver
        <input type="checkbox" />
        Mentor
        <input type="checkbox" /> */}
          <button type="button" onClick={submitForm}>Submit</button>
        </form>
      </div>
    );
  }
  return (
    <div>
      {modules.map((card) => (
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
      ))}
    </div>
  );
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
