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

const getEvents = async (req, res) => {
  const { start, end, calendars } = req.body;
  try {
    const events = [];
    // list events from all calendars
    const calendarPromises = calendars.map(async (cal) => {
      try {
        const calendarId = cal.googleCalendarId;
        const response = await calendar.events.list({
          auth,
          calendarId,
          timeMin: start,
          timeMax: end,
        });
        const currCalEvents = response.data.items.map((item) => ({ ...item, class: cal.className }));
        events.push(...currCalEvents);
      } catch (error) {
        console.error(error);
      }
    });
    await Promise.all(calendarPromises);
    // sort events from closest to furthest based on start time
    events.sort((a, b) => {
      // event objects either have "date" or "dateTime" fields
      if ((a.start.dateTime || a.start.date) > (b.start.dateTime || b.start.date)) return 1;
      if ((a.start.dateTime || a.start.date) < (b.start.dateTime || b.start.date)) return -1;
      return 0;
    });
    res.status(202).json(events);
  } catch (error) {
    res.status(400).json(error);
  }
};

// inserts an event to google calendar
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      attachments,
      start,
      end,
      calendarId,
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
    console.error(error);
    res.status(400).json(error);
  }
};

// updates gcal event without modifying any unspecified event properties (requires eventID)
const patchEvent = async (req, res) => {
  try {
    const {
      id, start, end,
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

export { getEvents, createEvent, patchEvent };
