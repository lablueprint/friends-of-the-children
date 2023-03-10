// import React from 'react';
// import PropTypes from 'prop-types';

// export default Calendar;

import React from 'react';
// import Calendar from '@ericz1803/react-google-calendar';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import { Calendar } from '@fullcalendar/core';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable

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

function Example() {
  const handleEventClick = (eventInfo) => {
    eventInfo.jsEvent.preventDefault();
    alert('a day has been clicked');
    console.log(eventInfo.event.title);
    if (eventInfo.event.extendedProps.location) {
      console.log('Location: ', eventInfo.event.extendedProps.location);
    } else {
      console.log('Location: No Location');
    }
    console.log('Start time: ', eventInfo.event.start);
    console.log('End time: ', eventInfo.event.end);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        googleCalendarApiKey={process.env.REACT_APP_FIREBASE_CALENDAR_ID}
        events={{
          googleCalendarId: 'ayubali2443@gmail.com',
          className: 'gcal-event',
        }}
        selectable
        eventClick={handleEventClick}
        eventContent={renderEventContent}
      />

    </div>
  );
}

export default Example;
