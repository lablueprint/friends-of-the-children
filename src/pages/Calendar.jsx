// import React from 'react';
import PropTypes from 'prop-types';

// export default Calendar;

import React from 'react';
import Calendar from '@ericz1803/react-google-calendar';

// function Calendar({ profile }) {
//   // remove later
//   console.log(profile);

//   return (
//     <div>
//       Calendar page
//     </div>
//   );
// }

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

const API_KEY = process.env.REACT_APP_FIREBASE_CALENDAR_ID;
const calendars = [
  { calendarId: 'hejwa9@gmail.com' },
  {
    calendarId: 'ayubali2443@gmail.com',
    color: '#B241D1', // optional, specify color of calendar 2 events
  },
];

function Example() {
  return (
    <div>
      <Calendar apiKey={API_KEY} calendars={calendars} />
    </div>
  );
}

export default Example;
