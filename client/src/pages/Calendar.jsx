import {
  React, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import * as api from '../api';
import styles from '../styles/Calendar.module.css';
import ColorBlobs from '../assets/images/color_blobs.svg';
import * as constants from '../constants';
import CalendarEventForm from '../components/CalendarEventForm';
import UpcomingEvents from '../components/UpcomingEvents';

/*

CALENDAR PAGE
- Display calendar with all events
- Admins can add events
- Show location, start time, end time, description on click

TODO: Have a popup come up for invalid name/start date/end date
TODO: Have different calendars for each service area, be able to specify service area when adding event
TOOD: Display event info on click
TODO: 'Add an event' form as a popup
TODO: Export calendar functionality?

*/

function Calendar({ profile }) {
  const { role, serviceArea } = profile;
  const currRole = role.toLowerCase();
  const {
    REACT_APP_GOOGLE_CALENDAR_API_KEY,
  } = process.env;
  const calendarRef = useRef();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEventClick = (eventInfo) => {
    eventInfo.jsEvent.preventDefault();
  };

  const dropEvent = (info) => {
    let endTime;
    // fullcalendar makes end date null if it's the same as the start date
    if (info.oldEvent.end === null) {
      endTime = info.event.start;
    } else {
      endTime = info.event.end;
    }
    const eventData = {
      id: info.event.id,
      start: info.event.start,
      end: endTime,
    };
    // update event using patchEvent
    api.patchEvent(eventData);
  };

  // Return cal id(s) based on user role (admin = all cals, non-admin = only their service area)
  const getCalendarByRole = () => {
    if (currRole === 'admin') {
      return [
        {
          googleCalendarId: constants.calIdFOTC,
          className: 'fotc-events',
          color: 'rgba(0, 170, 238, 0.2)',
        },
        {
          googleCalendarId: constants.calIdAV,
          className: 'av-events',
          color: 'rgba(238, 187, 17, 0.2)',
        },
        {
          googleCalendarId: constants.calIdMS,
          className: 'ms-events',
          color: 'rgba(255, 85, 34, 0.2)',
        },
      ];
    }
    if (serviceArea.toLowerCase() === 'av') {
      return [{
        googleCalendarId: constants.calIdAV,
        className: 'av-events',
        color: 'rgba(238, 187, 17, 0.2)',
      }];
    } if (serviceArea.toLowerCase() === 'ms') {
      return [{
        googleCalendarId: constants.calIdMS,
        className: 'ms-events',
        color: 'rgba(255, 85, 34, 0.2)',
      }];
    }
    return [{
      googleCalendarId: constants.calIdFOTC,
      className: 'fotc-events',
      color: 'rgba(0, 170, 238, 0.2)',
    }];
  };

  const calendarInfo = getCalendarByRole();

  return (
    <div className={styles.calendar_container}>
      <h1 className={styles.title}>Calendar</h1>
      <img className={styles.blobs} alt="color blobs" src={ColorBlobs} />
      <div className={styles.container}>
        {currRole === 'admin' && (
        <div className={styles.buttonBox}>
          <button className={styles.addEventButton} type="button" onClick={handleClickOpen}>
            + Add Event
          </button>
        </div>
        )}
        <div className={styles.contentContainer}>
          <div className={styles.calendar}>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              selectable
              editable={currRole === 'admin'}
              eventDrop={currRole === 'admin' ? dropEvent : null}
              selectMirror
              dayMaxEvents
              eventColor="rgba(0, 170, 238, 0.2)"
              eventTextColor="black"
              fixedWeekCount={false}
              googleCalendarApiKey={REACT_APP_GOOGLE_CALENDAR_API_KEY}
              eventSources={calendarInfo}
              eventClick={handleEventClick}
            />
          </div>
          <div className={styles.upcomingEvents}>
            {/* FIX CALENDAR ID  */}
            <UpcomingEvents profile={profile} calendarId={constants.calIdFOTC} />
          </div>
        </div>
      </div>
      <CalendarEventForm profile={profile} getCalendarRef={() => calendarRef} open={open} handleClose={handleClose} />
    </div>
  );
}

Calendar.propTypes = {
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
};

export default Calendar;
