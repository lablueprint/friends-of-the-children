import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Popup({ errorTitle, errorCode }) {
  const [open, setOpen] = useState(true);
  // const [error, setError] = useState('')

  /*
  const handleClickOpen = () => {
    setOpen(true);
  };
  */
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/*
      <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button>
      */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          { `${errorTitle} error!` }
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { `${errorCode}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

Popup.propTypes = {
  errorTitle: PropTypes.string.isRequired,
  errorCode: PropTypes.string.isRequired,
};
