import React from 'react';
import PropTypes from 'prop-types';

function Calendar({ profile }) {
  // remove later
  console.log(profile);

  return (
    <div>
      Calendar page
    </div>
  );
}

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

export default Calendar;
