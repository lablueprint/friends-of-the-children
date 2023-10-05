/* eslint-disable no-unused-vars */
import { React, useState } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Button, Dialog, DialogActions, DialogContent, MenuItem, Select,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { v4 as uuidv4 } from 'uuid';
import {
  ref, uploadBytesResumable,
} from 'firebase/storage';
import * as api from '../api';
import styles from '../styles/Calendar.module.css';
import * as constants from '../constants';
import { createTextField } from './MuiComps';
import { serviceAreas } from '../constants';
import { storage } from '../pages/firebase';
import FileIcon from '../assets/icons/file-minus.svg';

function CalendarEventForm({
  profile, getCalendarRef, open, handleClose,
}) {
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

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [fileLinks, setFileLinks] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const { serviceArea } = profile;
  // Get default event service area based off user's service area
  const [eventServiceArea, setEventServiceArea] = useState(serviceArea.toUpperCase());

  const handleUpload = (file) => {
    // const fileName = uuidv4(file.name);
    const fileName = file.name;
    const storageRef = ref(storage, `/files/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );

        // update progress
        // setPercent(p);
        console.log(p);
      },
      (err) => console.error(err),
    );
    console.log(storageRef.fullPath);
    return storageRef.fullPath;
  };

  const handleFileChange = (e) => {
    const urls = [];
    Array.from(e.target.files).forEach((file) => {
      const currFile = handleUpload(file);
      if (!fileLinks.includes(currFile)) { urls.push(handleUpload(file)); }
    }); // allows you to upload multiple files, disallows duplicates
    setFileLinks((prevUrls) => [...prevUrls, ...urls]);
  };

  const truncateFileName = (filePath) => {
    const fileName = filePath.split('/').pop(); // Get the file name
    const fileExtension = fileName.split('.').pop(); // Get the file extension
    const truncatedFileName = `${fileName.substring(0, 20)}...${fileExtension}`;
    return truncatedFileName;
  };

  const addEvent = (e) => {
    e.preventDefault();
    const attachments = [];
    let calendarId = constants.calIdFOTC; // Admin users will specify event service area
    if (eventServiceArea === 'AV') {
      calendarId = constants.calIdAV;
    } else if (eventServiceArea === 'MS') {
      calendarId = constants.calIdMS;
    }
    // check if user inputs an attachment
    // if (e.target.attachments.value) {
    //   attachments.push({ fileUrl, title: 'an attachment!' });
    // }
    // create json event object
    const event = {
      title,
      description,
      location,
      start,
      end,
      attachments,
      calendarId,
    };
    // add event to actual google calendar
    api.createEvent(event).then((eventID) => {
      // append google calendar's event ID into the fullcalendar event object (so we can update the event through the frontend with google's api, which requires eventID)
      event.id = eventID;
      // add event on fullcalendar
      const calApi = getCalendarRef().current.getApi(); // GETTING CAUGHT HERE GETaPI
      calApi.addEvent(event);
    });
    // TODO: remove this manual reload and fix color of calendar bug
    window.location.reload();
    handleClose();
    e.target.reset();
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogContent>
            <div className={styles.dialogContainer}>
              <form onSubmit={(e) => addEvent(e)}>
                <div className={styles.labels_container}>
                  {createTextField('Event Name', title, setTitle, '100%')}
                </div>
                <div className={styles.labels_container}>
                  <p>Start</p>
                  <p>End</p>
                </div>
                <div className={styles.labels_container}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Start"
                      value={start}
                      onChange={(date) => setStart(date)}
                      slotProps={{
                        textField: {
                          error: false,
                        },
                      }}
                      sx={{ width: '48%', marginRight: '10px' }}
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="End"
                      value={end}
                      onChange={(date) => setEnd(date)}
                      slotProps={{
                        textField: {
                          error: false,
                        },
                      }}
                      sx={{ width: '48%', marginRight: '10px' }}
                    />
                  </LocalizationProvider>
                </div>
                <div className={styles.labels_container}>
                  <p>Audience</p>
                  <p>Location</p>
                </div>
                <div className={styles.labels_container}>
                  <Select
                    id="serviceArea"
                    label="Audience"
                    name="serviceArea"
                    defaultValue="ALL"
                    onChange={(e) => setEventServiceArea(e.target.value)}
                    required
                    sx={{ width: '48%', marginRight: '10px' }}
                  >
                    <MenuItem value="ALL">ALL</MenuItem>
                    {serviceAreas.map((sa) => <MenuItem value={sa} key={sa}>{sa}</MenuItem>)}
                  </Select>
                  {createTextField('Location', location, setLocation, '48%')}
                </div>
                <br />
                {fileLinks.map((file) => (
                  <div className={styles.files_container}>
                    <img src={FileIcon} alt="file icon" />
                    {truncateFileName(file)}
                    <button type="button" onClick={() => { setFileLinks(fileLinks.filter((element) => element !== file)); }}><p>X</p></button>
                  </div>
                ))}
                <div className={styles.labels_container}>
                  <Button
                    variant="contained"
                    component="label"
                  >
                    {fileLinks.length === 0 ? 'Upload Files' : 'Add Files'}
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={handleFileChange}
                    />
                  </Button>
                </div>
                <br />
                {createTextField('Write some meeting details here...', description, setDescription, '100%', 'text', false, '', '', true)}
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit">+ Add Event</Button>
                </DialogActions>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </div>
  );
}

CalendarEventForm.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    google: PropTypes.bool,
    mentees: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  getCalendarRef: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
export default CalendarEventForm;
