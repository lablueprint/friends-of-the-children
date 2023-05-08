import { React, useState, createRef } from 'react';
import PropTypes from 'prop-types';
import * as api from '../api';
import styles from '../styles/Calendar.module.css';
import * as constants from '../constants.js';
import {
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';

function CalendarEventForm({ profile }) {
  const { serviceArea } = profile;
  // Get default event service area based off user's service area
  const [eventServiceArea, setEventServiceArea] = useState(serviceArea.toUpperCase());

  const calendarRef = createRef();

  const addEvent = (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const description = e.target.description.value;
    const location = e.target.location.value;
    const attachments = [];
    const fileUrl = e.target.attachments.value;
    const start = e.target.start.value;
    const end = e.target.end.value;

    console.log("add event 1!" + title);

    let calendarId; // Admin users will specify event service area
    if(eventServiceArea === "AV")
      calendarId = constants.calIdAV;
    else if (eventServiceArea === "MS")
      calendarId = constants.calIdMS;
    else
      calendarId = constants.calIdFOTC;
          
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

    console.log("add event 2!" + event.start);
    // add event to actual google calendar
    api.createEvent(event).then((eventID) => {
      console.log("add event 3!" + eventID);
      // append google calendar's event ID into the fullcalendar event object (so we can update the event through the frontend with google's api, which requires eventID)
      event.id = eventID;
      // add event on fullcalendar 
      console.log("calendar current is " + calendarRef.current);
      const calApi = calendarRef.current.getApi(); // GETTING CAUGHT HERE GETaPI
      calApi.addEvent(event);
      console.log("event data");
      console.log(event)
    });
    e.target.reset();
  };

  return (
      <div ref={calendarRef}>
        {console.log("calendar ref is " + JSON.stringify(calendarRef))}
        {console.log("calendar current in return is " + calendarRef.current)}
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
  }).isRequired,
};
export default CalendarEventForm;
