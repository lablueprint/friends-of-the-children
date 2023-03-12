import { React, createRef } from 'react';
import PropTypes from 'prop-types';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import { createEvent, updateEvent } from '../api/index';
import styles from '../styles/Calendar.module.css';
import ColorBlobs from '../assets/images/color_blobs.svg';

function Calendar({ profile }) {
  const { role } = profile;
  const currRole = role.toLowerCase();

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

  const addEvent = (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const description = e.target.description.value;
    const location = e.target.location.value;
    const attachments = [];
    const fileUrl = e.target.attachments.value;
    const start = e.target.start.value;
    const end = e.target.end.value;
    // check if user inputs an attachment
    if (e.target.attachments.value) {
      attachments.push({ fileUrl, title: 'an attachment!' });
    }
    // create json event object
    const event = {
      title,
      description,
      location,
      start,
      end,
      attachments,
    };
    // add event to actual google calendar
    createEvent(event).then((eventID) => {
      // append google calendar's event ID into the fullcalendar event object (so we can update the event through the frontend with google's api, which requires eventID)
      event.id = eventID;
      // add event on fullcalendar interface
      const api = calendarRef.current.getApi();
      api.addEvent(event);
      console.log(event.end);
    });
    e.target.reset();
  };

  const dropEvent = (info) => {
    const date = new Date();
    const duration = info.delta.days;
    let newEndDate;
    // fullcalendar makes end date null if it's the same as the start date :/
    if (info.oldEvent.end === null) {
      newEndDate = info.event.start;
    } else {
      // set new end date to the old end date + the amt of time the the block was dragged across
      newEndDate = new Date(date.setDate(info.oldEvent.end.getDate() + duration));
    }
    const eventData = {
      id: info.event.id,
      start: info.event.start,
      end: newEndDate,
      title: info.event.title,
    };
    // call updateEvent api route
    updateEvent(eventData);
  };

  if (currRole === 'admin') {
    return (
      <div>
        <img className={styles.blobs} alt="color blobs" src={ColorBlobs} />
        <div>
          <form onSubmit={(e) => addEvent(e)}>
            <h1>FOTC Calendar</h1>
            Title:
            <input type="text" name="title" required />
            Description:
            <input type="text" name="description" />
            Location:
            <input type="text" name="location" />
            Attachments (Google link):
            <input type="text" name="attachments" />
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
            editable
            // update event when you drag & drop an event on the interface (for admin only)
            eventDrop={dropEvent}
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

  return (
    <div>
      <img className={styles.blobs} alt="color blobs" src={ColorBlobs} />
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
