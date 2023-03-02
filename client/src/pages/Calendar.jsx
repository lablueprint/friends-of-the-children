// import React from 'react';
// import PropTypes from 'prop-types';

// export default Calendar;

import { React, useState, createRef } from 'react';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import styles from '../styles/Calendar.module.css';

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

  const calendarRef = createRef();

  const [title, setTitle] = useState('');
  // const [location, setLocation] = useState('');
  // const [descrip, setDescrip] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const addEventFunc = (e) => {
    e.preventDefault();
    const eventArray = {
      title,
      start: startTime,
      end: endTime,
    };
    const api = calendarRef.current.getApi();
    api.addEvent(eventArray);
    console.log(eventArray);
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

      <form onSubmit={(e) => addEventFunc(e)}>
        <h1>Upload Module</h1>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        {/* Description:
        <input type="text" value={descrip} onChange={(e) => setDescrip(e.target.value)} />
        Location:
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} /> */}
        Start Time:
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        End Time:
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

        <button type="submit">Add Event</button>

      </form>

    </div>
  );
}

export default Calendar;