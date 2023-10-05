import { React, useState } from 'react';
import PropTypes from 'prop-types';
// import { v4 as uuidv4 } from 'uuid';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import FormLabel from '@mui/material/FormLabel';
import {
  ref, uploadBytesResumable,
} from 'firebase/storage';
import { storage } from '../pages/firebase';
import * as api from '../api';

export default function NewFilePopup(props) {
  const {
    open, handleClose, currModuleFiles, id,
  } = props;

  const [fileLinks, setFileLinks] = useState(currModuleFiles);
  const [percent, setPercent] = useState(0);

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
        setPercent(p);
        console.log(p);
      },
      (err) => console.error(err),
    );
    console.log(fileName);
    console.log(storageRef.fullPath);
    return storageRef.fullPath;
  };

  const handleFileChange = (e) => {
    const urls = [];
    Array.from(e.target.files).forEach((file) => urls.push(handleUpload(file))); // allows you to upload multiple files
    setFileLinks(urls);
  };

  const updateFileLinksFirebase = async () => {
    await api.updateFileLinksField(fileLinks, id, 'fileLinks', 'addFile', 'modules');
    // // Only call firebase if edits were made
    // if (titleText !== title && bodyText !== body) {
    //   await Promise.all([api.updateTextField(titleText, id, 'title'), api.updateTextField(bodyText, id, 'body')]);
    // } else if (titleText !== title) {
    //   await api.updateTextField(titleText, id, 'title');
    // } else if (bodyText !== body) {
    //   await api.updateTextField(bodyText, id, 'body');
    // }
  };

  const submitForm = async (event) => {
    event.preventDefault();
    updateFileLinksFirebase();
    handleClose(); // closes add module popup
    window.location.reload(false);
    console.log(fileLinks);
    console.log(id);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={submitForm}>
          <DialogTitle>Add New File(s)</DialogTitle>
          <DialogContent>
            <FormLabel>Attachments:</FormLabel>
            <br />
            <input type="file" onChange={handleFileChange} multiple />
            {percent !== 0
            && (
            <p>
              {percent}
              % done
            </p>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={percent !== 100}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

NewFilePopup.propTypes = {
  id: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  currModuleFiles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
