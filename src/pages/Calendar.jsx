import { React, useState, createRef } from 'react';
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
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [descrip, setDescrip] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const calendarRef = createRef();

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

  const addEvent = (e) => {
    e.preventDefault();
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
      <form onSubmit={(e) => addEvent(e)}>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        Description:
        <input type="text" value={descrip} onChange={(e) => setDescrip(e.target.value)} />
        Location:
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        Start Time:
        <input type="date" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        End Time:
        <input type="date" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        <button className={styles.submit_button} type="submit">Add Event</button>
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
          googleCalendarId: 'fofthechildren@gmail.com',
          className: 'gcal-event',
        }}
        // eventClick={handleEventClick}
        // eventContent={renderEventContent}
      />

    </div>
  );
}

export default Calendar;
