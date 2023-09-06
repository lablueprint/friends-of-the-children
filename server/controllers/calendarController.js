// import google api
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { google } = require('googleapis');

// fotc google auth information
const CREDENTIALS = JSON.parse(process.env.REACT_APP_GOOGLE_AUTH_CREDENTIALS);
// const calendarId = process.env.CALENDAR_ID;
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({ version: 'v3' });

const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES,
);

// TODO: list events from multiple calendars
const getEvents = async (req, res) => {
  const { start, end, calendarId } = req.query;
  try {
    const response = await calendar.events.list({
      auth,
      calendarId,
      timeMin: start,
      timeMax: end,
    });
    const events = response.data.items.reverse();
    res.status(202).json(events);
  } catch (error) {
    res.status(400).json(error);
  }
};

// inserts an event to google calendar
const createEvent = async (req, res) => {
  try {
    const {
      title, description, location, attachments, start, end, calendarId,
    } = req.body;
    // call gcal api's "insert" method w valid json object
    const response = await calendar.events.insert({
      auth,
      calendarId,
      supportsAttachments: true,
      requestBody: {
        summary: title,
        description,
        location,
        attachments,
        start: {
          dateTime: new Date(start),
        },
        end: {
          dateTime: new Date(end),
        },
      },
    });
    // promise chain to send response back to client
    res.status(202).json(response.data);
  } catch (error) {
    res.status(400).json(error);
  }
};

// updates gcal event without modifying any unspecified event properties (requires eventID)
const patchEvent = async (req, res) => {
  try {
    const {
      id, start, end, calendarId,
    } = req.body;
    // call gcal api's "patch" method
    const response = await calendar.events.patch({
      auth,
      calendarId: 'primary',
      eventId: id,
      requestBody: {
        start: {
          dateTime: start,
          date: null,
        },
        end: {
          dateTime: end,
          date: null,
        },
      },
    });
    res.status(202).json(response.data);
  } catch (error) {
    res.status(400).json(error);
  }
};

export {
  getEvents,
  createEvent,
  patchEvent,
};
