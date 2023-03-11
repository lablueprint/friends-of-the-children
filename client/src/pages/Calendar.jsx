import { React, createRef } from 'react';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import { createEvent } from '../api/index';
import styles from '../styles/Calendar.module.css';
import ColorBlobs from '../assets/color_blobs.svg';

function Calendar() {
  const calendarRef = createRef();

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

  const addEventFunc = (e) => {
    e.preventDefault();
    // create json event object
    const title = e.target.title.value;
    const description = e.target.description.value;
    const location = e.target.location.value;
    const start = e.target.start.value;
    const end = e.target.end.value;
    const event = {
      title,
      description,
      location,
      start,
      end,
    };

    // add event on fullcalendar interface
    const api = calendarRef.current.getApi();
    api.addEvent(event);

    // add event to actual google calendar
    createEvent(event);
  };

  return (
    <div>
      <img className={styles.blobs} alt="color blobs" src={ColorBlobs} />
      <div>
        <form onSubmit={(e) => addEventFunc(e)}>
          <h1>FOTC Calendar</h1>
          Title:
          <input type="text" name="title" required />
          Description:
          <input type="text" name="description" />
          Location:
          <input type="text" name="location" />
          Start Time:
          <input type="datetime-local" name="start" required />
          End Time:
          <input type="datetime-local" name="end" required />
          <button type="submit">Add Event</button>
        </form>
      </div>

      <div className={styles.calendar}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable
          selectMirror
          dayMaxEvents
          eventColor="rgba(0, 170, 238, 0.2)"
          eventTextColor="black"
          fixedWeekCount={false}
          googleCalendarApiKey={process.env.REACT_APP_FIREBASE_CALENDAR_ID}
          events={{
            googleCalendarId: 'fofthechildren@gmail.com',
            className: 'gcal-event',
          }}
          eventClick={handleEventClick}
        />
      </div>
    </div>
  );
}

export default Calendar;
