import { React } from 'react';
import PropTypes from 'prop-types';
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
// import * as api from '../api';

export default function NewFilePopup(props) {
  const {
    open, handleClose,
  } = props;

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
    console.log(storageRef.fullPath);
    return storageRef.fullPath;
  };

  const handleFileChange = (e) => {
    const urls = [];
    Array.from(e.target.files).forEach((file) => urls.push(handleUpload(file))); // allows you to upload multiple files
    console.log(urls);
    // setFileLinks(urls);
  };

  const submitForm = async () => { // adds a module to the root module page
    console.log('hi');
    handleClose(); // closes add module popup
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={submitForm}>
          <DialogTitle>New File</DialogTitle>
          <DialogContent>
            <FormLabel>Attachments:</FormLabel>
            <br />
            <input type="file" onChange={handleFileChange} multiple />
            {/* <p>
              XXX UPLOADING XXX
              {' '}
              % done
            </p> */}
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

NewFilePopup.propTypes = {
//   id: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
