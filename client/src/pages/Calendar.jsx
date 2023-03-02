import { React, createRef } from 'react';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import styles from '../styles/Calendar.module.css';

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
    const title = e.target.title.value;
    const startTime = e.target.startTime.value;
    const endTime = e.target.endTime.value;
    const eventArray = {
      title,
      start: startTime,
      end: endTime,
    };
  
    const api = calendarRef.current.getApi();
    api.addEvent(eventArray);

    const gapi = process.env.REACT_APP_FIREBASE_CALENDAR_ID;
    console.log(gapi.client);
    gapi.client.calendar.events.insert({
      calendarId: 'fofthechildren@gmail.com',
      resource: eventArray,
    });
    console.log(eventArray);
  };

  return (
    <div className={styles.calendar}>
      <form onSubmit={(e) => addEventFunc(e)}>
        <h1>Upload Module</h1>
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
          googleCalendarId: 'ayubali2443@gmail.com',
          className: 'gcal-event',
        }}
        eventClick={handleEventClick}
        // eventContent={renderEventContent}
      />
    </div>
  );
}

export default Calendar;