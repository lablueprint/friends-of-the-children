import React from 'react';
// import PropTypes from 'prop-types';
import logo from '../logo.svg';

function Default(profile) {
  // remove later
  console.log(profile);

  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit
        {' '}
        <code>src/App.js</code>
        {' '}
        and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  );
}

// TODO: Might need to fix this later
// Default.propTypes = {
//   profile: PropTypes.shape({
//     firstName: PropTypes.string.isRequired,
//     lastName: PropTypes.string.isRequired,
//     username: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     role: PropTypes.string.isRequired,
//     serviceArea: PropTypes.string.isRequired,
//   }).isRequired,
// };

export default Default;
