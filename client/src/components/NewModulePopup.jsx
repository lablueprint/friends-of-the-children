import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DialogTitle from '@mui/material/DialogTitle';
import FormLabel from '@mui/material/FormLabel';
import {
  ref, uploadBytesResumable,
} from 'firebase/storage';
import { storage } from '../pages/firebase';
import * as api from '../api';
import { serviceAreas } from '../constants';

export default function NewModulePopup(props) {
  const {
    updateModule, open, handleClose, parentID,
  } = props;

  const roles = [];
  // const [percent, setPercent] = useState(0);
  const [fileLinks, setFileLinks] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mentor, setMentor] = useState(false);
  const [caregiver, setCaregiver] = useState(false);
  const [serviceAreaToSelected, setServiceAreaToSelected] = useState({});

  // add permissions to view module. order doesn't matter
  if (mentor) {
    roles.push('mentor');
  }
  if (caregiver) {
    roles.push('caregiver');
  }

  useEffect(() => {
    serviceAreas.forEach((SA) => {
      const tempServiceAreaToSelected = { ...serviceAreaToSelected };
      tempServiceAreaToSelected[SA] = false;
      setServiceAreaToSelected(tempServiceAreaToSelected);
    });
  }, [serviceAreas]);

  // TODO: Move to backend, figure out how to maintain setPercent once it is moved to the backedn and sent back as a promise chain
  // upload file to Firebase:
  const handleUpload = (file) => {
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
    return storageRef.fullPath;
  };

  const selectedServiceAreas = () => {
    const targetServiceAreas = [];
    serviceAreas.forEach((SA) => {
      if (serviceAreaToSelected[SA] === true) {
        targetServiceAreas.push(SA);
      }
    });
    return targetServiceAreas;
  };

  const submitForm = async (e) => { // adds a module to the root module page
    e.preventDefault();
    const selectedSAs = selectedServiceAreas();
    console.log(selectedSAs);
    const data = { // this goes into NewModulePopup
      title,
      body,
      serviceArea: selectedSAs,
      role: roles,
      children: [],
      parent: parentID,
      fileLinks, // set from handleChange, which triggers handleUpload of all the files

    };

    // if you are adding a child node to an expanded module, update parent's child array and child's parentID
    if (parentID !== null) {
      const expandedModuleID = (await api.updateModuleChildren(parentID, data)).data; // pass in id, data to submit
      data.id = expandedModuleID;
    } else {
      const tempId = (await api.addModule(data)).data; console.log(tempId, 'is tempId');
      data.id = tempId;
      console.log('added tempid', tempId, 'to data');
    }
    // receive module id
    // TODO: Create api call (move db.collection to backend)

    // const tempId = await api.addModule(data);
    // console.log(tempId);
    // const newId = tempId.id;
    // data.id = newId;

    // data = await api.
    console.log('data is ', data);
    updateModule(data);

    setTitle('');
    setBody('');
    setServiceAreaToSelected({});
    setCaregiver(false);
    setMentor(false);
    setFileLinks([]);
    handleClose(); // closes add module popup
  };

  const handleFileChange = (e) => {
    const urls = [];
    Array.from(e.target.files).forEach((file) => urls.push(handleUpload(file))); // allows you to upload multiple files
    setFileLinks(urls);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={submitForm}>
          <DialogTitle>New Module: </DialogTitle>
          <DialogContent>
            <FormLabel>Title</FormLabel>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <FormLabel>Body</FormLabel>
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
            <FormLabel>Target Audience: </FormLabel>
            <br />
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
            <br />
            <FormLabel>Target Service Area: </FormLabel>
            <br />
            {serviceAreas.map((SA) => (
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={serviceAreaToSelected[SA]}
                    onChange={(e) => {
                      const tempServiceAreaToSelected = { ...serviceAreaToSelected };
                      tempServiceAreaToSelected[SA] = e.target.checked;
                      setServiceAreaToSelected(tempServiceAreaToSelected);
                    }}
                    name={SA}
                    color="primary"
                  />
            )}
                label={SA}
              />
            )) }
            <br />
            <FormLabel>Attachments:</FormLabel>
            <br />
            <input type="file" onChange={handleFileChange} multiple />
            <p>
              XXX UPLOADING XXX
              {' '}
              % done
            </p>
          </DialogContent>
          <DialogActions>
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

NewModulePopup.defaultProps = {
  parentID: null,
};

NewModulePopup.propTypes = {
  updateModule: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  // isExpandedModule: PropTypes.bool.isRequired,
  parentID: PropTypes.string,
};
