import { React, createRef } from 'react';
import PropTypes from 'prop-types';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import * as api from '../api';
import styles from '../styles/Calendar.module.css';
import ColorBlobs from '../assets/images/color_blobs.svg';
import * as constants from '../constants.js';
import CalendarEventForm from '../components/CalendarEventForm.jsx';

function Calendar({ profile }) {
  const { role, serviceArea } = profile;
  const currRole = role.toLowerCase();
  const {
    REACT_APP_FIREBASE_CALENDAR_ID,
  } = process.env;

  const calendarRef = createRef();
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
    if (currRole === "admin") {
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
        }
      ]
    } else {
      if (serviceArea.toLowerCase() === "av") {
        return [{
          googleCalendarId: constants.calIdAV,
          className: 'av-events',
          color: 'rgba(238, 187, 17, 0.2)',
        }]
      } else if (serviceArea.toLowerCase() === "ms") {
        return [{
          googleCalendarId: constants.calIdMS,
          className: 'ms-events',
          color: 'rgba(255, 85, 34, 0.2)',
        }]
      } else {
        return [{
          googleCalendarId: constants.calIdFOTC,
          className: 'fotc-events',
          color: 'rgba(0, 170, 238, 0.2)',
        }]
      }
    }
  }
  const calendarInfo = getCalendarByRole();

  return (
    <div>
      <img className={styles.blobs} alt="color blobs" src={ColorBlobs} />
      {currRole === "admin" ?  // enable add event form iff admin
        <CalendarEventForm profile={profile}/> : null }
      <div className={styles.calendar}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable
          editable={currRole === "admin" ? true : false}
          eventDrop={currRole === "admin" ? dropEvent : null}
          selectMirror
          dayMaxEvents
          eventColor="rgba(0, 170, 238, 0.2)"
          eventTextColor="black"
          fixedWeekCount={false}
          googleCalendarApiKey={REACT_APP_FIREBASE_CALENDAR_ID}
          eventSources={calendarInfo}
          eventClick={handleEventClick}
        />
      </div>
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
  }).isRequired,
};
export default Calendar;
