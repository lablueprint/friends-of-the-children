import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import styles from '../styles/Calendar.module.css';
import * as constants from '../constants';

export default function EventPopup({ openEvent, closeEvent, popupEvent }) {
  const {
    title, start, end, extendedProps, calId,
  } = popupEvent;
  const { location, description } = extendedProps;

  let className;
  if (calId === constants.calIdAV) {
    className = constants.classAV;
  } else if (calId === constants.calIdMS) {
    className = constants.classMS;
  } else {
    className = constants.classFOTC;
  }

  return (
    <div>
      <Dialog fullWidth maxWidth="sm" open={openEvent} onClose={closeEvent}>
        <DialogTitle>
          <div className={styles.flex_container}>
            <div className={styles[className]} />
            <h3>{title}</h3>
          </div>
        </DialogTitle>
        <DialogContent>
          <h5>
            Location:
            {' '}
            {location}
          </h5>
          <h5>Start Time: </h5>
          {JSON.stringify(start)}
          <h5>End Time: </h5>
          {JSON.stringify(end)}
          <h5>Note: </h5>
          {description}
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
    calId: PropTypes.string.isRequired,
  }).isRequired,
};
