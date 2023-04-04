import { React, createRef } from 'react';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import styles from '../styles/Calendar.module.css';

/*

CALENDAR PAGE
- Display calendar with all events
- Admins can add events
- Show location, start time, end time, description on click

TODO: Remove console.log statements
TODO: Have a popup come up for invalid name/start date/end date
TODO: Have different calendars for each service area, be able to specify service area when adding event
TOOD: Display event info on click
TODO: 'Add an event' form as a popup
TODO: Export calendar functionality?

*/

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
    const startTime = e.target.startTime.value;
    const endTime = e.target.endTime.value;
    const event = {
      title,
      start: startTime,
      end: endTime,
    };

    // add event on fullcalendar interface
    const api = calendarRef.current.getApi();
    api.addEvent(event);

    // add event to actual google calendar
    const gapi = process.env.REACT_APP_FIREBASE_CALENDAR_ID;
    console.log(gapi);
    gapi.client.calendar.events.insert({
      calendarId: 'fofthechildren@gmail.com',
      event,
    });
    console.log(event);
  };

  return (
    <div>
      <div>
        <form onSubmit={(e) => addEventFunc(e)}>
          <h1>FOTC Calendar</h1>
          Title:
          <input type="text" name="title" />
          {/* Description:
          <input type="text" value={descrip} onChange={(e) => setDescrip(e.target.value)} />
          Location:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} /> */}
          Start Time:
          <input type="datetime-local" name="startTime" />
          End Time:
          <input type="datetime-local" name="endTime" />
          <button type="submit">Add Event</button>
        </form>
      </div>
      <div className={styles.calendar}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable
          editable
          selectMirror
          dayMaxEvents
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
