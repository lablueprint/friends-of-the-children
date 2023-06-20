import { React, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import * as api from '../api';
import styles from '../styles/Calendar.module.css';
import * as constants from '../constants';

function CalendarEventForm({ profile, getCalendarRef }) {
  const { serviceArea } = profile;
  // Get default event service area based off user's service area
  const [eventServiceArea, setEventServiceArea] = useState(serviceArea.toUpperCase());

  const addEvent = (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const description = e.target.description.value;
    const location = e.target.location.value;
    const attachments = [];
    const fileUrl = e.target.attachments.value;
    const start = e.target.start.value;
    const end = e.target.end.value;

    let calendarId; // Admin users will specify event service area
    if (eventServiceArea === 'AV') { calendarId = constants.calIdAV; } else if (eventServiceArea === 'MS') { calendarId = constants.calIdMS; } else { calendarId = constants.calIdFOTC; }

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
      calendarId,
    };

    // add event to actual google calendar
    api.createEvent(event).then((eventID) => {
      // append google calendar's event ID into the fullcalendar event object (so we can update the event through the frontend with google's api, which requires eventID)
      event.id = eventID;
      // add event on fullcalendar
      const calApi = getCalendarRef().current.getApi(); // GETTING CAUGHT HERE GETaPI
      calApi.addEvent(event);
    });
    // TODO: remove this manual reload and fix color of calendar bug
    window.location.reload();
    e.target.reset();
  };

  return (
    <div>
      <form onSubmit={(e) => addEvent(e)}>
        <h1>FOTC test Calendar</h1>
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
        <FormControl>
          <InputLabel>Service Area</InputLabel>
          <Select
            id="serviceArea"
            label="Service Area"
            defaultValue="FOTC"
            value={eventServiceArea}
            onChange={(e) => setEventServiceArea(e.target.value)}
            className={styles.textfield}
          >
            {/* TODO: update to NPO's real service areas */ }
            <MenuItem value="FOTC">FOTC</MenuItem>
            <MenuItem value="AV">AV</MenuItem>
            <MenuItem value="MS">MS</MenuItem>
          </Select>
        </FormControl>
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
}

CalendarEventForm.propTypes = {
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
export default CalendarEventForm;
