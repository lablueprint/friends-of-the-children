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
  let serviceArea;
  if (calId === constants.calIdAV) {
    className = constants.classAV;
    serviceArea = 'AV';
  } else if (calId === constants.calIdMS) {
    className = constants.classMS;
    serviceArea = 'MS';
  } else {
    className = constants.classFOTC;
    serviceArea = 'All';
  }

  console.log(popupEvent);

  // format the datetime string returned by event object
  function formatDateTime(inputDateTimeString) {
    const inputDate = new Date(inputDateTimeString);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[inputDate.getDay()];
    const month = String(inputDate.getMonth() + 1);
    const day = String(inputDate.getDate());
    const hour = String(inputDate.getHours() % 12 || 12);
    const minute = String(inputDate.getMinutes()).padStart(2, '0');
    const ampm = inputDate.getHours() < 12 ? 'am' : 'pm';
    const formattedDateTime = `${dayOfWeek}, ${month}/${day} ${hour}:${minute}${ampm}`;
    return formattedDateTime;
  }

  return (
    <div>
      <Dialog fullWidth maxWidth="sm" open={openEvent} onClose={closeEvent}>
        <DialogTitle>
          <div className={styles.flex_container}>
            <div className={styles[className]} />
            <h3>{title}</h3>
            {serviceArea}
          </div>
        </DialogTitle>
        <DialogContent>
          {start && formatDateTime(start)}
          {' '}
          -
          {' '}
          {end && formatDateTime(end)}
          <h5>
            Location:
            {' '}
            {location}
          </h5>
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
