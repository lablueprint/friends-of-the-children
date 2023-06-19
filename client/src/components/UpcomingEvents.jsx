import { React, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function UpcomingEvents({ profile, getCalendarRef }) {
  const { serviceArea } = profile;
  // Get default event service area based off user's service area
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const getUpcomingEvents = () => {
    // really jank but only loads events after half a second so that the ref is valid
    const timer = setTimeout(() => {
      if (getCalendarRef()) {
        const events = getCalendarRef().current.getApi().getEvents();
        setUpcomingEvents(events);
        console.log(events);
        console.log(getCalendarRef());
      }
    }, 500);

    return () => clearTimeout(timer);

    //   events.forEach((event) => {
    //     const eventStart = event.start;
    //     const eventEnd = event.end;
    //     const eventMonth = eventStart.toLocaleString('default', { month: 'long' });
    //     const eventDay = eventStart.getDate();
    //     const eventYear = eventStart.getFullYear();
    //     const eventStartTime = eventStart.toLocaleString('en-US', { timeStyle: 'short' });
    //     const eventEndTime = eventEnd ? eventEnd.toLocaleString('en-US', { timeStyle: 'short' }) : '';
    //     const eventDescription = event.extendedProps.description || 'No description available'; // Extract description or provide a default value
    //     console.log(`Event '${event.title}' is on ${eventMonth} ${eventDay}, ${eventYear} from ${eventStartTime} to ${eventEndTime}. Description: ${eventDescription}`);
    //   });
    // }
  };

  useEffect(getUpcomingEvents, []);

  return (
    <div>
      <h2>Upcoming Events</h2>
      <div>
        {serviceArea}
      </div>
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
  );
}

UpcomingEvents.propTypes = {
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
  getCalendarRef: PropTypes.func.isRequired,
};

export default UpcomingEvents;
