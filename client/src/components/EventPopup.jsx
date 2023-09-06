import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function EventPopup({ openEvent, closeEvent, popupEvent }) {
  return (
    <div>
      <Dialog open={openEvent} onClose={closeEvent}>
        <DialogTitle>{popupEvent.title}</DialogTitle>
        <DialogContent>
          <h5>Location: </h5>
          {popupEvent.extendedProps.location}
          <h5>Start Time: </h5>
          {JSON.stringify(popupEvent.start)}
          <h5>End Time: </h5>
          {JSON.stringify(popupEvent.end)}
          <h5>Note: </h5>
          {popupEvent.extendedProps.description}
        </DialogContent>
      </Dialog>
    </div>
  );
}

EventPopup.propTypes = {
  openEvent: PropTypes.bool.isRequired,
  closeEvent: PropTypes.func.isRequired,
  popupEvent: PropTypes.shape({
    title: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    extendedProps: PropTypes.shape({
      location: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
