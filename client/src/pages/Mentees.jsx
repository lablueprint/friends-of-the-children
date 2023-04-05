import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { db } from './firebase';
import styles from '../styles/Mentees.module.css';
// import * as api from '../api';

function Mentees({ profile }) {
  console.log(profile);
  const [mentees, setMentees] = useState([]);

  const getMentees = () => {
    db.collection('mentees').get().then((sc) => {
      const tempMentees = [];
      sc.forEach((doc) => {
        const data = doc.data();
        if (data) {
          data.id = doc.id;
          tempMentees.push(data);
        }
      });
      setMentees(tempMentees);
    });
  };

  const addChild = async (e) => {
    e.preventDefault();
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const age = e.target.age.value;
    const notes = e.target.notes.value;

    const data = {
      firstName,
      lastName,
      age,
      notes,
    };

    const tempId = (await db.collection('mentees').add(data)).id;
    data.id = tempId;

    setMentees([...mentees, data]);

    e.target.reset();
  };

  useEffect(getMentees, []);

  return (
    <div>
      <h1>MY MENTEES</h1>
      <h3>Add a Mentee!</h3>
      <form onSubmit={(e) => addChild(e)}>
        First Name:
        <input type="text" name="firstName" required />
        Last Name:
        <input type="text" name="lastName" required />
        Age:
        <input type="text" name="age" required />
        Notes:
        <input type="text" name="notes" required />
        <button type="submit">Add Child</button>
      </form>

      {mentees.map((mentee) => (
        <div key={mentee.id}>
          <Link
            to={`./${mentee.firstName}${mentee.lastName}`}
            state={{ id: mentee.id }}
          >
            <div className={styles.card}>
              <div className={styles.imageCard} />
              <h1>{`${mentee.firstName} ${mentee.lastName}`}</h1>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

Mentees.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};

export default Mentees;
