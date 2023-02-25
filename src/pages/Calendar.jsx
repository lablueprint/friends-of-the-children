// import React from 'react';
// import PropTypes from 'prop-types';

// export default Calendar;

import { React, useState } from 'react';
// import Calendar from '@ericz1803/react-google-calendar';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import { Calendar } from '@fullcalendar/core';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import styles from '../styles/Calendar.module.css';

// function Calendar({ profile }) {
//   // remove later
//   console.log(profile);

//   return (
//     <div>
//       Calendar page
//     </div>
//   );
// }

// calendar.propTypes = {
//   profile: PropTypes.shape({
//     firstName: PropTypes.string.isRequired,
//     lastName: PropTypes.string.isRequired,
//     username: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     role: PropTypes.string.isRequired,
//     serviceArea: PropTypes.string.isRequired,
//   }).isRequired,
// };

// const API_KEY = process.env.REACT_APP_FIREBASE_CALENDAR_ID;
// const calendars = [
//   { calendarId: 'hejwa9@gmail.com' },
//   {
//     calendarId: 'ayubali2443@gmail.com',
//     color: '#B241D1', // optional, specify color of calendar 2 events
//   },
// ];

function renderEventContent(eventInfo) {
  console.log(eventInfo);
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
      <p>{eventInfo.event.extendedProps.location}</p>
      <p>
        {eventInfo.event.start.toLocaleString()}
        {' '}
        -
        {' '}
        {eventInfo.event.end.toLocaleString()}
      </p>

    </>
  );
}

function Calendar() {
  const handleEventClick = (eventInfo) => {
    eventInfo.jsEvent.preventDefault();
    // alert('a day has been clicked');
    console.log(eventInfo.event.title);
    if (eventInfo.event.extendedProps.location) {
      console.log('Location: ', eventInfo.event.extendedProps.location);
    } else {
      console.log('Location: No Location');
    }
    console.log('Start time: ', eventInfo.event.start);
    console.log('End time: ', eventInfo.event.end);
  };

  const calendarRef = React.createRef();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [descrip, setDescrip] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const addEvent = (e) => {
    const api = calendarRef.current.getApi();
    api.addEvent(e);
  };

  return (
    <div className={styles.calendar}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        googleCalendarApiKey={process.env.REACT_APP_FIREBASE_CALENDAR_ID}
        events={{
          googleCalendarId: 'fofthechildren@gmail.com',
          className: 'gcal-event',
        }}
        selectable
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        showNonCurrentDates={false}
      />

      <form action="post">
        <h1>Upload Module</h1>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        Description:
        <input type="text" value={descrip} onChange={(e) => setDescrip(e.target.value)} />
        Location:
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        Start Time:
        <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        End Time:
        <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

        <button type="button" onClick={(e) => addEvent(e)}>Submit</button>

      </form>

    </div>
  );
}

export default Calendar;
