// import { React, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
// import googleCalendarPlugin from '@fullcalendar/google-calendar';
// import FullCalendar from '@fullcalendar/react'; // must go before plugins
// import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
// import interactionPlugin from '@fullcalendar/interaction'; // for selectable
// import * as api from '../api';
// import styles from '../styles/Calendar.module.css';
// import ColorBlobs from '../assets/images/color_blobs.svg';
// import * as constants from '../constants';
// import CalendarEventForm from '../components/CalendarEventForm';

// /*

// CALENDAR PAGE
// - Display calendar with all events
// - Admins can add events
// - Show location, start time, end time, description on click

// TODO: Have a popup come up for invalid name/start date/end date
// TODO: Have different calendars for each service area, be able to specify service area when adding event
// TOOD: Display event info on click
// TODO: 'Add an event' form as a popup
// TODO: Export calendar functionality?

// */

// function Calendar({ profile }) {
//   const { role, serviceArea } = profile;
//   const currRole = role.toLowerCase();
//   const {
//     REACT_APP_FIREBASE_CALENDAR_ID,
//   } = process.env;

//   const calendarRef = useRef();
//   const [upcomingEvents, setUpcomingEvents] = useState([]);
//   const handleEventClick = (eventInfo) => {
//     eventInfo.jsEvent.preventDefault();
//   };

//   const handleButtonClick = () => {
//     if (calendarRef.current) {
//       const events = calendarRef.current.getApi().getEvents();
//       setUpcomingEvents(events);
//       console.log(events);

//       events.forEach((event) => {
//         const eventStart = event.start;
//         const eventEnd = event.end;
//         const eventMonth = eventStart.toLocaleString('default', { month: 'long' });
//         const eventDay = eventStart.getDate();
//         const eventYear = eventStart.getFullYear();
//         const eventStartTime = eventStart.toLocaleString('en-US', { timeStyle: 'short' });
//         const eventEndTime = eventEnd ? eventEnd.toLocaleString('en-US', { timeStyle: 'short' }) : '';
//         const eventDescription = event.extendedProps.description || 'No description available'; // Extract description or provide a default value
//         console.log(`Event '${event.title}' is on ${eventMonth} ${eventDay}, ${eventYear} from ${eventStartTime} to ${eventEndTime}. Description: ${eventDescription}`);
//       });
//     }
//   };

//   const dropEvent = (info) => {
//     let endTime;
//     // fullcalendar makes end date null if it's the same as the start date
//     if (info.oldEvent.end === null) {
//       endTime = info.event.start;
//     } else {
//       endTime = info.event.end;
//     }
//     const eventData = {
//       id: info.event.id,
//       start: info.event.start,
//       end: endTime,
//     };
//     // update event using patchEvent
//     api.patchEvent(eventData);
//   };

//   // Return cal id(s) based on user role (admin = all cals, non-admin = only their service area)
//   const getCalendarByRole = () => {
//     if (currRole === 'admin') {
//       return [
//         {
//           googleCalendarId: constants.calIdFOTC,
//           className: 'fotc-events',
//           color: 'rgba(0, 170, 238, 0.2)',
//         },
//         {
//           googleCalendarId: constants.calIdAV,
//           className: 'av-events',
//           color: 'rgba(238, 187, 17, 0.2)',
//         },
//         {
//           googleCalendarId: constants.calIdMS,
//           className: 'ms-events',
//           color: 'rgba(255, 85, 34, 0.2)',
//         },
//       ];
//     }
//     if (serviceArea.toLowerCase() === 'av') {
//       return [{
//         googleCalendarId: constants.calIdAV,
//         className: 'av-events',
//         color: 'rgba(238, 187, 17, 0.2)',
//       }];
//     } if (serviceArea.toLowerCase() === 'ms') {
//       return [{
//         googleCalendarId: constants.calIdMS,
//         className: 'ms-events',
//         color: 'rgba(255, 85, 34, 0.2)',
//       }];
//     }
//     return [{
//       googleCalendarId: constants.calIdFOTC,
//       className: 'fotc-events',
//       color: 'rgba(0, 170, 238, 0.2)',
//     }];
//   };
//   const calendarInfo = getCalendarByRole();

//   const createForm = () => (currRole === 'admin' // enable add event form iff admin
//     ? <CalendarEventForm profile={profile} getCalendarRef={() => (calendarRef)} /> : null);

//   return (
//     <div>
//       <img className={styles.blobs} alt="color blobs" src={ColorBlobs} />
//       {createForm()}
//       <div className={styles.calendar}>
//         <FullCalendar
//           ref={calendarRef}
//           plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           selectable
//           editable={currRole === 'admin'}
//           eventDrop={currRole === 'admin' ? dropEvent : null}
//           selectMirror
//           dayMaxEvents
//           eventColor="rgba(0, 170, 238, 0.2)"
//           eventTextColor="black"
//           fixedWeekCount={false}
//           googleCalendarApiKey={REACT_APP_FIREBASE_CALENDAR_ID}
//           eventSources={calendarInfo}
//           eventClick={handleEventClick}
//         />
//       </div>
//       <button type="button" onClick={handleButtonClick}> Events </button>
//       <div>
//         <h2>Upcoming Events</h2>
//         {upcomingEvents.map((event) => (
//           <div key={event.id}>
//             <h3>{event.title}</h3>
//             <p>
//               Date:
//               {' '}
//               {event.start.toLocaleDateString()}
//               {' '}
//               <br />
//               Time:
//               {' '}
//               {event.start.toLocaleTimeString()}
//               {' '}
//               -
//               {' '}
//               {event.end.toLocaleTimeString()}
//               {' '}
//               <br />
//               Description:
//               {' '}
//               {event.extendedProps.description}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// Calendar.propTypes = {
//   profile: PropTypes.shape({
//     firstName: PropTypes.string.isRequired,
//     lastName: PropTypes.string.isRequired,
//     username: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     role: PropTypes.string.isRequired,
//     serviceArea: PropTypes.string.isRequired,
//     image: PropTypes.string.isRequired,
//     bio: PropTypes.string.isRequired,
//     id: PropTypes.string.isRequired,
//     google: PropTypes.bool,
//     mentees: PropTypes.arrayOf(PropTypes.string).isRequired,
//   }).isRequired,
// };
// export default Calendar;

import {
  React, useRef, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import * as api from '../api';
import styles from '../styles/Calendar.module.css';
import ColorBlobs from '../assets/images/color_blobs.svg';
import * as constants from '../constants';
import CalendarEventForm from '../components/CalendarEventForm';

function Calendar({ profile }) {
  const { role, serviceArea } = profile;
  const currRole = role.toLowerCase();
  const {
    REACT_APP_FIREBASE_CALENDAR_ID,
  } = process.env;

  const calendarRef = useRef();
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const getCalendarRef = () => calendarRef;

  const fetchEvents = async () => {
    console.log(getCalendarRef());
    if (getCalendarRef()) {
      const events = await getCalendarRef().current.getApi().getEvents();
      console.log(getCalendarRef().current.getApi());
      console.log(events);
      setUpcomingEvents(events);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventClick = (eventInfo) => {
    eventInfo.jsEvent.preventDefault();
  };

  const dropEvent = (info) => {
    let endTime;
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
    api.patchEvent(eventData);
  };

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

  const createForm = () => (currRole === 'admin'
    ? <CalendarEventForm profile={profile} getCalendarRef={() => calendarRef} />
    : null);

  return (
    <div>
      <img className={styles.blobs} alt="color blobs" src={ColorBlobs} />
      {createForm()}
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
          googleCalendarApiKey={REACT_APP_FIREBASE_CALENDAR_ID}
          eventSources={calendarInfo}
          eventClick={handleEventClick}
        />
      </div>
      <div>
        <h2>Upcoming Events</h2>
        {upcomingEvents.map((event) => (
          <div key={event.id}>
            <h3>{event.title}</h3>
            <p>
              Date:
              {' '}
              {event.start.toLocaleDateString()}
              {' '}
              <br />
              Time:
              {' '}
              {event.start.toLocaleTimeString()}
              {' '}
              -
              {' '}
              {event.end.toLocaleTimeString()}
              {' '}
              <br />
              Description:
              {' '}
              {event.extendedProps.description}
            </p>
          </div>
        ))}
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
    image: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    google: PropTypes.bool,
    mentees: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default Calendar;
