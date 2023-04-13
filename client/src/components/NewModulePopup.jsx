import { React, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  ref, uploadBytesResumable,
} from 'firebase/storage';
import { db, storage } from '../pages/firebase';
// import styles from '../styles/Modules.module.css';

export default function NewModulePopup(props) {
  const {
    updateModule, open, handleClose,
  } = props;

  //   const [open, setOpen] = React.useState(false);
  const roles = [];
  const [percent, setPercent] = useState(0);
  const [fileLinks, setFileLinks] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [mentor, setMentor] = useState(false);
  const [caregiver, setCaregiver] = useState(false);

  // add permissions to view module. order doesn't matter
  if (mentor) {
    roles.push('mentor');
  }
  if (caregiver) {
    roles.push('caregiver');
  }

  // TODO: Move to backend, figure out how to maintain setPercent once it is moved to the backedn and sent back as a promise chain
  // upload file to Firebase:
  const handleUpload = (file) => {
  // if (!file) {
  //   alert('Please choose a file first!');
  // }
    const fileName = file.name;
    const storageRef = ref(storage, `/files/${fileName}`);
    // setLinks(storageRef.fullPath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );

        // update progress
        setPercent(p);
      },
      (err) => console.log(err),
    );
    console.log(storageRef.fullPath);
    return storageRef.fullPath;
  // set linkstate here:
  };

  const submitForm = async (e) => { // adds a module to the root module page
    e.preventDefault();
    const data = { // this goes into NewModulePopup
      title,
      body,
      serviceArea,
      role: roles,
      children: [],
      parent: null,
      fileLinks, // set from handleChange, which triggers handleUpload of all the files
    };
    console.log(fileLinks);
    // receive module id
    // TODO: Create api call (move db.collection to backend)
    const tempId = (await db.collection('modules').add(data)).id;

    data.id = tempId;

    console.log(data);
    updateModule(data);

    setTitle('');
    setBody('');
    setServiceArea('');
    setCaregiver(false);
    setMentor(false);
    setFileLinks([]);
  };

  const handleFileChange = (e) => {
    const urls = [];
    Array.from(e.target.files).forEach((file) => urls.push(handleUpload(file))); // allows you to upload multiple files
    setFileLinks(urls);
  };

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  //   const handleClose = () => {
  //     setOpen(false);
  //   };

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Add module
      </Button> */}
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={submitForm}>
          <DialogTitle>New Module: </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              label="Body"
              fullWidth
              multiline
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={mentor}
                  onChange={(e) => setMentor(e.target.checked)}
                  name="mentor"
                  color="primary"
                />
            )}
              label="Mentor"
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={caregiver}
                  onChange={(e) => setCaregiver(e.target.checked)}
                  name="caregiver"
                  color="primary"
                />
            )}
              label="Caregiver"
            />
            <TextField
            //   className={classes.formControl}
              label="Service Area"
              fullWidth
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              required
            />
            <Typography variant="body2" color="textSecondary">
              Attachments:
            </Typography>
            <input type="file" onChange={handleFileChange} multiple />
            <p>
              {percent}
              {' '}
              % done
            </p>
          </DialogContent>
          <DialogActions>
            {/* <Button onClick={handleClose} color="primary">
            Cancel
          </Button> */}
            <Button
              type="submit"
              color="primary"
              variant="contained"
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

NewModulePopup.propTypes = {
  updateModule: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
