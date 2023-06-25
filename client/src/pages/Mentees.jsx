import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  MenuItem, FormControl, InputLabel, Select,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SmileyIcon from '../assets/icons/smiley.svg';
import TigerIcon from '../assets/icons/tiger_avatar.svg';
import BirdIcon from '../assets/icons/bird_avatar.png';
import DogIcon from '../assets/icons/dog_avatar.svg';
import BearIcon from '../assets/icons/bear_avatar.svg';
import MouseIcon from '../assets/icons/mouse_avatar.svg';
import styles from '../styles/Mentees.module.css';
import * as api from '../api';
import { createTextField } from '../components/MuiComps';
// import MenteeImage from '../assets/images/empty_mentees.svg';

const theme = createTheme({
  overrides: {
    MuiDialog: {
      paper: {
        backgroundColor: 'blue',
        padding: '30px',
      },
    },
  },
});

function Mentees({ profile, updateAppProfile }) {
  const [selectedImage, setSelectedImage] = useState(TigerIcon);
  const avatars = [TigerIcon, BirdIcon, BearIcon, DogIcon, MouseIcon];
  const [mentees, setMentees] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [clearance, setClearance] = useState(false);
  const [notes, setNotes] = useState('');
  const [caregiverFirstName, setCaregiverFirstName] = useState('');
  const [caregiverLastName, setCaregiverLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [open, setOpen] = useState(false);
  const role = (profile.role).toLowerCase();

  useEffect(() => {
    if (role === 'admin') {
      api.getAllMentees().then((tempMentees) => {
        if (tempMentees) {
          setMentees(tempMentees.data);
        }
      });
    } else {
      api.getMentees(profile.id).then((tempMentees) => {
        if (tempMentees) {
          setMentees(tempMentees.data);
        }
      });
    }
  }, []);

  // calculates the age of a person given a birthdate of YYYY-MM-DD format
  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthdateObj = new Date(birthdate);
    let age = today.getFullYear() - birthdateObj.getFullYear();
    const monthDiff = today.getMonth() - birthdateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdateObj.getDate())) {
      age -= 1;
    }
    return age;
  };

  const addChild = async (e) => {
    e.preventDefault();

    // get the birthdate from datepicker calednar in YYYY-MM-DD format
    const formattedDate = birthday ? birthday.format('YYYY-MM-DD') : '';
    // get age of youth
    const age = calculateAge(formattedDate);

    const data = {
      firstName,
      lastName,
      age,
      birthday: formattedDate,
      clearance,
      notes,
      caregiverFirstName,
      caregiverLastName,
      email,
      address,
      phone,
      avatar: selectedImage,
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

      api.addMentee(profile.id, menteeID, email);

      const newProfile = {
        ...profile,
        mentees: [...profile.mentees, menteeID],
      };
      updateAppProfile(newProfile);

      setOpen(false);
      e.target.reset();
      api.getMentees(profile.id);
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageChange = (avatar) => {
    const selectedImageUrl = avatar;
    console.log(selectedImageUrl);
    setSelectedImage(selectedImageUrl);
  };

  return (
    <div className={styles.mentees_page}>
      <div className={styles.head_container}>
        <h1>My Youth</h1>
        {role === 'mentor' && (
        <button type="button" onClick={handleClickOpen}>
          <img src={SmileyIcon} alt="smiley icon" />
          Add Youth
        </button>
        )}
      </div>

      {/* has this weird glitch that shows the image for a split second if you reload the page... */}
      {/* {(mentees.length === 0) && (<img src={MenteeImage} alt="mentees" />)} */}

      <div className={styles.mentees_container}>
        {mentees.map((mentee) => (
          <div key={mentee.id} className={styles.card_container}>
            <Link
              to={`./${mentee.firstName}${mentee.lastName}`}
              state={{
                id: mentee.id, firstName: mentee.firstName, lastName: mentee.lastName, age: mentee.age, caregiver: mentee.caregiverFirstName, folders: mentee.folders, medicalClearance: mentee.medicalClearance, avatar: mentee.avatar,
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
        <ThemeProvider theme={theme}>
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogContent>
              <div className={styles.dialogContainer}>
                <h3 className={styles.dialog_h3}>Add a Youth</h3>
                <form onSubmit={(e) => addChild(e)}>
                  <div className={styles.labels_container}>
                    <p>First Name</p>
                    <p>Last Name</p>
                  </div>
                  <div className={styles.labels_container}>
                    {createTextField('First Name', firstName, setFirstName, '48%')}
                    {createTextField('Last Name', lastName, setLastName, '48%')}
                  </div>
                  <div className={styles.labels_container}>
                    <p />
                  </div>
                  <div className={styles.labels_container}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Birthday"
                        value={birthday}
                        onChange={(date) => setBirthday(date)}
                        slotProps={{
                          textField: {
                            error: false,
                          },
                        }}
                        sx={{ width: '48%', marginRight: '10px' }}
                      />
                    </LocalizationProvider>
                    <FormControl sx={{ width: '48%' }}>
                      <InputLabel>Media Clearance </InputLabel>
                      <Select
                        id="med"
                        label="Media Clearance"
                        name="mediaClearance"
                        defaultValue="False"
                        value={clearance}
                        onChange={(e) => setClearance(e.target.value)}
                        required
                      >
                        <MenuItem value="false">Not Cleared</MenuItem>
                        <MenuItem value="true">Cleared</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className={styles.labels_container}>
                    <p>Notes</p>
                  </div>
                  <div className={styles.labels_container}>
                    {createTextField('Notes', notes, setNotes, '100%')}
                  </div>

                  <h3 className={`${styles.dialog_h3} ${styles.dialog_h3_2}`}>Caregiver Information</h3>
                  <div className={styles.labels_container}>
                    <p>First Name</p>
                    <p>Last Name</p>
                  </div>
                  <div className={styles.labels_container}>
                    {createTextField('First Name', caregiverFirstName, setCaregiverFirstName, '48%')}
                    {createTextField('Last Name', caregiverLastName, setCaregiverLastName, '48%')}
                  </div>
                  <div className={styles.labels_container}>
                    <p>Email</p>
                    <p>Phone Number</p>
                  </div>
                  <div className={styles.labels_container}>
                    {createTextField('Email', email, setEmail, '48%')}
                    {createTextField('Phone Number', phone, setPhone, '48%')}
                  </div>
                  <div className={styles.labels_container}>
                    <p>Address</p>
                  </div>
                  <div className={styles.labels_container}>
                    {createTextField('Address', address, setAddress, '100%')}
                  </div>

                  <h3 className={`${styles.dialog_h3} ${styles.dialog_h3_2}`}>Choose an Avatar</h3>
                  {avatars.map((avatar) => (
                    <React.Fragment key={avatar}>
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label
                        htmlFor={avatar}
                        className={`${styles.image_label} ${
                          selectedImage === avatar ? styles.selected : ''
                        }`}
                      >
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
                        <img src={avatar} alt="s" onClick={() => handleImageChange(avatar)} />
                      </label>
                      <input
                        type="radio"
                        id={avatar}
                        name={avatar}
                        value={avatar}
                      />
                    </React.Fragment>
                  ))}

                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Save</Button>
                  </DialogActions>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </ThemeProvider>
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
    mentees: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  updateAppProfile: PropTypes.func.isRequired,
};

export default Mentees;
