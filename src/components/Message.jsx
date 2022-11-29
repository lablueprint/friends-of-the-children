import React from 'react';
import PropTypes from 'prop-types';

function Message(props) {
  const { title } = props;
  return (
    <div>
      <h3>{title}</h3>
    </div>
  );
}

Message.propTypes = {
  title: PropTypes.string.isRequired,
};
export default Message;
