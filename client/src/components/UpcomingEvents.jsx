import { React, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Calendar.module.css';

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
  };

  useEffect(getUpcomingEvents, []);

  return (
    <div className={styles['calendar-container']}>
      <div className={styles['upcoming-events']}>
        <h2>Upcoming Events</h2>
        <div>{serviceArea}</div>
        {upcomingEvents.map((event) => (
          <div key={event.id} className={styles.event}>
            <div className={styles['event-date']}>
              <span>
                {event.start.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
              </span>
              <span className={styles['event-bullet']}>&bull;</span>
              <span>
                {`${event.start.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' }).replace(' ', '')} - ${event.end.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' }).replace(' ', '')}`}
              </span>

            </div>
            <h3 className={styles['event-title']}>{event.title}</h3>
            <div className={styles['event-description']}>
              <p>{event.extendedProps.description}</p>
            </div>
          </div>
        ))}
      </div>
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
