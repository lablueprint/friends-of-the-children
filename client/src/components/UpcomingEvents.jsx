import { React, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Calendar.module.css';
import * as api from '../api';

function UpcomingEvents({ profile, calendarId }) {
  const { serviceArea } = profile;
  // Get default event service area based off user's service area
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // format the datetime string returned by event object
  function formatDateTime(inputDateTimeString) {
    const inputDate = new Date(inputDateTimeString);
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getDate()).padStart(2, '0');
    const year = inputDate.getFullYear();
    const hour = String(inputDate.getHours() % 12 || 12).padStart(2, '0');
    const minute = String(inputDate.getMinutes()).padStart(2, '0');
    const ampm = inputDate.getHours() < 12 ? 'AM' : 'PM';
    const formattedDateTime = `${month}/${day}/${year} ${hour}:${minute} ${ampm}`;
    return formattedDateTime;
  }

  useEffect(() => {
    api.getEvents(calendarId).then((events) => {
      setUpcomingEvents(events.data);
    });
  }, []);

  return (
    <div className={styles['calendar-container']}>
      <div className={styles['upcoming-events']}>
        <h2>Upcoming Events</h2>
        <div>{serviceArea}</div>
        {upcomingEvents.map((event) => (
          <div key={event.id} className={styles.event}>
            <div className={styles['event-date']}>
              <span>
                {formatDateTime(event.start.dateTime)}
              </span>
              <span className={styles['event-bullet']}>&bull;</span>
              <span>
                {formatDateTime(event.end.dateTime)}
              </span>

            </div>
            <h3 className={styles['event-title']}>{event.summary}</h3>
            <div className={styles['event-description']}>
              <p>{event.description}</p>
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
  calendarId: PropTypes.string.isRequired, // TODO: MAKE THIS AN ARRAY
};

export default UpcomingEvents;
