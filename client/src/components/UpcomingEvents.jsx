import { React, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Calendar.module.css';
import * as api from '../api';

function UpcomingEvents({ profile, calendars }) {
  console.log(profile.role);
  // Get default event service area based off user's service area
  const [upcomingEvents, setUpcomingEvents] = useState(null);

  // format the datetime string returned by event object
  function formatDateTime(inputDateTimeString) {
    const inputDate = new Date(inputDateTimeString);
    const month = String(inputDate.getMonth() + 1);
    const day = String(inputDate.getDate());
    const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    const dayOfWeek = daysOfWeek[inputDate.getDay()];
    const hour = String(inputDate.getHours() % 12 || 12);
    const minute = String(inputDate.getMinutes()).padStart(2, '0');
    const ampm = inputDate.getHours() < 12 ? 'am' : 'pm';
    const formattedDateTime = `${dayOfWeek}, ${month}/${day} @${hour}:${minute}${ampm}`;
    return formattedDateTime;
  }

  useEffect(() => {
    // date range = 1 week
    const currDate = new Date();
    const futureDate = new Date(currDate);
    futureDate.setDate(currDate.getDate() + 7);
    // format the dates in RFC3339 timestamp format
    const currDateString = currDate.toISOString();
    const futureDateString = futureDate.toISOString();
    api.getEvents(currDateString, futureDateString, calendars).then((events) => {
      setUpcomingEvents(events.data);
    });
  }, []);

  return (
    <div className={styles['upcoming-events']}>
      <h2 className={styles['upcoming-events-title']}>Upcoming Events</h2>
      {!upcomingEvents && <p>Loading...</p>}
      {upcomingEvents && upcomingEvents.map((event) => (
        <div key={event.id} className={styles.event}>
          <div className={styles['event-date']}>
            <div className={styles[event.class]} />
            {event.start.dateTime ? formatDateTime(event.start.dateTime) : formatDateTime(event.start.date)}
          </div>
          <h3 className={styles['event-title']}>{event.summary}</h3>
          <p className={styles['event-description']}>
            {event.description}
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
  calendars: PropTypes.arrayOf.isRequired,
};

export default UpcomingEvents;
