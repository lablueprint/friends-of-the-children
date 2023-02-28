// import React from 'react';
// import PropTypes from 'prop-types';

// export default Calendar;

import { React, useState, createRef } from 'react';
// import Calendar from '@ericz1803/react-google-calendar';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import { Calendar } from '@fullcalendar/core';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import styles from '../styles/Calendar.module.css';

// function renderEventContent(eventInfo) {
//   console.log(eventInfo);
//   return (
//     <>
//       <b>{eventInfo.timeText}</b>
//       <i>{eventInfo.event.title}</i>
//       <p>{eventInfo.event.extendedProps.location}</p>
//       <p>
//         {eventInfo.event.start.toLocaleString()}
//         {' '}
//         -
//         {' '}
//         {eventInfo.event.end.toLocaleString()}
//       </p>

//     </>
//   );
// }

function Calendar() {
  // const handleEventClick = (eventInfo) => {
  //   eventInfo.jsEvent.preventDefault();
  //   // alert('a day has been clicked');
  //   console.log(eventInfo.event.title);
  //   if (eventInfo.event.extendedProps.location) {
  //     console.log('Location: ', eventInfo.event.extendedProps.location);
  //   } else {
  //     console.log('Location: No Location');
  //   }
  //   console.log('Start time: ', eventInfo.event.start);
  //   console.log('End time: ', eventInfo.event.end);
  // };

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [descrip, setDescrip] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const calendarRef = createRef();

  const addEvent = () => {
    const event = {
      title,
      start: startTime,
      end: endTime,
      editable: true,
      // description: descrip,
      // location,
    };
    console.log(event);
    const api = calendarRef.current.getApi();
    api.addEvent(event);
  };

  return (
    <div className={styles.calendar}>
      <form action="post">
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

        <button className={styles.submit_button} type="button" onClick={(e) => addEvent(e)}>Add Event</button>

      </form>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable
        editable
        selectMirror
        dayMaxEvents
        eventBorderColor="black"
        googleCalendarApiKey={process.env.REACT_APP_FIREBASE_CALENDAR_ID}
        events={{
          googleCalendarId: 'fofthechildren@gmail.com',
          className: 'gcal-event',
        }}

        // eventClick={handleEventClick}
        // eventContent={renderEventContent}
        // showNonCurrentDates={false}
      />

    </div>
  );
}

export default Calendar;
