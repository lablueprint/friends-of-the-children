import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import styles from '../styles/Mentees.module.css';
import * as api from '../api';
// import MenteeImage from '../assets/images/empty_mentees.svg';

function Mentees({ profile }) {
  const [mentees, setMentees] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.getMentees(profile.id).then((tempMentees) => {
      setMentees(tempMentees.data);
    });
  }, []);

  const addChild = async (e) => {
    e.preventDefault();
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const age = e.target.age.value;
    const notes = e.target.notes.value;
    const caregiverFirstName = e.target.caregiverFirstName.value;
    const caregiverLastName = e.target.caregiverLastName.value;
    const caregiverEmail = e.target.caregiverEmail.value;

    const data = {
      firstName,
      lastName,
      age,
      notes,
      caregiverFirstName,
      caregiverLastName,
      caregiverEmail,
    };

    // add new mentee object to mentees collection on firebase
    api.createMentee(data).then((mentee) => {
      const menteeID = mentee.data;
      const data2 = {
        ...data,
        id: menteeID,
      };

      const tempMentees = [...mentees, data2];
      setMentees(tempMentees);

      api.addMentee(profile.id, menteeID);

      setOpen(false);
      e.target.reset();
      api.getMentees(profile.id);
    });
  };

  console.log(mentees);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.mentees_page}>
      <h1>My Mentees</h1>
      <Button variant="contained" onClick={handleClickOpen}>
        Add Child :D
      </Button>

      {/* {mentees.length === 0 && (<img src={MenteeImage} alt="mentees" />)} */}

      <div className={styles.mentees_container}>
        {mentees.map((mentee) => (
          <div key={mentee.id} className={styles.card_container}>
            <Link
              to={`./${mentee.firstName}${mentee.lastName}`}
              state={{
                id: mentee.id, firstName: mentee.firstName, lastName: mentee.lastName, age: mentee.age, caregiver: mentee.caregiverFirstName, folders: mentee.folders,
              }}
            >
              <div className={styles.card}>
                <div className={styles.imageCard} />
                <p>{`${mentee.firstName} ${mentee.lastName}`}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <h3>Add a Mentee</h3>
            <form onSubmit={(e) => addChild(e)}>
              First Name:
              <input type="text" name="firstName" required />
              <br />
              Last Name:
              <input type="text" name="lastName" required />
              <br />
              Age:
              <input type="text" name="age" required />
              <br />
              Notes:
              <input type="text" name="notes" required />
              <h3>Caregiver Information</h3>
              First Name:
              <input type="text" name="caregiverFirstName" required />
              <br />
              Last Name:
              <input type="text" name="caregiverLastName" required />
              <br />
              Email:
              <input type="text" name="caregiverEmail" required />
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Add Child</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>

    </div>
  );
}

Mentees.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
    mentees: PropTypes.arrayOf.isRequired,
  }).isRequired,
};

export default Mentees;
